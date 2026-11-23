import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import artists from "../artists";
import { supabase, artworkImageUrl, ENQUIRY_EMAIL } from "../supabaseClient";
import { formatSize, pricingLine } from "../portal/format";
import "./CataloguePage.css";

/* ---------- Build one flat list of works ---------- */

function initials(name) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Works from the original collection (images bundled with the site).
function collectionWorks() {
  const list = [];
  artists.forEach((artist) => {
    const images = [];
    if (artist.batches) {
      artist.batches.forEach((b) => images.push(b.cover, ...b.works));
    } else {
      images.push(artist.cover, ...(artist.works || []));
    }
    const unique = [...new Set(images.filter(Boolean))];
    const code = initials(artist.name);
    unique.forEach((src, i) => {
      list.push({
        id: `${code}-${i + 1}`,
        artist: artist.name,
        src,
        ref: `${code}-${String(i + 1).padStart(2, "0")}`,
      });
    });
  });
  return list;
}

// Works uploaded through the artist portal and approved.
function portalWork(a) {
  return {
    id: `p-${a.id}`,
    artist: a.artist_name,
    src: artworkImageUrl(a.image_path),
    title: a.title,
    details: [a.medium, formatSize(a.width_cm, a.height_cm), a.year].filter(Boolean).join(", "),
    price: pricingLine(a).replace(/ · /g, ", "),
    description: a.description,
    isNew: true,
  };
}

function enquiryLink(work) {
  const name = work.title ? `"${work.title}" by ${work.artist}` : `a work by ${work.artist} (ref. ${work.ref})`;
  const subject = `Enquiry about ${name}`;
  const body = `Hello DIFinearts,\n\nI'm interested in ${name}.\nI'd like to: rent it / buy it / both (please choose)\n\nName:\nCompany:\nPhone:\n`;
  return `mailto:${ENQUIRY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/* ---------- Lightbox ---------- */

function Viewer({ works, index, onClose, onMove }) {
  const work = works[index];
  const closeRef = useRef(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onMove(1);
      if (e.key === "ArrowLeft") onMove(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onMove]);

  if (!work) return null;

  return (
    <div
      className="cat-viewer"
      role="dialog"
      aria-modal="true"
      aria-label={`Work by ${work.artist}`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <button ref={closeRef} className="cat-viewer-close" onClick={onClose}>
        Close
      </button>

      <div className="cat-viewer-stage" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <button className="cat-viewer-arrow prev" onClick={() => onMove(-1)} aria-label="Previous work">
          ‹
        </button>
        <img key={work.id} src={work.src} alt={work.title || `Work by ${work.artist}`} />
        <button className="cat-viewer-arrow next" onClick={() => onMove(1)} aria-label="Next work">
          ›
        </button>
      </div>

      <aside className="cat-viewer-label">
        <p className="cat-viewer-artist">{work.artist}</p>
        <h2>{work.title || "Untitled"}</h2>
        {work.details && <p className="cat-viewer-meta">{work.details}</p>}
        {!work.title && <p className="cat-viewer-meta">Reference {work.ref}</p>}
        {work.description && <p className="cat-viewer-desc">{work.description}</p>}
        <p className="cat-viewer-price">{work.price || "Available to rent or buy. Price on request."}</p>
        <a className="df-btn cat-viewer-cta" href={enquiryLink(work)}>
          Enquire about this work
        </a>
        <p className="cat-viewer-count">
          {index + 1} of {works.length}
        </p>
      </aside>
    </div>
  );
}

/* Number of columns for the wall, by screen width. Works are dealt
   into columns left to right, so they read in order across each row. */
function useColumnCount() {
  const pick = () => {
    const w = window.innerWidth;
    if (w >= 1100) return 4;
    if (w >= 820) return 3;
    return 2;
  };
  const [count, setCount] = useState(pick);
  useEffect(() => {
    const onResize = () => setCount(pick());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return count;
}

/* ---------- Page ---------- */

export default function CataloguePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const selected = new URLSearchParams(location.search || "").get("artist") || "";

  const baseWorks = useMemo(() => collectionWorks(), []);
  const [newWorks, setNewWorks] = useState([]);
  const [open, setOpen] = useState(null);
  const columnCount = useColumnCount();

  useEffect(() => {
    let active = true;
    supabase
      .from("public_artworks")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (active) setNewWorks((data || []).map(portalWork));
      });
    return () => {
      active = false;
    };
  }, []);

  const allWorks = useMemo(() => [...newWorks, ...baseWorks], [newWorks, baseWorks]);
  const artistNames = useMemo(() => {
    const names = new Set(allWorks.map((w) => w.artist));
    return [...names].sort((a, b) => a.localeCompare(b));
  }, [allWorks]);

  // One small image per artist for the filter: their cover if we have one,
  // otherwise their first work.
  const thumbs = useMemo(() => {
    const map = {};
    artists.forEach((a) => {
      map[a.name] = a.cover;
    });
    allWorks.forEach((w) => {
      if (!map[w.artist]) map[w.artist] = w.src;
    });
    return map;
  }, [allWorks]);
  const mosaic = artists.slice(0, 4).map((a) => a.cover);

  const works = selected ? allWorks.filter((w) => w.artist === selected) : allWorks;

  const choose = (name) => {
    setOpen(null);
    navigate(name ? `/catalogue?artist=${encodeURIComponent(name)}` : "/catalogue");
  };

  const move = useCallback(
    (step) => setOpen((i) => (i === null ? i : (i + step + works.length) % works.length)),
    [works.length]
  );
  const close = useCallback(() => setOpen(null), []);

  return (
    <main className="cat-page">
      <header className="cat-head">
        <h1>{selected || "The collection"}</h1>
        <p>
          {selected
            ? `${works.length} works by ${selected}. Select any work to see it larger and ask about renting or buying it.`
            : `${allWorks.length} original works by ${artistNames.length} artists. Select any work to see it larger and ask about renting or buying it.`}
        </p>
      </header>

      <nav className={`cat-filter ${selected ? "has-choice" : ""}`} aria-label="Filter by artist">
        <div className="cat-filter-row">
          <button
            className={`cat-chip ${!selected ? "on" : ""}`}
            onClick={() => choose("")}
            aria-pressed={!selected}
          >
            <span className="cat-chip-art cat-chip-mosaic" aria-hidden="true">
              {mosaic.map((src, i) => (
                <img key={i} src={src} alt="" />
              ))}
            </span>
            <span className="cat-chip-name">All artists</span>
          </button>
          {artistNames.map((name) => (
            <button
              key={name}
              className={`cat-chip ${selected === name ? "on" : ""}`}
              onClick={() => choose(name)}
              aria-pressed={selected === name}
            >
              <span className="cat-chip-art" aria-hidden="true">
                <img src={thumbs[name]} alt="" loading="lazy" />
              </span>
              <span className="cat-chip-name">{name}</span>
            </button>
          ))}
        </div>
      </nav>

      <section className="cat-wall">
        {works.length === 0 && (
          <p className="cat-empty">
            No works to show for this artist yet. <button onClick={() => choose("")}>See all artists</button>
          </p>
        )}
        <div className="cat-columns">
          {Array.from({ length: columnCount }, (_, c) => (
            <div key={c} className="cat-column">
              {works.map((w, i) =>
                i % columnCount !== c ? null : (
                  <button key={w.id} className="cat-work" onClick={() => setOpen(i)}>
                    <span className="cat-frame">
                      <img src={w.src} alt={w.title || `Work by ${w.artist}`} loading="lazy" />
                    </span>
                    <span className="cat-label">
                      <strong>{w.artist}</strong>
                      <span>{w.title || `Ref. ${w.ref}`}</span>
                      {w.isNew && <em>Recently added</em>}
                    </span>
                  </button>
                )
              )}
            </div>
          ))}
        </div>
      </section>

      {open !== null && <Viewer works={works} index={open} onClose={close} onMove={move} />}
    </main>
  );
}
