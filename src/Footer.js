import React from "react";
import { Link } from "react-router-dom";
import logo from "./assets/logo.jpg";
import "./Footer.css";

const EMAIL = "difinearts.official@gmail.com";
const PHONE = "+91 88007 54221";
const PHONE_LINK = "+918800754221";

const Footer = () => {
  return (
    <footer className="df-footer">
      <div className="df-footer-inner">
        <div className="df-footer-brand">
          <img src={logo} alt="DIFinearts" />
          <p>
            Original contemporary art for workplaces, curated in New Delhi.
          </p>
        </div>

        <div className="df-footer-col">
          <h2>Visit or write to us</h2>
          <address>
            100 Shivalik Apartments
            <br />
            Alaknanda, New Delhi 110019
          </address>
          <p>
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            <br />
            <a href={`tel:${PHONE_LINK}`}>{PHONE}</a>
          </p>
        </div>

        <div className="df-footer-col">
          <h2>Explore</h2>
          <ul>
            <li><Link to="/catalogue">Catalogue</Link></li>
            <li><Link to="/about">About us</Link></li>
            <li><Link to="/artists/join">Join as an artist</Link></li>
            <li><Link to="/artists/login">Artist login</Link></li>
          </ul>
        </div>

        <div className="df-footer-col">
          <h2>Agreements</h2>
          <ul>
            <li><Link to="/legal/artist-agreement">Artist agreement</Link></li>
            <li><Link to="/legal/terms-of-use">Terms of use</Link></li>
          </ul>
        </div>
      </div>

      <div className="df-footer-base">
        <p>© {new Date().getFullYear()} DIFinearts. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
