import React, { useState } from 'react';
import axios from 'axios';
import { DateTime } from 'luxon';
import Button from '../components/Button';

function CreateEventPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [slots, setSlots] = useState(['']);
  const [maxBookingsPerSlot, setMaxBookingsPerSlot] = useState(1);
  const [message, setMessage] = useState('');

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
    try {
      await axios.post(import.meta.env.VITE_API_URL + '/events', {
        title,
        description,
        slots: slots.map(s => DateTime.fromISO(s).toUTC().toISO()),
        maxBookingsPerSlot
      });
      setMessage('Event created!');
    } catch (err) {
      setMessage('Failed to create event');
    }
  };

  return (
    <div className="form-container animate-fade-in" style={{ maxWidth: 500, margin: '2rem auto' }}>
      <h1 className="title mb-4">Create Event</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="input-group">
          <label>Title</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        <div className="input-group">
          <label>Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} className="mb-2 block w-full bg-gray-900 text-white rounded" />
        </div>
        <div className="input-group">
          <label>Max bookings per slot</label>
          <input type="number" min="1" value={maxBookingsPerSlot} onChange={e => setMaxBookingsPerSlot(Number(e.target.value))} required />
        </div>
        <div className="mb-2">
          <div className="font-semibold">Slots (local time):</div>
          {slots.map((slot, i) => (
            <div key={i} className="flex mb-1" style={{ display: 'flex', marginBottom: 8 }}>
              <input type="datetime-local" value={slot} onChange={e => handleSlotChange(i, e.target.value)} required className="flex-1 bg-gray-900 text-white rounded" style={{ flex: 1 }} />
              <button type="button" onClick={() => removeSlot(i)} className="ml-2 text-red-400" style={{ marginLeft: 8, color: '#f87171', background: 'none', border: 'none', cursor: 'pointer' }}>Remove</button>
            </div>
          ))}
          <button type="button" onClick={addSlot} className="mt-1 text-purple-300" style={{ marginTop: 8, color: '#a78bfa', background: 'none', border: 'none', cursor: 'pointer' }}>Add Slot</button>
        </div>
        <Button type="submit">Create Event</Button>
      </form>
      {message && <div className="mt-2 text-green-400 animate-bounce-in" style={{ color: '#34d399', marginTop: 12 }}>{message}</div>}
    </div>
  );
}

export default CreateEventPage;
