import React, { useState, useEffect, useRef } from "react";
import artists from "./artists";
import "./CollectionPage.css";
import './CollectionPageMobile.css';

const CollectionPage = () => {
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const ghostRef = useRef(null);
  const gridRef = useRef(null);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }); // re-attach after each render so the handler always sees the latest state

  // Adjust grid margin to allow slight overlap with ghost title
  useEffect(() => {
    const adjustGridMargin = () => {
      if (ghostRef.current && gridRef.current) {
        const ghostHeight = ghostRef.current.offsetHeight;
        const overlap = 0.15; // 15% overlap
        gridRef.current.style.marginTop = `${-ghostHeight * overlap}px`;
      }
    };
    adjustGridMargin();
    window.addEventListener("resize", adjustGridMargin);
    return () => window.removeEventListener("resize", adjustGridMargin);
  }, []);

  const getDisplayWorks = () => {
    if (selectedBatch) return [selectedBatch.cover, ...selectedBatch.works];
    if (selectedArtist && !selectedArtist.batches)
      return [selectedArtist.cover, ...selectedArtist.works];
    return [];
  };

  const openArtist = (artist) => {
    setSelectedArtist(artist);
    setSelectedBatch(null);
    setLightboxIndex(null);
  };
  const openBatch = (batch) => {
    setSelectedBatch(batch);
    setLightboxIndex(null);
  };
  const backToBatches = () => {
    setSelectedBatch(null);
    setLightboxIndex(null);
  };
  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const closeAll = () => {
    setSelectedArtist(null);
    setSelectedBatch(null);
    setLightboxIndex(null);
  };

  const nextImage = () => {
    const works = getDisplayWorks();
    setLightboxIndex((lightboxIndex + 1) % works.length);
  };
  const prevImage = () => {
    const works = getDisplayWorks();
    setLightboxIndex((lightboxIndex - 1 + works.length) % works.length);
  };

  const overlayClick = (e) => {
    if (!e.target.classList.contains("overlay")) return;
    if (lightboxIndex !== null) closeLightbox();
    else if (selectedBatch) backToBatches();
    else closeAll();
  };

  return (
    <div className="collection-page">
      {/* Ghost-style title */}
      <div ref={ghostRef} className="collection-ghost-title">
        ARTISTS
      </div>

      {/* ARTIST GRID */}
      <div ref={gridRef} className="artist-grid">
        {artists.map((artist, idx) => (
          <div
            key={idx}
            className="artist-card"
            onClick={() => openArtist(artist)}
          >
            <img
              src={artist.cover}
              alt={artist.name}
              className="artist-cover"
            />
            <div className="artist-name">{artist.name}</div>
          </div>
        ))}
      </div>

      {/* ARTIST / BATCH OVERLAY */}
      {selectedArtist && lightboxIndex === null && (
        <div className="overlay" onClick={overlayClick}>
          <div className="artist-overlay">
            <button className="close-btn" onClick={closeAll}>
              &times;
            </button>

            {selectedArtist.batches && selectedBatch && (
              <button className="back-btn" onClick={backToBatches}>
                ← Back to Batches
              </button>
            )}

            {/* BATCH GRID */}
            {selectedArtist.batches && !selectedBatch && (
              <div className="artist-overlay-grid">
                {selectedArtist.batches.map((batch, idx) => {
                  const preview1 = batch.works?.[0];
                  const preview2 = batch.works?.[1];

                  return (
                    <div
                      key={idx}
                      className="batch-card"
                      onClick={() => openBatch(batch)}
                    >
                      {preview2 && (
                        <img
                          src={preview2}
                          alt=""
                          className="batch-preview preview-2"
                        />
                      )}
                      {preview1 && (
                        <img
                          src={preview1}
                          alt=""
                          className="batch-preview preview-1"
                        />
                      )}

                      <img
                        src={batch.cover}
                        alt={`Batch ${idx + 1}`}
                        className="batch-main"
                      />

                      <div className="batch-badge">
                        Batch {batch.batchNumber ?? idx + 1}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* WORKS GRID (BATCH) */}
            {selectedBatch && (
              <div className="artist-overlay-grid">
                {[selectedBatch.cover, ...selectedBatch.works].map(
                  (work, idx) => (
                    <img
                      key={idx}
                      src={work}
                      alt={`Work ${idx + 1}`}
                      className="artist-overlay-img"
                      onClick={() => openLightbox(idx)}
                    />
                  )
                )}
              </div>
            )}

            {/* WORKS GRID (NON-BATCH) */}
            {!selectedArtist.batches && (
              <div className="artist-overlay-grid">
                {[selectedArtist.cover, ...selectedArtist.works].map(
                  (work, idx) => (
                    <img
                      key={idx}
                      src={work}
                      alt={`Work ${idx + 1}`}
                      className="artist-overlay-img"
                      onClick={() => openLightbox(idx)}
                    />
                  )
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* LIGHTBOX */}
      {lightboxIndex !== null && (
        <div className="overlay" onClick={overlayClick}>
          <div className="lightbox-overlay">
            <button className="close-btn" onClick={closeLightbox}>
              &times;
            </button>

            <button className="nav-btn prev-btn" onClick={prevImage}>
              &#10094;
            </button>

            <img
              src={getDisplayWorks()[lightboxIndex]}
              alt="Artwork"
              className="lightbox-img"
            />

            <button className="nav-btn next-btn" onClick={nextImage}>
              &#10095;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionPage;
