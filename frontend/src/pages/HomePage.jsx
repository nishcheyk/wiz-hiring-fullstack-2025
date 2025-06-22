import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import noEvents from '../assets/no-events.svg';
import EventSlider from '../components/EventSlider';
import '../components/EventSlider.css'; // Assuming you have a CSS file for the slider

function HomePage() {
  const [events, setEvents] = useState([]);
  const [approved, setApproved] = useState(false);

  useEffect(() => {
    axios.get(import.meta.env.VITE_API_URL + '/events')
      .then(res => setEvents(res.data))
      .catch(() => setEvents([]));
    // Check approval for Add Event button
    async function checkApproval() {
      const userType = localStorage.getItem('userType');
      if (userType === 'user') {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users?adminEmail=admin@gmail.com`);
        const users = await res.json();
        const user = users.find(u => u.email === localStorage.getItem('userEmail'));
        setApproved(user && user.is_approved === 1);
      } else {
        setApproved(false);
      }
    }
    checkApproval();
  }, []);

  return (
    <div className="main-content animate-fade-in">
      <EventSlider />
      <div style={{ width: '100%', maxWidth: 900, margin: '0 auto' }}>
        <h1 className="title mb-4" style={{ textAlign: 'left', fontSize: '2rem', marginBottom: 24 }}>Upcoming Events</h1>
        {approved && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
            <Link to="/create"><Button>Add Event</Button></Link>
          </div>
        )}
        {events.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <img src={noEvents} alt="No events" style={{ width: 120, opacity: 0.7 }} />
            <div style={{ color: '#a78bfa', marginTop: 16, fontSize: 18 }}>No events available</div>
          </div>
        ) : (
          <ul style={{ marginTop: 0, padding: 0, listStyle: 'none' }}>
            {events.map(event => {
              const isFull = event.available_spots === 0;
              return (
                <li
                  key={event.id}
                  style={{
                    border: '1px solid #444',
                    padding: 20,
                    marginBottom: 18,
                    borderRadius: 12,
                    background: '#23272f',
                    transition: 'transform 0.2s',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    opacity: isFull ? 0.7 : 1,
                    pointerEvents: isFull ? 'none' : 'auto',
                    position: 'relative',
                  }}
                  onMouseOver={e => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  {isFull && (
                    <div style={{
                      position: 'absolute',
                      top: 10,
                      left: 10,
                      background: '#f87171',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      padding: '4px 12px',
                      borderRadius: 6,
                      zIndex: 2,
                      boxShadow: '0 2px 8px 0 rgba(40,40,60,0.10)'
                    }}>SOLD OUT</div>
                  )}
                  {event.image_url && (
                    <img src={event.image_url} alt={event.title} style={{ width: '100%', maxHeight: 180, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }} />
                  )}
                  <Link to={isFull ? '#' : `/events/${event.id}`} style={{ fontWeight: 600, color: '#a78bfa', textDecoration: 'none', fontSize: '1.2rem', pointerEvents: isFull ? 'none' : 'auto' }} tabIndex={isFull ? -1 : 0} aria-disabled={isFull}>
                    {event.title}
                  </Link>
                  <div style={{ fontSize: 15, color: '#aaa' }}>Max bookings per slot: {event.max_bookings_per_slot}</div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default HomePage;
