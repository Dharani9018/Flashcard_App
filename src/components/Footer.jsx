import React from 'react';
import '../css/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-links">
          <a href="/Contact" className="footer-link">Contact</a>
          <a
            href="https://github.com/disha-bose-8/FLASHCARD-APP-PROJECT"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            GitHub
          </a>
          <a href="/" className="footer-link">About</a>
        </div>
        <div className="footer-credit">
          <p>© {new Date().getFullYear()} Flashcard App. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;