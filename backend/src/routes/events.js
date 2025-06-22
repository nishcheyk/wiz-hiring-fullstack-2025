import express from 'express';
import { openDb } from '../database.js';

const router = express.Router();

// Create Event
router.post('/', async (req, res) => {
  const { title, description, slots, maxBookingsPerSlot } = req.body;
  if (!title || !Array.isArray(slots) || !maxBookingsPerSlot) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const db = await openDb();
    const result = await db.run(
      'INSERT INTO events (title, description, max_bookings_per_slot) VALUES (?, ?, ?)',
      [title, description, maxBookingsPerSlot]
    );
    const eventId = result.lastID;
    for (const slot of slots) {
      await db.run(
        'INSERT INTO slots (event_id, start_time) VALUES (?, ?)',
        [eventId, slot]
      );
    }
    res.status(201).json({ id: eventId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// List Events
router.get('/', async (req, res) => {
  try {
    const db = await openDb();
    const events = await db.all('SELECT * FROM events');
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Get Event + Slots
router.get('/:id', async (req, res) => {
  try {
    const db = await openDb();
    const event = await db.get('SELECT * FROM events WHERE id = ?', [req.params.id]);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    const slots = await db.all('SELECT * FROM slots WHERE event_id = ?', [req.params.id]);
    res.json({ ...event, slots });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

export default router;