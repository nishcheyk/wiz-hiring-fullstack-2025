import React, { useState } from 'react';
import axios from 'axios';
import Button from '../components/Button';

function AdminBookingsPage() {
  const [adminEmail, setAdminEmail] = useState('');
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');

  const fetchAllBookings = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/bookings?admin=${adminEmail}`);
      setBookings(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch bookings');
    }
  };

  return (
    <div className="form-container animate-fade-in" style={{ maxWidth: 600, margin: '2rem auto' }}>
      <h1 className="title mb-4">Admin: All Bookings</h1>
      <form onSubmit={fetchAllBookings} className="form mb-4">
        <div className="input-group">
          <label>Admin Email</label>
          <input type="email" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} required />
        </div>
        <Button type="submit">View All Bookings</Button>
      </form>
      {error && <div className="text-red-400 animate-bounce-in" style={{ color: '#f87171', marginBottom: 12 }}>{error}</div>}
      <ul style={{ marginTop: 24 }}>
        {bookings.map(b => (
          <li key={b.id} className="bg-gray-800 animate-fade-in" style={{ border: '1px solid #444', padding: 16, marginBottom: 12, borderRadius: 8, background: '#23272f' }}>
            <div><b>Event:</b> {b.title}</div>
            <div><b>Slot:</b> {b.start_time}</div>
            <div><b>Name:</b> {b.name}</div>
            <div><b>Email:</b> {b.email}</div>
            <div><b>Booked at:</b> {b.created_at}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminBookingsPage;
