import React, { useState } from 'react';
import axios from 'axios';
import Button from '../components/Button';
import noBookings from '../assets/no-bookings.svg';

function MyBookingsPage() {
  const [email, setEmail] = useState('');
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async (e) => {
    e.preventDefault();
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/${email}/bookings`);
    setBookings(res.data);
  };

  return (
    <div className="main-content animate-fade-in">
      <div className="form-container">
        <h1 className="title mb-4" style={{ textAlign: 'left' }}>My Bookings</h1>
        <form onSubmit={fetchBookings} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 18 }}>
          <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required className="form-input" />
          <Button type="submit">View Bookings</Button>
        </form>
        {bookings.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <img src={noBookings} alt="No bookings" style={{ width: 120, opacity: 0.7 }} />
            <div style={{ color: '#a78bfa', marginTop: 16, fontSize: 18 }}>No bookings found</div>
          </div>
        ) : (
          <ul style={{ marginTop: 0, padding: 0, listStyle: 'none' }}>
            {bookings.map(b => (
              <li key={b.id} style={{ border: '1px solid #444', padding: 16, marginBottom: 12, borderRadius: 8, background: '#18181b', color: '#fff' }}>
                <div><b>Event:</b> {b.title}</div>
                <div><b>Slot:</b> {b.start_time ? new Date(b.start_time).toLocaleString() : ''}</div>
                <div><b>Booked at:</b> {b.created_at ? new Date(b.created_at).toLocaleString() : ''}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default MyBookingsPage;
