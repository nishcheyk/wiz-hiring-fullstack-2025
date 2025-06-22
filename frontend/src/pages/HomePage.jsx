import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

function HomePage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get(import.meta.env.VITE_API_URL + '/events')
      .then(res => setEvents(res.data))
      .catch(() => setEvents([]));
  }, []);

  return (
    <div className="form-container animate-fade-in" style={{ maxWidth: 600, margin: '2rem auto' }}>
      <h1 className="title mb-4">Upcoming Events</h1>
      <Link to="/create"><Button>Create Event</Button></Link>
      <ul style={{ marginTop: 24 }}>
        {events.map(event => (
          <li key={event.id} className="bg-gray-800" style={{ border: '1px solid #444', padding: 16, marginBottom: 12, borderRadius: 8, background: '#23272f', transition: 'transform 0.2s', }}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.03)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Link to={`/events/${event.id}`} style={{ fontWeight: 600, color: '#a78bfa', textDecoration: 'none' }}>
              {event.title}
            </Link>
            <div style={{ fontSize: 14, color: '#aaa' }}>Max bookings per slot: {event.max_bookings_per_slot}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HomePage;
