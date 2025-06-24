import dotenv from 'dotenv';
dotenv.config();
import { openDb } from './database.js';

console.log('DATABASE_URL:', process.env.DATABASE_URL);

async function seed() {
  let pool;
  try {
    pool = await openDb();
  } catch (err) {
    console.error('Error creating pool:', err);
    process.exit(1);
  }
  const client = await pool.connect();
  try {
    // Clear existing data (respecting foreign key constraints)
    await client.query('DELETE FROM bookings');
    await client.query('DELETE FROM slots');
    await client.query('DELETE FROM events');
    await client.query('DELETE FROM users');

    // Insert dummy users
    const users = [
      { email: 'admin@example.com', is_approved: 1, is_admin: 1 },
      { email: 'user1@example.com', is_approved: 1, is_admin: 0 },
      { email: 'user2@example.com', is_approved: 0, is_admin: 0 },
    ];
    for (const user of users) {
      await client.query(
        'INSERT INTO users (email, is_approved, is_admin) VALUES ($1, $2, $3)',
        [user.email, user.is_approved, user.is_admin]
      );
    }

    // Insert at least 10 dummy events with relevant images
    const today = new Date();
    const events = [
      {
        title: 'Book Reading: Fantasy Night',
        description: 'Join us for a magical evening of fantasy book readings.',
        max_bookings_per_slot: 10,
        position: 1,
        image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
        date: new Date(today.getTime() + 0 * 24 * 3600 * 1000),
      },
      {
        title: 'Author Meet & Greet',
        description: 'Meet your favorite authors and get your books signed!',
        max_bookings_per_slot: 20,
        position: 2,
        image_url: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=600&q=80',
        date: new Date(today.getTime() + 1 * 24 * 3600 * 1000),
      },
      {
        title: 'Children Story Hour',
        description: 'Fun and engaging story hour for children ages 4-8.',
        max_bookings_per_slot: 15,
        position: 3,
        image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
        date: new Date(today.getTime() + 2 * 24 * 3600 * 1000),
      },
      {
        title: 'Poetry Slam Night',
        description: 'Showcase your poetry or enjoy others\' performances.',
        max_bookings_per_slot: 25,
        position: 4,
        image_url: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80',
        date: new Date(today.getTime() + 3 * 24 * 3600 * 1000),
      },
      {
        title: 'Mystery Book Club',
        description: 'Discuss the latest and greatest in mystery novels.',
        max_bookings_per_slot: 12,
        position: 5,
        image_url: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80',
        date: new Date(today.getTime() + 4 * 24 * 3600 * 1000),
      },
      {
        title: 'Sci-Fi Saturday',
        description: 'Explore new worlds with our sci-fi book discussions.',
        max_bookings_per_slot: 18,
        position: 6,
        image_url: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
        date: new Date(today.getTime() + 5 * 24 * 3600 * 1000),
      },
      {
        title: 'Cookbook Exchange',
        description: 'Bring a cookbook, take a cookbook, and share recipes.',
        max_bookings_per_slot: 10,
        position: 7,
        image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
        date: new Date(today.getTime() + 6 * 24 * 3600 * 1000),
      },
      {
        title: 'History Buffs Meetup',
        description: 'Dive into history with fellow enthusiasts.',
        max_bookings_per_slot: 14,
        position: 8,
        image_url: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=600&q=80',
        date: new Date(today.getTime() + 7 * 24 * 3600 * 1000),
      },
      {
        title: 'Romance Readers Gathering',
        description: 'Share your favorite romance novels and authors.',
        max_bookings_per_slot: 16,
        position: 9,
        image_url: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
        date: new Date(today.getTime() + 8 * 24 * 3600 * 1000),
      },
      {
        title: 'Non-Fiction Night',
        description: 'Discuss biographies, memoirs, and more.',
        max_bookings_per_slot: 20,
        position: 10,
        image_url: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=600&q=80',
        date: new Date(today.getTime() + 9 * 24 * 3600 * 1000),
      },
    ];
    const eventIds = [];
    for (const event of events) {
      const res = await client.query(
        'INSERT INTO events (title, description, max_bookings_per_slot, position, image_url, date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
        [event.title, event.description, event.max_bookings_per_slot, event.position, event.image_url, event.date]
      );
      eventIds.push(res.rows[0].id);
    }

    // Insert dummy slots for each event
    const now = new Date();
    const slots = [];
    for (let i = 0; i < eventIds.length; i++) {
      // Each event gets 2 slots, 1 and 2 hours from now
      slots.push({ event_id: eventIds[i], start_time: new Date(now.getTime() + (i + 1) * 3600 * 1000) });
      slots.push({ event_id: eventIds[i], start_time: new Date(now.getTime() + (i + 2) * 3600 * 1000) });
    }
    const slotIds = [];
    for (const slot of slots) {
      const res = await client.query(
        'INSERT INTO slots (event_id, start_time) VALUES ($1, $2) RETURNING id',
        [slot.event_id, slot.start_time]
      );
      slotIds.push(res.rows[0].id);
    }

    // Insert dummy bookings for the first slot of each event
    const bookings = [];
    for (let i = 0; i < eventIds.length; i++) {
      bookings.push({ slot_id: slotIds[i * 2], name: `User${i + 1}`, email: `user${i + 1}@example.com` });
    }
    for (const booking of bookings) {
      await client.query(
        'INSERT INTO bookings (slot_id, name, email) VALUES ($1, $2, $3)',
        [booking.slot_id, booking.name, booking.email]
      );
    }

    console.log('Dummy data seeded successfully!');
  } catch (err) {
    console.error('Error seeding data:', err);
  } finally {
    client.release();
    process.exit();
  }
}

seed();