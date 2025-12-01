import React from "react";
import "./LandingPage.css";
import logo from "./assets/logo.jpg";

function LandingPage() {
  return (
    <div className="landing-container">
      <div className="landing-content">

        <img
          src={logo}
          alt="DIFINEARTS Logo"
          className="landing-logo"
        />

        <h1 className="landing-title">
          DI<span className="finearts-shadow">FINEARTS</span>
        </h1>

        <p className="landing-tagline">Where Art Finds Its Place</p>

        <p className="landing-text">
          Our website is currently under development — something beautiful is coming.
          <br /><br />
          At DIFinearts, we believe art should be experienced, lived with, and celebrated.
          Whether you wish to rent art, lease artworks for your space, buy or sell pieces,
          or showcase your own creations, we are crafting a platform designed to redefine
          how India discovers and engages with fine art.
          <br /><br />
          From curated art rentals for homes, offices, and luxury environments to premium
          consignment opportunities for collectors and creators, we are building a refined
          ecosystem that uplifts both established and emerging artists.
          <br /><br />
          Rooted in Delhi–NCR with a growing presence across India, DIFinearts is dedicated
          to promoting artistic talent and bringing thoughtfully curated works to discerning
          art lovers.
          <br /><br />
          Stay tuned.  
          A sophisticated, immersive, and art-forward digital experience is on its way.
        </p>
        

      </div>
    </div>
  );
}

export default LandingPage;
