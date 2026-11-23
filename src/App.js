import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./Navbar";
import HomePage from "./home/HomePage";
import Footer from "./Footer";

import About from "./about/About";
import CataloguePage from "./catalogue/CataloguePage";
import ScrollToTop from "./components/ScrollToTop";

import { AuthProvider } from "./portal/AuthContext";
import ArtistJoin from "./portal/ArtistJoin";
import ArtistLogin from "./portal/ArtistLogin";
import ArtistDashboard from "./portal/ArtistDashboard";
import AdminDashboard from "./portal/AdminDashboard";
import LegalPage from "./portal/LegalPage";

import "./AppStyles.css";
import "./theme.css";

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
                <HomePage />
                <Footer />
              </>
            }
          />

          {/* ABOUT PAGE */}
          <Route
            path="/about"
            element={
              <>
                <About />
                <Footer />
              </>
            }
          />

          {/* COLLECTION / CATALOGUE PAGE */}
          <Route
            path="/catalogue"
            element={
              <>
                <CataloguePage />
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
