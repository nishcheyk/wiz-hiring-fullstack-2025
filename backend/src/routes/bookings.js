import express from 'express';
import { openDb } from '../database.js';

const router = express.Router();

router.post('/:id/bookings', async (req, res) => {
  const { name, email, slotId } = req.body;
  if (!name || !email || !slotId) {
    return res.status(400).json({ error: 'Please provide your name, email, and select a slot.' });
  }
  try {
    const db = await openDb();
    const slotResult = await db.query('SELECT * FROM slots WHERE id = $1 AND event_id = $2', [slotId, req.params.id]);
    const slot = slotResult.rows[0];
    if (!slot) return res.status(404).json({ error: 'Sorry, this slot does not exist.' });
    if (slot.available_spots !== null && slot.available_spots <= 0) {
      return res.status(409).json({ error: 'Sorry, this slot is already full.' });
    }
    const existingResult = await db.query('SELECT * FROM bookings WHERE slot_id = $1 AND email = $2', [slotId, email]);
    const existing = existingResult.rows[0];
    if (existing) return res.status(409).json({ error: 'You have already booked this slot.' });
    const eventResult = await db.query('SELECT * FROM events WHERE id = $1', [req.params.id]);
    const event = eventResult.rows[0];
    const countResult = await db.query('SELECT COUNT(*) as cnt FROM bookings WHERE slot_id = $1', [slotId]);
    const count = parseInt(countResult.rows[0].cnt, 10);
    if (count >= event.max_bookings_per_slot) {
      return res.status(409).json({ error: 'Sorry, this slot is already full.' });
    }
    // Decrement available_spots
    await db.query('UPDATE slots SET available_spots = available_spots - 1 WHERE id = $1', [slotId]);
    const result = await db.query('INSERT INTO bookings (slot_id, name, email) VALUES ($1, $2, $3) RETURNING id', [slotId, name, email]);
    res.status(201).json({ success: true, message: 'Your booking was successful!', bookingId: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong while booking your slot. Please try again.' });
  }
});

router.delete('/bookings/:bookingId', async (req, res) => {
  try {
    const db = await openDb();
    const bookingResult = await db.query('SELECT * FROM bookings WHERE id = $1', [req.params.bookingId]);
    const booking = bookingResult.rows[0];
    if (!booking) return res.status(404).json({ error: 'Booking not found.' });
    await db.query('DELETE FROM bookings WHERE id = $1', [req.params.bookingId]);
    res.json({ success: true, message: 'Your booking has been cancelled.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to cancel booking.' });
  }
});

router.get('/users/:email/bookings', async (req, res) => {
  try {
    const db = await openDb();
    const bookingsResult = await db.query(
      `SELECT b.*, s.start_time, e.title FROM bookings b
       JOIN slots s ON b.slot_id = s.id
       JOIN events e ON s.event_id = e.id
       WHERE b.email = $1
       ORDER BY s.start_time ASC`,
      [req.params.email]
    );
    res.json(bookingsResult.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings.' });
  }
});

export default router;
