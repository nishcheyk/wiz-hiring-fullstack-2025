import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { DateTime } from 'luxon';
import Button from '../components/Button';
import CheckoutForm from '../components/CheckoutForm';
import houseFull from '../assets/house-full.svg';

function EventDetailsPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [slots, setSlots] = useState([]);
  const [slotId, setSlotId] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [calendarUrl, setCalendarUrl] = useState('');

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/events/${id}`)
      .then(res => {
        setEvent(res.data);
        setSlots(res.data.slots);
      });
  }, [id]);

  const handleStartBooking = (e) => {
    e.preventDefault();
    setMessage('');
    if (!slotId) {
      setMessage('Please select a slot.');
      return;
    }
    setShowCheckout(true);
  };

  const handleCheckout = async ({ name, email }) => {
    setLoading(true);
    setMessage('');
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/${id}/bookings`, {
        name, email, slotId
      });
      setMessage('Booking successful! Check your email for confirmation.');
      setShowCheckout(false);
      setSlotId('');
      // Generate Google Calendar link (mocked)
      const slot = slots.find(s => s.id === slotId);
      if (slot) {
        const start = DateTime.fromISO(slot.start_time, { zone: 'utc' }).toLocal();
        const end = start.plus({ hours: 1 });
        const details = {
          text: event.title,
          dates: `${start.toFormat("yyyyMMdd'T'HHmmss")}/${end.toFormat("yyyyMMdd'T'HHmmss")}`,
          details: event.description || '',
          location: '',
        };
        const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(details.text)}&dates=${details.dates}&details=${encodeURIComponent(details.details)}`;
        setCalendarUrl(url);
      }
    } catch (err) {
      setMessage(err.response?.data?.error || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  const userEmail = localStorage.getItem('userEmail');
  const allSlotsFull = slots.length > 0 && slots.every(slot => slot.available_spots === 0);

  return (
    <div className="main-content animate-fade-in">
      <div className="form-container">
        {event && (
          <>
            {event.image_url && (
              <img src={event.image_url} alt={event.title} style={{ width: '100%', maxHeight: 220, objectFit: 'cover', borderRadius: 8, marginBottom: 16 }} />
            )}
            <h1 className="title mb-2" style={{ textAlign: 'left', fontSize: '1.7rem', marginBottom: 12 }}>{event.title}</h1>
            <p style={{ marginBottom: 18 }}>{event.description}</p>
            <h2 style={{ fontWeight: 600, marginBottom: 8 }}>Available Slots</h2>
            {allSlotsFull ? (
              <div style={{ textAlign: 'center', margin: '32px 0' }}>
                <img src={houseFull} alt="House Full" style={{ width: 80, marginBottom: 12 }} />
                <div style={{ color: '#a78bfa', fontWeight: 600, fontSize: 20 }}>All slots are booked (House Full)</div>
              </div>
            ) : !showCheckout ? (
              <form onSubmit={handleStartBooking} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 12 }}>
                <select value={slotId} onChange={e => setSlotId(e.target.value)} required style={{ padding: 10, borderRadius: 6, border: '1px solid #444', background: '#18181b', color: '#fff' }}>
                  <option value="">Select a slot</option>
                  {slots.filter(slot => slot.available_spots > 0).map(slot => (
                    <option key={slot.id} value={slot.id}>
                      {DateTime.fromISO(slot.start_time, { zone: 'utc' }).toLocal().toFormat('ff')}
                    </option>
                  ))}
                </select>
                <Button type="submit">Book Slot</Button>
              </form>
            ) : (
              <div style={{ marginBottom: 12 }}>
                <CheckoutForm onSubmit={handleCheckout} email={userEmail} />
                <Button onClick={() => setShowCheckout(false)} style={{ marginTop: 10 }} type="button" variant="secondary">Cancel</Button>
              </div>
            )}
            {loading && <div style={{ color: '#a78bfa', marginTop: 12 }}>Processing...</div>}
            {message && <div style={{ color: '#a78bfa', marginTop: 12 }}>{message}</div>}
            {calendarUrl && (
              <a href={calendarUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#34d399', marginTop: 12, display: 'inline-block' }}>
                ➕ Add to Google Calendar
              </a>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default EventDetailsPage;
