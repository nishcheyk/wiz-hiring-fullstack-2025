import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        &copy; {new Date().getFullYear()} Nishchey Khajuria. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
