import React, { useState } from 'react';
import axios from 'axios';
import Button from '../components/Button';

function MyBookingsPage() {
  const [email, setEmail] = useState('');
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async (e) => {
    e.preventDefault();
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/${email}/bookings`);
    setBookings(res.data);
  };

  return (
    <div className="form-container animate-fade-in" style={{ maxWidth: 500, margin: '2rem auto' }}>
      <h1 className="title mb-4">My Bookings</h1>
      <form onSubmit={fetchBookings} className="form mb-4">
        <div className="input-group">
          <label>Enter your email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <Button type="submit">View Bookings</Button>
      </form>
      <ul style={{ marginTop: 24 }}>
        {bookings.map(b => (
          <li key={b.id} className="bg-gray-800 animate-fade-in" style={{ border: '1px solid #444', padding: 16, marginBottom: 12, borderRadius: 8, background: '#23272f' }}>
            <div><b>Event:</b> {b.title}</div>
            <div><b>Slot:</b> {b.start_time}</div>
            <div><b>Booked at:</b> {b.created_at}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MyBookingsPage;
