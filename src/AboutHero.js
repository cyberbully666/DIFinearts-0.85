import React from "react";
import "./AboutHero.css";
import aboutImage from "./assets/artworks/breed-culture.jpg";

function AboutHero() {
  return (
    <section
      className="about-hero"
      style={{ backgroundImage: `url(${aboutImage})` }}
    >
      <div className="about-hero-overlay"></div>
    </section>
  );
}

export default AboutHero;
