import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";
import FeatureParallax from "./FeatureParallax";
import Footer from "./Footer";

import AboutPage from "./AboutPage";
import CollectionPage from "./CollectionPage";
import ScrollToTop from "./components/ScrollToTop";

import { AuthProvider } from "./portal/AuthContext";
import ArtistJoin from "./portal/ArtistJoin";
import ArtistLogin from "./portal/ArtistLogin";
import ArtistDashboard from "./portal/ArtistDashboard";
import AdminDashboard from "./portal/AdminDashboard";
import LegalPage from "./portal/LegalPage";
import NewArtworks from "./portal/NewArtworks";

import "./AppStyles.css";

function App() {
  return (
    <AuthProvider>
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
                <NewArtworks />
                <Footer />
              </>
            }
          />

          {/* ARTIST PORTAL */}
          <Route path="/artists/join" element={<ArtistJoin />} />
          <Route path="/artists/login" element={<ArtistLogin />} />
          <Route path="/portal" element={<ArtistDashboard />} />

          {/* ADMIN */}
          <Route path="/admin" element={<AdminDashboard />} />

          {/* LEGAL DOCUMENTS */}
          <Route path="/legal/:slug" element={<LegalPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
