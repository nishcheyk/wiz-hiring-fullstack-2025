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
  const [imageUrl, setImageUrl] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/login');
      return;
    }
    // Approval check removed: any logged-in user can create events
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
        userId,
        imageUrl: imageUrl.trim() || undefined
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
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="input-group">
            <label htmlFor="event-title">Title</label>
            <input id="event-title" type="text" placeholder="Event Title" value={title} onChange={e => setTitle(e.target.value)} required className="input-polished" />
          </div>
          <div className="input-group">
            <label htmlFor="event-description">Description</label>
            <textarea id="event-description" placeholder="Event Description" value={description} onChange={e => setDescription(e.target.value)} style={{ minHeight: 60 }} className="input-polished" />
          </div>
          <div className="input-group">
            <label htmlFor="max-bookings">Max bookings per slot</label>
            <input id="max-bookings" type="number" min="1" placeholder="Max bookings per slot" value={maxBookingsPerSlot} onChange={e => setMaxBookingsPerSlot(Number(e.target.value))} required className="input-polished" />
          </div>
          <div className="input-group" style={{ marginBottom: 8 }}>
            <label>Slots (local time):</label>
            {slots.map((slot, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <input type="datetime-local" value={slot} onChange={e => handleSlotChange(i, e.target.value)} required className="input-polished" style={{ flex: 1 }} />
                <button type="button" onClick={() => removeSlot(i)} style={{ color: '#f87171', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>Remove</button>
              </div>
            ))}
            <button type="button" onClick={addSlot} style={{ color: '#a78bfa', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>Add Slot</button>
          </div>
          <div className="input-group">
            <label htmlFor="image-url">Image URL (optional)</label>
            <input id="image-url" type="text" placeholder="Image URL (optional)" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="input-polished" />
          </div>
          <Button type="submit">Create Event</Button>
        </form>
        {message && <div style={{ color: '#34d399', marginTop: 12 }}>{message}</div>}
      </div>
    </div>
  );
}

export default CreateEventPage;
