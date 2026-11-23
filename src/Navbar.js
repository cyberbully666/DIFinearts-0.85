import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "./portal/AuthContext";
import logo from "./assets/logo.jpg";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const { user, isAdmin } = useAuth();

  const closeMenu = () => setMenuOpen(false);

  const portalLink = !user
    ? { to: "/artists/join", label: "For artists" }
    : isAdmin
    ? { to: "/admin", label: "Admin" }
    : { to: "/portal", label: "My portal" };

  const links = [
    { to: "/catalogue", label: "Catalogue" },
    { to: "/about", label: "About" },
    portalLink,
  ];

  return (
    <header className="df-nav">
      <div className="df-nav-inner">
        <Link to="/" className="df-nav-logo" onClick={closeMenu} aria-label="DIFinearts home">
          <img src={logo} alt="DIFinearts" />
        </Link>

        <button
          className="df-nav-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-controls="df-nav-links"
        >
          {menuOpen ? "Close" : "Menu"}
        </button>

        <nav id="df-nav-links" className={`df-nav-links ${menuOpen ? "open" : ""}`}>
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={closeMenu}
              className={pathname === l.to ? "active" : ""}
            >
              {l.label}
            </Link>
          ))}
          <a
            className="df-btn df-nav-cta"
            href="mailto:difinearts.official@gmail.com?subject=Art%20for%20our%20office"
            onClick={closeMenu}
          >
            Talk to a curator
          </a>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
