import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DateTime } from 'luxon';
import Button from '../components/Button';

function CreateEventPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [slots, setSlots] = useState(['']);
  const [maxBookingsPerSlot, setMaxBookingsPerSlot] = useState(1);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/login');
      return;
    }
    // Check if user is approved
    (async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users/me`, {
          headers: { 'Authorization': userId }
        });
        if (!res.ok) {
          navigate('/login');
          return;
        }
        const user = await res.json();
        if (!user.is_approved) {
          navigate('/');
        }
      } catch {
        navigate('/login');
      }
    })();
  }, [navigate]);

  const handleSlotChange = (i, value) => {
    const newSlots = [...slots];
    newSlots[i] = value;
    setSlots(newSlots);
  };

  const addSlot = () => setSlots([...slots, '']);
  const removeSlot = (i) => setSlots(slots.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setMessage('You must be logged in to create an event.');
      return;
    }
    try {
      await axios.post(import.meta.env.VITE_API_URL + '/events', {
        title,
        description,
        slots: slots.map(s => DateTime.fromISO(s).toUTC().toISO()),
        maxBookingsPerSlot,
        userId // userId is now used everywhere instead of userEmail
      });
      setMessage('Event created!');
    } catch (err) {
      setMessage('Failed to create event');
    }
  };

  return (
    <div className="main-content animate-fade-in">
      <div className="form-container">
        <h1 className="title mb-4" style={{ textAlign: 'left' }}>Create Event</h1>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required className="form-input" />
          <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="form-input" style={{ minHeight: 60 }} />
          <input type="number" min="1" placeholder="Max bookings per slot" value={maxBookingsPerSlot} onChange={e => setMaxBookingsPerSlot(Number(e.target.value))} required className="form-input" />
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Slots (local time):</div>
            {slots.map((slot, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <input type="datetime-local" value={slot} onChange={e => handleSlotChange(i, e.target.value)} required className="form-input" style={{ flex: 1 }} />
                <button type="button" onClick={() => removeSlot(i)} style={{ color: '#f87171', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>Remove</button>
              </div>
            ))}
            <button type="button" onClick={addSlot} style={{ color: '#a78bfa', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>Add Slot</button>
          </div>
          <Button type="submit">Create Event</Button>
        </form>
        {message && <div style={{ color: '#34d399', marginTop: 12 }}>{message}</div>}
      </div>
    </div>
  );
}

export default CreateEventPage;
