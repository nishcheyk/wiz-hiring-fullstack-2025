import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';
import './HeroSection.css';

function HeroSection() {
  return (
    <section className="hero-section slide-up">
      <div className="hero-content">
        <h1 className="hero-title">BookMySlot</h1>
        <p className="hero-subtitle">Effortless scheduling for everyone.<br />Create events, share slots, and let others book in seconds.</p>
        <div className="hero-actions">
          <Link to="/create"><Button>Create Event</Button></Link>
          <Link to="/" style={{ marginLeft: 16 }}><Button>Browse Events</Button></Link>
        </div>
      </div>
      <div className="hero-visual">
        <div className="hero-calendar-anim">
          <div className="calendar">
            <div className="calendar-header">JUNE 2025</div>
            <div className="calendar-body">
              <div className="calendar-row">
                <div className="calendar-cell highlight">20</div>
                <div className="calendar-cell">21</div>
                <div className="calendar-cell">22</div>
              </div>
              <div className="calendar-row">
                <div className="calendar-cell">23</div>
                <div className="calendar-cell">24</div>
                <div className="calendar-cell">25</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
