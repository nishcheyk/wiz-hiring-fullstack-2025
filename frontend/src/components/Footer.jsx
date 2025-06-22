import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        &copy; {new Date().getFullYear()} Nishchey Khajuria. All rights reserved.
        <span style={{ marginLeft: 16, color: '#a78bfa', fontWeight: 500, cursor: 'pointer' }} onClick={() => window.open('mailto:nishcheycapture2014@gmail.com')}>More</span>
      </div>
    </footer>
  );
}

export default Footer;
