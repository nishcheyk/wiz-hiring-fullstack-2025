import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import noEvents from '../assets/no-events.svg';

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
            {events.map(event => (
              <li key={event.id} style={{ border: '1px solid #444', padding: 20, marginBottom: 18, borderRadius: 12, background: '#23272f', transition: 'transform 0.2s', display: 'flex', flexDirection: 'column', gap: 8 }}
                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <Link to={`/events/${event.id}`} style={{ fontWeight: 600, color: '#a78bfa', textDecoration: 'none', fontSize: '1.2rem' }}>
                  {event.title}
                </Link>
                <div style={{ fontSize: 15, color: '#aaa' }}>Max bookings per slot: {event.max_bookings_per_slot}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default HomePage;
