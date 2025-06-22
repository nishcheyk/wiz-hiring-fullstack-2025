import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { DateTime } from 'luxon';
import Button from '../components/Button';

function EventDetailsPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [slots, setSlots] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [slotId, setSlotId] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/events/${id}`)
      .then(res => {
        setEvent(res.data);
        setSlots(res.data.slots);
      });
  }, [id]);

  const handleBook = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/events/${id}/bookings`, {
        name, email, slotId
      });
      setMessage('Booking successful! Check your email for confirmation.');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Booking failed');
    }
  };

  return (
    <div className="form-container animate-fade-in" style={{ maxWidth: 500, margin: '2rem auto' }}>
      {event && (
        <>
          <h1 className="title mb-2">{event.title}</h1>
          <p className="mb-4">{event.description}</p>
          <h2 className="font-semibold mb-2">Available Slots</h2>
          <form onSubmit={handleBook} className="form">
            <div className="input-group">
              <label>Select a slot</label>
              <select value={slotId} onChange={e => setSlotId(e.target.value)} required className="mb-2 block w-full">
                <option value="">Select a slot</option>
                {slots.map(slot => (
                  <option key={slot.id} value={slot.id}>
                    {DateTime.fromISO(slot.start_time, { zone: 'utc' }).toLocal().toFormat('ff')}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label>Your Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="input-group">
              <label>Your Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <Button type="submit">Book Slot</Button>
          </form>
          {message && <div className="mb-2 text-blue-400 animate-bounce-in" style={{ color: '#a78bfa', marginTop: 12 }}>{message}</div>}
        </>
      )}
    </div>
  );
}

export default EventDetailsPage;
