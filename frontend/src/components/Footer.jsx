import React from 'react';
import '../css/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-links">
          <a
            href="https://github.com/Dharani9018/Flashcard_App"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            GitHub
          </a>
        </div>
        <div className="footer-credit">
          <p>© {new Date().getFullYear()} Flashcard App. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;