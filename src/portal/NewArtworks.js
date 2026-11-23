import React, { useEffect, useState } from "react";
import { supabase, artworkImageUrl, ENQUIRY_EMAIL } from "../supabaseClient";
import { formatSize, pricingLine } from "./format";
import "./Portal.css";

// Shows approved artworks uploaded through the artist portal.
// Renders nothing until at least one artwork has been approved.
export default function NewArtworks() {
  const [works, setWorks] = useState([]);
  const [zoom, setZoom] = useState(null);

  useEffect(() => {
    let active = true;
    supabase
      .from("public_artworks")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (active) setWorks(data || []);
      });
    return () => {
      active = false;
    };
  }, []);

  if (works.length === 0) return null;

  function enquiryLink(art) {
    const subject = `Enquiry: "${art.title}" by ${art.artist_name}`;
    const body = `Hello DIFinearts,\n\nI'm interested in "${art.title}" by ${art.artist_name}.\nI'd like to: buy / rent (please delete one)\n\nName:\nPhone:\nCity:\n`;
    return `mailto:${ENQUIRY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <section className="pt-public">
      <div className="pt-public-head">
        <p className="pt-eyebrow">Available now</p>
        <h2 className="pt-title">Buy or rent original work</h2>
      </div>
      <div className="pt-grid">
        {works.map((art) => (
          <article key={art.id} className="pt-art">
            <button className="pt-art-img pt-zoomable" onClick={() => setZoom(art)}>
              <img src={artworkImageUrl(art.image_path)} alt={`${art.title} by ${art.artist_name}`} loading="lazy" />
            </button>
            <div className="pt-art-body">
              <h3>{art.title}</h3>
              <p>{art.artist_name}</p>
              <p className="pt-muted">
                {[art.medium, formatSize(art.width_cm, art.height_cm), art.year].filter(Boolean).join(" · ")}
              </p>
              <p className="pt-price">{pricingLine(art)}</p>
              <a className="pt-btn pt-btn-sm" href={enquiryLink(art)}>
                Enquire to buy or rent
              </a>
            </div>
          </article>
        ))}
      </div>

      {zoom && (
        <div className="pt-lightbox" onClick={() => setZoom(null)}>
          <img src={artworkImageUrl(zoom.image_path)} alt={zoom.title} />
        </div>
      )}
    </section>
  );
}
