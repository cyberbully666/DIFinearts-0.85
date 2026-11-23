import React, { useCallback, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { supabase, artworkImageUrl } from "../supabaseClient";
import { useAuth } from "./AuthContext";
import { formatDate, formatSize, pricingLine } from "./format";
import "./Portal.css";

const STATUS_TEXT = { pending: "Pending", approved: "Approved", rejected: "Rejected" };

function StatusBadge({ status }) {
  return <span className={`pt-badge pt-badge-${status}`}>{STATUS_TEXT[status] || status}</span>;
}

function FilterBar({ value, onChange, counts }) {
  return (
    <div className="pt-filter">
      {["pending", "approved", "rejected", "all"].map((s) => (
        <button key={s} className={value === s ? "active" : ""} onClick={() => onChange(s)}>
          {s === "all" ? "All" : STATUS_TEXT[s]} <span>{counts[s] ?? 0}</span>
        </button>
      ))}
    </div>
  );
}

function countBy(list) {
  return {
    pending: list.filter((x) => x.status === "pending").length,
    approved: list.filter((x) => x.status === "approved").length,
    rejected: list.filter((x) => x.status === "rejected").length,
    all: list.length,
  };
}

/* ---------- Artists ---------- */
function ArtistsTab({ artists, acceptances, artworks, onChanged }) {
  const [filter, setFilter] = useState("pending");
  const [openId, setOpenId] = useState(null);
  const shown = artists.filter((a) => filter === "all" || a.status === filter);

  async function setStatus(id, status) {
    await supabase.from("profiles").update({ status }).eq("id", id);
    onChanged();
  }

  return (
    <>
      <FilterBar value={filter} onChange={setFilter} counts={countBy(artists)} />
      {shown.length === 0 && <div className="pt-card pt-empty">Nothing here.</div>}
      <div className="pt-list">
        {shown.map((a) => {
          const accs = acceptances.filter((x) => x.user_id === a.id);
          const works = artworks.filter((w) => w.artist_id === a.id).length;
          const open = openId === a.id;
          return (
            <div key={a.id} className="pt-card pt-list-item">
              <div className="pt-list-head">
                <div>
                  <h3>{a.full_name || "(no name)"}</h3>
                  <p className="pt-muted">
                    {a.email}
                    {a.phone ? ` · ${a.phone}` : ""}
                    {a.city ? ` · ${a.city}` : ""} · joined {formatDate(a.created_at)} · {works}{" "}
                    artwork{works === 1 ? "" : "s"}
                  </p>
                </div>
                <StatusBadge status={a.status} />
              </div>

              <button className="pt-link-btn" onClick={() => setOpenId(open ? null : a.id)}>
                {open ? "Hide details" : "Show details"}
              </button>

              {open && (
                <div className="pt-details">
                  <p>
                    <strong>About:</strong> {a.bio || <span className="pt-muted">Not filled in yet.</span>}
                  </p>
                  <p>
                    <strong>Agreements accepted:</strong>
                  </p>
                  {accs.length === 0 ? (
                    <p className="pt-muted">None recorded.</p>
                  ) : (
                    <ul>
                      {accs.map((x) => (
                        <li key={x.id}>
                          {x.legal_documents?.title} (version {x.legal_documents?.version}) on{" "}
                          {new Date(x.accepted_at).toLocaleString("en-IN")}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {a.role !== "admin" && (
                <div className="pt-actions">
                  {a.status !== "approved" && (
                    <button className="pt-btn pt-btn-sm" onClick={() => setStatus(a.id, "approved")}>
                      Approve
                    </button>
                  )}
                  {a.status !== "rejected" && (
                    <button className="pt-btn pt-btn-sm pt-btn-ghost" onClick={() => setStatus(a.id, "rejected")}>
                      Reject
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ---------- Artworks ---------- */
function ArtworksTab({ artworks, onChanged }) {
  const [filter, setFilter] = useState("pending");
  const [notes, setNotes] = useState({});
  const [zoom, setZoom] = useState(null);
  const shown = artworks.filter((a) => filter === "all" || a.status === filter);

  async function setStatus(art, status) {
    await supabase
      .from("artworks")
      .update({ status, admin_note: status === "rejected" ? notes[art.id] || null : null })
      .eq("id", art.id);
    onChanged();
  }

  return (
    <>
      <FilterBar value={filter} onChange={setFilter} counts={countBy(artworks)} />
      {shown.length === 0 && <div className="pt-card pt-empty">Nothing here.</div>}
      <div className="pt-grid">
        {shown.map((art) => (
          <article key={art.id} className="pt-art">
            <button className="pt-art-img pt-zoomable" onClick={() => setZoom(art)}>
              <img src={artworkImageUrl(art.image_path)} alt={art.title} loading="lazy" />
            </button>
            <div className="pt-art-body">
              <div className="pt-art-top">
                <h3>{art.title}</h3>
                <StatusBadge status={art.status} />
              </div>
              <p>
                by <strong>{art.profiles?.full_name || "Unknown"}</strong>{" "}
                {art.profiles?.status !== "approved" && (
                  <span className="pt-muted">(artist not yet approved)</span>
                )}
              </p>
              <p className="pt-muted">
                {[art.medium, formatSize(art.width_cm, art.height_cm), art.year].filter(Boolean).join(" · ")}
              </p>
              <p>{pricingLine(art)}</p>
              {art.description && <p className="pt-muted">{art.description}</p>}
              {art.admin_note && <p className="pt-note">Note: {art.admin_note}</p>}

              <div className="pt-actions">
                {art.status !== "approved" && (
                  <button className="pt-btn pt-btn-sm" onClick={() => setStatus(art, "approved")}>
                    Approve
                  </button>
                )}
                {art.status !== "rejected" && (
                  <>
                    <input
                      className="pt-note-input"
                      placeholder="Reason (optional, the artist sees this)"
                      value={notes[art.id] || ""}
                      onChange={(e) => setNotes({ ...notes, [art.id]: e.target.value })}
                    />
                    <button className="pt-btn pt-btn-sm pt-btn-ghost" onClick={() => setStatus(art, "rejected")}>
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {zoom && (
        <div className="pt-lightbox" onClick={() => setZoom(null)}>
          <img src={artworkImageUrl(zoom.image_path)} alt={zoom.title} />
        </div>
      )}
    </>
  );
}

/* ---------- Legal documents ---------- */
function DocumentsTab({ docs, acceptances, artistCount, onChanged }) {
  const current = docs.filter((d) => d.is_current);
  const [editing, setEditing] = useState(null); // slug being edited, or "new"
  const [form, setForm] = useState({ slug: "", title: "", body: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function startEdit(doc) {
    setEditing(doc ? doc.slug : "new");
    setForm(doc ? { slug: doc.slug, title: doc.title, body: doc.body } : { slug: "", title: "", body: "" });
    setError("");
  }

  async function publish(e) {
    e.preventDefault();
    setError("");
    const slug =
      editing === "new"
        ? form.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
        : editing;
    if (!slug) return setError("Please give the document a title.");
    if (!form.body.trim()) return setError("The document text can't be empty.");

    const versions = docs.filter((d) => d.slug === slug).map((d) => d.version);
    const nextVersion = versions.length ? Math.max(...versions) + 1 : 1;

    setSaving(true);
    const { data: inserted, error: insErr } = await supabase
      .from("legal_documents")
      .insert({ slug, title: form.title.trim(), version: nextVersion, body: form.body, is_current: true })
      .select()
      .single();
    if (!insErr) {
      await supabase
        .from("legal_documents")
        .update({ is_current: false })
        .eq("slug", slug)
        .neq("id", inserted.id);
    }
    setSaving(false);
    if (insErr) return setError(insErr.message);
    setEditing(null);
    onChanged();
  }

  async function retire(doc) {
    if (!window.confirm(`Stop showing "${doc.title}" to artists? Past acceptances are kept.`)) return;
    await supabase.from("legal_documents").update({ is_current: false }).eq("id", doc.id);
    onChanged();
  }

  return (
    <>
      <p className="pt-muted">
        Artists must accept every document listed here when they sign up. When you publish a new
        version, existing artists are asked to accept it the next time they log in. Every acceptance
        is recorded with the date and time.
      </p>

      <div className="pt-list">
        {current.map((doc) => {
          const accepted = acceptances.filter((a) => a.document_id === doc.id).length;
          return (
            <div key={doc.id} className="pt-card pt-list-item">
              <div className="pt-list-head">
                <div>
                  <h3>{doc.title}</h3>
                  <p className="pt-muted">
                    Version {doc.version} · published {formatDate(doc.published_at)} · accepted by{" "}
                    {accepted} of {artistCount} artist{artistCount === 1 ? "" : "s"}
                  </p>
                </div>
                <Link to={`/legal/${doc.slug}`} target="_blank" rel="noreferrer">
                  View
                </Link>
              </div>
              <div className="pt-actions">
                <button className="pt-btn pt-btn-sm" onClick={() => startEdit(doc)}>
                  Publish new version
                </button>
                <button className="pt-btn pt-btn-sm pt-btn-ghost" onClick={() => retire(doc)}>
                  Stop using
                </button>
              </div>

              {editing === doc.slug && (
                <DocForm form={form} setForm={setForm} onSubmit={publish} onCancel={() => setEditing(null)} saving={saving} error={error} isNew={false} />
              )}
            </div>
          );
        })}
      </div>

      {editing === "new" ? (
        <div className="pt-card">
          <h3>New document</h3>
          <DocForm form={form} setForm={setForm} onSubmit={publish} onCancel={() => setEditing(null)} saving={saving} error={error} isNew />
        </div>
      ) : (
        <button className="pt-btn pt-btn-ghost" onClick={() => startEdit(null)}>
          + Add another document
        </button>
      )}
    </>
  );
}

function DocForm({ form, setForm, onSubmit, onCancel, saving, error, isNew }) {
  return (
    <form className="pt-form pt-doc-form" onSubmit={onSubmit}>
      <label className="pt-field">
        <span>Title</span>
        <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      </label>
      <label className="pt-field">
        <span>Full text (paste the document here)</span>
        <textarea rows={14} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
      </label>
      {error && <p className="pt-error">{error}</p>}
      <div className="pt-actions">
        <button className="pt-btn pt-btn-sm" type="submit" disabled={saving}>
          {saving ? "Publishing…" : isNew ? "Publish document" : "Publish as new version"}
        </button>
        <button className="pt-btn pt-btn-sm pt-btn-ghost" type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

/* ---------- Page ---------- */
export default function AdminDashboard() {
  const { user, profile, loading, signOut } = useAuth();
  const [tab, setTab] = useState("artworks");
  const [artists, setArtists] = useState([]);
  const [artworks, setArtworks] = useState([]);
  const [docs, setDocs] = useState([]);
  const [acceptances, setAcceptances] = useState([]);

  const isAdmin = profile?.role === "admin";

  const loadData = useCallback(async () => {
    if (!isAdmin) return;
    const [p, a, d, acc] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase
        .from("artworks")
        .select("*, profiles(full_name, status)")
        .order("created_at", { ascending: false }),
      supabase.from("legal_documents").select("*").order("slug").order("version", { ascending: false }),
      supabase
        .from("document_acceptances")
        .select("id, user_id, document_id, accepted_at, legal_documents(title, version)")
        .order("accepted_at", { ascending: false }),
    ]);
    setArtists((p.data || []).filter((x) => x.role !== "admin"));
    setArtworks(a.data || []);
    setDocs(d.data || []);
    setAcceptances(acc.data || []);
  }, [isAdmin]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) return <div className="pt-page pt-narrow pt-muted">Loading…</div>;
  if (!user) return <Navigate to="/artists/login" replace />;
  if (!profile) return <div className="pt-page pt-narrow pt-muted">Loading your account…</div>;
  if (!isAdmin) return <Navigate to="/portal" replace />;

  const pendingArtists = artists.filter((a) => a.status === "pending").length;
  const pendingWorks = artworks.filter((a) => a.status === "pending").length;

  return (
    <div className="pt-page">
      <div className="pt-header">
        <div>
          <p className="pt-eyebrow">DIFinearts admin</p>
          <h1 className="pt-title">Dashboard</h1>
          <p className="pt-muted">
            {pendingWorks} artwork{pendingWorks === 1 ? "" : "s"} and {pendingArtists} artist
            {pendingArtists === 1 ? "" : "s"} waiting for review
          </p>
        </div>
        <button className="pt-btn pt-btn-ghost" onClick={signOut}>
          Log out
        </button>
      </div>

      <nav className="pt-tabs">
        {[
          ["artworks", `Artworks${pendingWorks ? ` (${pendingWorks})` : ""}`],
          ["artists", `Artists${pendingArtists ? ` (${pendingArtists})` : ""}`],
          ["documents", "Legal documents"],
        ].map(([key, label]) => (
          <button key={key} className={tab === key ? "active" : ""} onClick={() => setTab(key)}>
            {label}
          </button>
        ))}
      </nav>

      {tab === "artworks" && <ArtworksTab artworks={artworks} onChanged={loadData} />}
      {tab === "artists" && (
        <ArtistsTab artists={artists} acceptances={acceptances} artworks={artworks} onChanged={loadData} />
      )}
      {tab === "documents" && (
        <DocumentsTab docs={docs} acceptances={acceptances} artistCount={artists.length} onChanged={loadData} />
      )}
    </div>
  );
}
