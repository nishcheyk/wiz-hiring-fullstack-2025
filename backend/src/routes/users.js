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
    const result = await db.query('SELECT * FROM users WHERE email = $1', [userEmail]);
    const user = result.rows[0];
    if (!user) {
      await db.query('INSERT INTO users (email, is_approved) VALUES ($1, 1)', [userEmail]);
    } else {
      await db.query('UPDATE users SET is_approved = 1 WHERE email = $1', [userEmail]);
    }
    res.json({ success: true, message: 'User approved.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to approve user.' });
  }
});

// Admin: Revoke a user (set is_approved=0)
router.post('/revoke', async (req, res) => {
  const { adminEmail, userEmail } = req.body;
  if (adminEmail !== process.env.ADMIN_EMAIL) {
    return res.status(403).json({ error: 'Unauthorized: Admin access only.' });
  }
  try {
    const db = await openDb();
    await db.query('UPDATE users SET is_approved = 0 WHERE email = $1', [userEmail]);
    res.json({ success: true, message: 'User revoked.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to revoke user.' });
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
    const result = await db.query('SELECT * FROM users');
    const users = result.rows;
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

// User signup (prevent duplicate emails)
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required.' });
  }
  try {
    const db = await openDb();
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const existing = result.rows[0];
    if (existing) {
      return res.status(409).json({ error: 'Email already exists.' });
    }
    await db.query('INSERT INTO users (email, is_approved) VALUES ($1, 0)', [email]);
    res.status(201).json({ success: true, message: 'Signup successful. Await admin approval to add events.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to sign up.' });
  }
});

// Get current user info (for approval check)
router.get('/me', async (req, res) => {
  const userEmail = req.headers['authorization'];
  if (!userEmail) {
    return res.status(401).json({ error: 'No user email provided.' });
  }
  try {
    const db = await openDb();
    const result = await db.query('SELECT * FROM users WHERE email = $1', [userEmail]);
    const user = result.rows[0];
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user.' });
  }
});

export default router;
