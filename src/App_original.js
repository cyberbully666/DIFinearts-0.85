import React from "react";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";
import FeatureParallax from "./FeatureParallax"; 
import OfficeArtText from "./OfficeArtText";     
import Footer from "./Footer"; // ✅ added footer

function App() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <AboutSection />
      <FeatureParallax />
      <OfficeArtText />
      <Footer /> {/* ✅ footer goes last */}
    </>
  );
}

export default App;
