import dotenv from 'dotenv';
dotenv.config();
import { openDb } from './src/database.js';

console.log('Starting database seed...');

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
    // Clear existing data
    console.log('🗑️ Clearing existing data...');
    await client.query('DELETE FROM bookings');
    await client.query('DELETE FROM slots');
    await client.query('DELETE FROM events');
    await client.query('DELETE FROM users');

    // Insert users
    const users = [
      { email: 'admin@gmail.com', is_approved: 1, is_admin: 1 },
      { email: 'john.doe@gmail.com', is_approved: 1, is_admin: 0 },
      { email: 'jane.smith@gmail.com', is_approved: 1, is_admin: 0 },
    ];

    console.log('👥 Creating users...');
    for (const user of users) {
      await client.query(
        'INSERT INTO users (email, is_approved, is_admin) VALUES ($1, $2, $3)',
        [user.email, user.is_approved, user.is_admin]
      );
    }
    console.log(`✅ Created ${users.length} users`);

    // Insert events with UTC dates
    const today = new Date();
    const events = [
      {
        title: 'Book Reading: Fantasy Night',
        description: 'Join us for a magical evening of fantasy book readings.',
        max_bookings_per_slot: 15,
        position: 1,
        image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
      },
      {
        title: 'Author Meet & Greet',
        description: 'Meet your favorite authors and get your books signed!',
        max_bookings_per_slot: 25,
        position: 2,
        image_url: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=600&q=80',
      },
      {
        title: 'Children Story Hour',
        description: 'Fun and engaging story hour for children ages 4-8.',
        max_bookings_per_slot: 20,
        position: 3,
        image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
      },
      {
        title: 'Poetry Slam Night',
        description: 'Showcase your poetry or enjoy others\' performances.',
        max_bookings_per_slot: 30,
        position: 4,
        image_url: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80',
      },
      {
        title: 'Mystery Book Club',
        description: 'Discuss the latest and greatest in mystery novels.',
        max_bookings_per_slot: 18,
        position: 5,
        image_url: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80',
      },
    ];

    console.log('📚 Creating events...');
    const eventIds = [];
    for (const event of events) {
      // Create UTC date for the event
      const eventDate = new Date(Date.UTC(
        today.getUTCFullYear(),
        today.getUTCMonth(),
        today.getUTCDate() + (event.position - 1),
        14, // 2 PM UTC
        0, 0, 0
      ));

      const res = await client.query(
        'INSERT INTO events (title, description, max_bookings_per_slot, position, image_url, date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
        [event.title, event.description, event.max_bookings_per_slot, event.position, event.image_url, eventDate]
      );
      eventIds.push(res.rows[0].id);
    }
    console.log(`✅ Created ${events.length} events`);

    // Insert slots
    console.log('⏰ Creating slots...');
    const slots = [];

    for (let i = 0; i < eventIds.length; i++) {
      const eventId = eventIds[i];
      const eventDate = new Date(Date.UTC(
        today.getUTCFullYear(),
        today.getUTCMonth(),
        today.getUTCDate() + i,
        0, 0, 0, 0
      ));

      // Create 3 slots per event at different times
      const slotTimes = [
        new Date(eventDate.getTime() + 10 * 3600 * 1000), // 10 AM UTC
        new Date(eventDate.getTime() + 14 * 3600 * 1000), // 2 PM UTC
        new Date(eventDate.getTime() + 18 * 3600 * 1000), // 6 PM UTC
      ];

      for (const startTime of slotTimes) {
        slots.push({ event_id: eventId, start_time: startTime });
      }
    }

    const slotIds = [];
    for (const slot of slots) {
      const res = await client.query(
        'INSERT INTO slots (event_id, start_time) VALUES ($1, $2) RETURNING id',
        [slot.event_id, slot.start_time]
      );
      slotIds.push(res.rows[0].id);
    }
    console.log(`✅ Created ${slots.length} slots`);

    // Insert some bookings
    console.log('📝 Creating bookings...');
    const bookings = [
      { slot_id: slotIds[0], name: 'John Doe', email: 'john.doe@gmail.com' },
      { slot_id: slotIds[1], name: 'Jane Smith', email: 'jane.smith@gmail.com' },
      { slot_id: slotIds[2], name: 'Mike Wilson', email: 'mike.wilson@gmail.com' },
    ];

    for (const booking of bookings) {
      await client.query(
        'INSERT INTO bookings (slot_id, name, email) VALUES ($1, $2, $3)',
        [booking.slot_id, booking.name, booking.email]
      );
    }
    console.log(`✅ Created ${bookings.length} bookings`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('🔑 Admin login: admin@gmail.com');
    console.log('🌍 All times are stored in UTC and will auto-adjust to user timezone');

  } catch (err) {
    console.error('❌ Error seeding data:', err);
  } finally {
    client.release();
    process.exit();
  }
}

seed();