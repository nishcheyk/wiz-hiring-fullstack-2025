import express from 'express';
import { openDb } from '../database.js';

const router = express.Router();

// Create Event (only for approved users)
router.post('/', async (req, res) => {
  const { title, description, slots, maxBookingsPerSlot, userId } = req.body;
  if (!title || !Array.isArray(slots) || !maxBookingsPerSlot || !userId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const db = await openDb();
    // Validate slots are all in the future
    const now = new Date();
    for (const slot of slots) {
      if (new Date(slot) < now) {
        return res.status(400).json({ error: 'Cannot create events with past slots.' });
      }
    }
    // Check if user is approved
    const userResult = await db.query('SELECT * FROM users WHERE email = $1 AND is_approved = 1', [userId]);
    const user = userResult.rows[0];
    if (!user) {
      return res.status(403).json({ error: 'User not approved to create events' });
    }
    const eventResult = await db.query(
      'INSERT INTO events (title, description, max_bookings_per_slot) VALUES ($1, $2, $3) RETURNING id',
      [title, description, maxBookingsPerSlot]
    );
    const eventId = eventResult.rows[0].id;
    for (const slot of slots) {
      await db.query(
        'INSERT INTO slots (event_id, start_time) VALUES ($1, $2)',
        [eventId, slot]
      );
    }
    res.status(201).json({ id: eventId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// List Events (ordered by position)
router.get('/', async (req, res) => {
  try {
    const db = await openDb();
    const result = await db.query('SELECT * FROM events ORDER BY position ASC, id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Update event positions (admin only)
router.post('/reorder', async (req, res) => {
  const { adminEmail, order } = req.body;
  if (adminEmail !== process.env.ADMIN_EMAIL) {
    return res.status(403).json({ error: 'Unauthorized: Admin access only.' });
  }
  if (!Array.isArray(order)) {
    return res.status(400).json({ error: 'Order must be an array of event IDs.' });
  }
  try {
    const db = await openDb();
    for (let i = 0; i < order.length; i++) {
      await db.query('UPDATE events SET position = $1 WHERE id = $2', [i, order[i]]);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reorder events.' });
  }
});

// Get Event + Slots
router.get('/:id', async (req, res) => {
  try {
    const db = await openDb();
    const eventResult = await db.query('SELECT * FROM events WHERE id = $1', [req.params.id]);
    const event = eventResult.rows[0];
    if (!event) return res.status(404).json({ error: 'Event not found' });
    const slotsResult = await db.query('SELECT * FROM slots WHERE event_id = $1', [req.params.id]);
    const slots = slotsResult.rows;
    res.json({ ...event, slots });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

export default router;
