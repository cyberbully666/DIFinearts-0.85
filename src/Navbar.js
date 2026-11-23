import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./portal/AuthContext";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAdmin } = useAuth();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const portalLink = !user
    ? { to: "/artists/join", label: "For Artists" }
    : isAdmin
    ? { to: "/admin", label: "Admin" }
    : { to: "/portal", label: "My Portal" };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/" onClick={closeMenu}>
          <img
            src="https://raw.githubusercontent.com/cyberbully666/difinearts/main/logo.jpg"
            alt="DIFinearts Logo"
          />
        </Link>
      </div>

      <ul className={`navbar-links ${menuOpen ? "active" : ""}`}>
        <li>
          <Link to="/" onClick={closeMenu}>Home</Link>
        </li>
        <li>
          <Link to="/about" onClick={closeMenu}>About</Link>
        </li>
        <li>
          <Link to="/catalogue" onClick={closeMenu}>Catalogue</Link>
        </li>
        <li>
          <Link to={portalLink.to} onClick={closeMenu}>{portalLink.label}</Link>
        </li>
      </ul>

      <button className="menu-toggle" onClick={toggleMenu} aria-label="Open menu">
        ☰
      </button>
    </nav>
  );
}

export default Navbar;
