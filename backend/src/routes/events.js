import express from 'express';
import { openDb } from '../database.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { title, description, slots, maxBookingsPerSlot, userId, imageUrl } = req.body;
  if (!title || !Array.isArray(slots) || !maxBookingsPerSlot || !userId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const db = await openDb();
    const userResult = await db.query('SELECT * FROM users WHERE email = $1 AND is_approved = 1', [userId]);
    const user = userResult.rows[0];
    if (!user) {
      return res.status(403).json({ error: 'User not approved to create events' });
    }
    const eventResult = await db.query(
      'INSERT INTO events (title, description, max_bookings_per_slot, image_url, date) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [title, description, maxBookingsPerSlot, imageUrl || null, slots[0]]
    );
    const eventId = eventResult.rows[0].id;
    for (const slot of slots) {
      await db.query(
        'INSERT INTO slots (event_id, start_time, available_spots) VALUES ($1, $2, $3)',
        [eventId, slot, maxBookingsPerSlot]
      );
    }
    res.status(201).json({ id: eventId });
  } catch (err) {
    console.error('Error in POST /events:', err); // Log the real error
    res.status(500).json({ error: 'Failed to create event' });
  }
});

router.get('/', async (req, res) => {
  try {
    const db = await openDb();
    const result = await db.query('SELECT * FROM events ORDER BY position ASC, id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error in GET /events:', err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

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
