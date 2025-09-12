import React, { useState, useEffect } from "react";
import "./HeroSection.css";
import painting1 from "./assets/artworks/painting1.jpg";
import painting2 from "./assets/artworks/painting2.jpg";
import painting3 from "./assets/artworks/painting3.jpeg";

function HeroSection() {
  const images = [painting1, painting2, painting3];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section
      className="hero"
      style={{ backgroundImage: `url(${images[current]})` }}
    >
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1 className="hero-title">Fine Art Rentals for Corporate Spaces</h1>
        <p className="hero-subtitle">
          Curated artworks from top artists to transform your workspace.
        </p>
        <button className="cta-button">Browse Catalogue</button>
      </div>
    </section>
  );
}

export default HeroSection;
