import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../components/Button';
import noBookings from '../assets/no-bookings.svg';

function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (localStorage.getItem('userType') !== 'admin') {
      window.location.href = '/login';
    } else {
      fetchAllBookings();
    }
  }, []);

  const fetchAllBookings = async () => {
    setError('');
    try {
      const adminEmail = localStorage.getItem('userEmail');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/bookings?admin=${adminEmail}`);
      setBookings(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch bookings');
    }
  };

  return (
    <div className="main-content animate-fade-in">
      <div className="form-container">
        <h1 className="title mb-4" style={{ textAlign: 'left', fontSize: '1.7rem', marginBottom: 18 }}>Admin: All Bookings</h1>
        {error && <div style={{ color: '#f87171', marginBottom: 12 }}>{error}</div>}
        {bookings.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <img src={noBookings} alt="No bookings" style={{ width: 120, opacity: 0.7 }} />
            <div style={{ color: '#a78bfa', marginTop: 16, fontSize: 18 }}>No bookings found</div>
          </div>
        ) : (
          <ul style={{ marginTop: 0, padding: 0, listStyle: 'none', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
            {bookings.map(b => (
              <li key={b.id} style={{ border: '1px solid #444', padding: 16, borderRadius: 8, background: '#18181b', color: '#fff' }}>
                <div><b>Event:</b> {b.title}</div>
                <div><b>Slot:</b> {b.start_time}</div>
                <div><b>Name:</b> {b.name}</div>
                <div><b>Email:</b> {b.email}</div>
                <div><b>Booked at:</b> {b.created_at}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AdminBookingsPage;
