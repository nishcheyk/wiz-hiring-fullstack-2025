import express from 'express';
import { openDb } from './database.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// Book a slot
router.post('/:id/bookings', async (req, res) => {
  const { name, email, slotId } = req.body;
  if (!name || !email || !slotId) {
    return res.status(400).json({ error: 'Please provide your name, email, and select a slot.' });
  }
  try {
    const db = await openDb();
    // Check if slot exists
    const slot = await db.get('SELECT * FROM slots WHERE id = ? AND event_id = ?', [slotId, req.params.id]);
    if (!slot) return res.status(404).json({ error: 'Sorry, this slot does not exist.' });
    // Prevent double booking for same user + slot
    const existing = await db.get('SELECT * FROM bookings WHERE slot_id = ? AND email = ?', [slotId, email]);
    if (existing) return res.status(409).json({ error: 'You have already booked this slot.' });
    // Check max bookings per slot
    const event = await db.get('SELECT * FROM events WHERE id = ?', [req.params.id]);
    const count = await db.get('SELECT COUNT(*) as cnt FROM bookings WHERE slot_id = ?', [slotId]);
    if (count.cnt >= event.max_bookings_per_slot) {
      return res.status(409).json({ error: 'Sorry, this slot is already full.' });
    }
    // Add booking
    const result = await db.run('INSERT INTO bookings (slot_id, name, email) VALUES (?, ?, ?)', [slotId, name, email]);
    res.status(201).json({ success: true, message: 'Your booking was successful!', bookingId: result.lastID });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong while booking your slot. Please try again.' });
  }
});

// Cancel a booking (new feature)
router.delete('/bookings/:bookingId', async (req, res) => {
  try {
    const db = await openDb();
    const booking = await db.get('SELECT * FROM bookings WHERE id = ?', [req.params.bookingId]);
    if (!booking) return res.status(404).json({ error: 'Booking not found.' });
    await db.run('DELETE FROM bookings WHERE id = ?', [req.params.bookingId]);
    res.json({ success: true, message: 'Your booking has been cancelled.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to cancel booking.' });
  }
});

// View bookings by email (optional)
router.get('/users/:email/bookings', async (req, res) => {
  try {
    const db = await openDb();
    const bookings = await db.all(
      `SELECT b.*, s.start_time, e.title FROM bookings b
       JOIN slots s ON b.slot_id = s.id
       JOIN events e ON s.event_id = e.id
       WHERE b.email = ?
       ORDER BY b.created_at DESC`,
      [req.params.email]
    );
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings. Please try again later.' });
  }
});

// List all bookings for an event (new feature)
router.get('/events/:id/bookings', async (req, res) => {
  try {
    const db = await openDb();
    const bookings = await db.all(
      `SELECT b.*, s.start_time, e.title FROM bookings b
       JOIN slots s ON b.slot_id = s.id
       JOIN events e ON s.event_id = e.id
       WHERE e.id = ?
       ORDER BY b.created_at DESC`,
      [req.params.id]
    );
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch event bookings.' });
  }
});

// Get booking details (new feature)
router.get('/bookings/:bookingId', async (req, res) => {
  try {
    const db = await openDb();
    const booking = await db.get(
      `SELECT b.*, s.start_time, e.title FROM bookings b
       JOIN slots s ON b.slot_id = s.id
       JOIN events e ON s.event_id = e.id
       WHERE b.id = ?`,
      [req.params.bookingId]
    );
    if (!booking) return res.status(404).json({ error: 'Booking not found.' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch booking details.' });
  }
});

// Admin: List all bookings (admin control)
router.get('/admin/bookings', async (req, res) => {
  const { admin } = req.query;
  if (admin !== process.env.ADMIN_EMAIL) {
    return res.status(403).json({ error: 'Unauthorized: Admin access only.' });
  }
  try {
    const db = await openDb();
    const bookings = await db.all(
      `SELECT b.*, s.start_time, e.title FROM bookings b
       JOIN slots s ON b.slot_id = s.id
       JOIN events e ON s.event_id = e.id
       ORDER BY b.created_at DESC`
    );
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch all bookings.' });
  }
});

export default router;
