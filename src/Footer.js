import React from "react";
import "./App.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-main">
        {/* Column 1: Contact */}
        <div className="footer-col">
          <h3 className="footer-title">Get in Touch</h3>
          <p>Phone: +91-123-456-7890</p>
          <p>Email: contact@dIfinearts.com</p>
          <p>Address: Your Office Address, City, State, Country</p>
        </div>

        {/* Column 2: Newsletter */}
        <div className="footer-col">
          <h3 className="footer-title">Newsletter</h3>
          <p>Subscribe to our newsletter to get updates.</p>
          <form className="footer-form">
            <input
              type="email"
              className="footer-input"
              placeholder="Your email"
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
            <li><a href="#about">About Us</a></li>
            <li><a href="#gallery">Gallery</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a href="#blog">Blog</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} DIfinearts. All rights reserved.</p>
        <div className="footer-social">
          {/* Instagram */}
          <a href="#" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.975.975 1.246 2.242 1.308 3.608.058 1.266.07 1.645.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.332 2.633-1.308 3.608-.975.975-2.242 1.246-3.608 1.308-1.266.058-1.645.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.332-3.608-1.308-.975-.975-1.246-2.242-1.308-3.608C2.175 15.647 2.163 15.268 2.163 12s.012-3.584.07-4.85c.062-1.366.332-2.633 1.308-3.608.975-.975 2.242-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.012 7.052.07 5.765.127 4.575.422 3.636 1.36 2.697 2.299 2.402 3.489 2.345 4.776 2.287 6.056 2.275 6.465 2.275 12s.012 5.944.07 7.224c.057 1.287.352 2.477 1.291 3.416.939.939 2.129 1.234 3.416 1.291 1.28.058 1.689.07 7.224.07s5.944-.012 7.224-.07c1.287-.057 2.477-.352 3.416-1.291.939-.939 1.234-2.129 1.291-3.416.058-1.28.07-1.689.07-7.224s-.012-5.944-.07-7.224c-.057-1.287-.352-2.477-1.291-3.416C19.476.422 18.286.127 17 .07 15.719.012 15.309 0 12 0z"/>
              <path d="M12 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998z"/>
              <circle cx="18.406" cy="5.594" r="1.44"/>
            </svg>
          </a>

          {/* Twitter */}
          <a href="#" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 4.557a9.83 9.83 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724 9.864 9.864 0 0 1-3.127 1.195 4.916 4.916 0 0 0-8.384 4.482C7.69 8.094 4.066 6.13 1.64 3.161a4.822 4.822 0 0 0-.666 2.475 4.917 4.917 0 0 0 2.188 4.096 4.902 4.902 0 0 1-2.228-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.935 4.935 0 0 1-2.224.085 4.918 4.918 0 0 0 4.59 3.417A9.867 9.867 0 0 1 0 19.54a13.94 13.94 0 0 0 7.548 2.212c9.057 0 14.009-7.496 14.009-13.986 0-.21 0-.423-.016-.634A10.025 10.025 0 0 0 24 4.557z"/>
            </svg>
          </a>

          {/* Facebook */}
          <a href="#" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.675 0h-21.35C.597 0 0 .597 0 1.325v21.351C0 23.403.597 24 1.325 24h11.495v-9.294H9.691v-3.622h3.129V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.794.143v3.24l-1.918.001c-1.504 0-1.795.716-1.795 1.764v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.403 24 24 23.403 24 22.676V1.325C24 .597 23.403 0 22.675 0z"/>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
