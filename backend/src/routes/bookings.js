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

    // Check if slot exists and belongs to the event
    const slotResult = await db.query('SELECT * FROM slots WHERE id = $1 AND event_id = $2', [slotId, req.params.id]);
    const slot = slotResult.rows[0];
    if (!slot) return res.status(404).json({ error: 'Sorry, this slot does not exist.' });

    // Check if user already booked this slot
    const existingResult = await db.query('SELECT * FROM bookings WHERE slot_id = $1 AND email = $2', [slotId, email]);
    const existing = existingResult.rows[0];
    if (existing) return res.status(409).json({ error: 'You have already booked this slot.' });

    // Check if slot has available spots
    if (slot.available_spots <= 0) {
      return res.status(409).json({ error: 'Sorry, this slot is already full.' });
    }

    // Create the booking and decrement available spots
    await db.query('BEGIN');
    try {
      const result = await db.query('INSERT INTO bookings (slot_id, name, email) VALUES ($1, $2, $3) RETURNING id', [slotId, name, email]);
      await db.query('UPDATE slots SET available_spots = available_spots - 1 WHERE id = $1', [slotId]);
      await db.query('COMMIT');

      res.status(201).json({
        success: true,
        message: 'Your booking was successful!',
        bookingId: result.rows[0].id,
        remainingSpots: slot.available_spots - 1
      });
    } catch (err) {
      await db.query('ROLLBACK');
      throw err;
    }
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ error: 'Something went wrong while booking your slot. Please try again.' });
  }
});

router.delete('/bookings/:bookingId', async (req, res) => {
  try {
    const db = await openDb();

    // Get booking details first
    const bookingResult = await db.query('SELECT * FROM bookings WHERE id = $1', [req.params.bookingId]);
    const booking = bookingResult.rows[0];
    if (!booking) return res.status(404).json({ error: 'Booking not found.' });

    // Delete booking and increment available spots
    await db.query('BEGIN');
    try {
      await db.query('DELETE FROM bookings WHERE id = $1', [req.params.bookingId]);
      await db.query('UPDATE slots SET available_spots = available_spots + 1 WHERE id = $1', [booking.slot_id]);
      await db.query('COMMIT');

      res.json({ success: true, message: 'Your booking has been cancelled.' });
    } catch (err) {
      await db.query('ROLLBACK');
      throw err;
    }
  } catch (err) {
    console.error('Cancel booking error:', err);
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
    console.error('Error fetching user bookings:', err);
    res.status(500).json({ error: 'Failed to fetch bookings.' });
  }
});

// Admin: Get all bookings
router.get('/admin/bookings', async (req, res) => {
  const { admin } = req.query;
  if (admin !== process.env.ADMIN_EMAIL) {
    return res.status(403).json({ error: 'Unauthorized: Admin access only.' });
  }
  try {
    const db = await openDb();
    const result = await db.query(
      `SELECT b.*, s.start_time, e.title
       FROM bookings b
       JOIN slots s ON b.slot_id = s.id
       JOIN events e ON s.event_id = e.id
       ORDER BY s.start_time ASC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching admin bookings:', err);
    res.status(500).json({ error: 'Failed to fetch bookings.' });
  }
});

export default router;
