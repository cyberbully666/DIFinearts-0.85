import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-main">
        {/* Column 1: Contact */}
        <div className="footer-col">
          <h3 className="footer-title">Get in Touch</h3>
          <p>Phone: +91 8800754221</p>
          <p>Email: difinearts.official@gmail.com</p>
          <p>Address: 100 Shivalik Apartments, Alaknanda, New Delhi 110019</p>
        </div>

        {/* Column 2: Newsletter */}
        <div className="footer-col">
          <h3 className="footer-title">Newsletter</h3>
          <p>Subscribe to our newsletter to get updates.</p>
          <form className="footer-form" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              className="footer-input"
              placeholder="Your email"
              required
            />
            <button type="submit" className="footer-button">
              Subscribe
            </button>
          </form>
        </div>

        {/* Column 3: Quick Links */}
        <div className="footer-col">
          <h3 className="footer-title">Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/catalogue">Catalogue</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} DIfinearts. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
