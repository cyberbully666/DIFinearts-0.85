import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";
import FeatureParallax from "./FeatureParallax";
import Footer from "./Footer";

import AboutPage from "./AboutPage";
import CollectionPage from "./CollectionPage"; // <-- flat structure now
import ScrollToTop from "./components/ScrollToTop";
import './AppStyles.css';

function App() {
  return (
    <Router>
      <ScrollToTop />

      <Navbar />

      <Routes>
        {/* HOME PAGE */}
        <Route
          path="/"
          element={
            <>
              <HeroSection />
              <AboutSection />
              <FeatureParallax />
              <Footer />
            </>
          }
        />

        {/* ABOUT PAGE */}
        <Route path="/about" element={<AboutPage />} />

        {/* COLLECTION / CATALOGUE PAGE */}
        <Route
          path="/catalogue"
          element={
            <>
              <CollectionPage />
              <Footer />
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
