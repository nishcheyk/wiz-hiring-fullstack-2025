import express from 'express';
import { openDb } from '../database.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// Admin: Approve a user (set is_approved=1)
router.post('/approve', async (req, res) => {
  const { adminEmail, userEmail } = req.body;
  if (adminEmail !== process.env.ADMIN_EMAIL) {
    return res.status(403).json({ error: 'Unauthorized: Admin access only.' });
  }
  try {
    const db = await openDb();
    const user = await db.get('SELECT * FROM users WHERE email = ?', [userEmail]);
    if (!user) {
      await db.run('INSERT INTO users (email, is_approved) VALUES (?, 1)', [userEmail]);
    } else {
      await db.run('UPDATE users SET is_approved = 1 WHERE email = ?', [userEmail]);
    }
    res.json({ success: true, message: 'User approved.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to approve user.' });
  }
});

// Get all users (admin only)
router.get('/', async (req, res) => {
  const { adminEmail } = req.query;
  if (adminEmail !== process.env.ADMIN_EMAIL) {
    return res.status(403).json({ error: 'Unauthorized: Admin access only.' });
  }
  try {
    const db = await openDb();
    const users = await db.all('SELECT * FROM users');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

export default router;
