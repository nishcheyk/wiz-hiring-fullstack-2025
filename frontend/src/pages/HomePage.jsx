import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import noEvents from '../assets/no-events.svg';
import EventSlider from '../components/EventSlider';
import '../components/EventSlider.css';

const EVENTS_LIMIT = 6;
const FALLBACK_IMAGE = '/vite.svg';

function HomePage() {
  const [events, setEvents] = useState([]);
  const [approved, setApproved] = useState(false);

  useEffect(() => {
    axios.get(import.meta.env.VITE_API_URL + '/events')
      .then(res => setEvents(res.data))
      .catch(() => setEvents([]));
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

  const handleImageError = (e) => {
    e.target.src = FALLBACK_IMAGE;
  };

  return (
    <div className="main-content animate-fade-in">
      <EventSlider />
      <div style={{ width: '100%', maxWidth: 600, margin: '0 auto' }}>
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
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {events.map(event => {
              const isFull = event.available_spots === 0;
              const linkTo = isFull ? '#' : `/events/${event.id}`;
              return (
                <Link
                  to={linkTo}
                  key={event.id}
                  style={{
                    display: 'block',
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                  tabIndex={isFull ? -1 : 0}
                  aria-disabled={isFull}
                  aria-label={event.title + ' event details'}
                  role="link"
                >
                  <li style={{
                    borderBottom: '1px solid #444',
                    padding: '24px 0',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 24,
                    opacity: isFull ? 0.7 : 1,
                    pointerEvents: isFull ? 'none' : 'auto',
                    position: 'relative',
                  }}>
                  {isFull && (
                    <div style={{
                      position: 'absolute',
                      top: 10,
                        left: 0,
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
                      <img
                        src={event.image_url}
                        alt={event.title}
                        width={120}
                        height={80}
                        style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 8, marginRight: 16 }}
                        loading="lazy"
                        onError={handleImageError}
                        srcSet={event.image_url + ' 1x, ' + event.image_url + ' 2x'}
                        aria-label={event.title + ' event image'}
                      />
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: '#a78bfa', fontSize: '1.2rem', marginBottom: 4 }}>{event.title}</div>
                      <div style={{ fontSize: 15, color: '#aaa', margin: '8px 0' }}>{event.description}</div>
                      <div style={{ fontSize: 14, color: '#888' }}>Max bookings per slot: {event.max_bookings_per_slot}</div>
                    </div>
                  </li>
                  </Link>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default HomePage;
