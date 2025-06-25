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
    console.log('🗑️ Clearing existing data...');
    await client.query('DELETE FROM bookings');
    await client.query('DELETE FROM slots');
    await client.query('DELETE FROM events');
    await client.query('DELETE FROM users');

    // Insert users including admin@gmail.com as admin
    const users = [
      { email: 'admin@gmail.com', is_approved: 1, is_admin: 1 },
      { email: 'admin@example.com', is_approved: 1, is_admin: 1 },
      { email: 'john.doe@gmail.com', is_approved: 1, is_admin: 0 },
      { email: 'jane.smith@gmail.com', is_approved: 1, is_admin: 0 },
      { email: 'mike.wilson@gmail.com', is_approved: 1, is_admin: 0 },
      { email: 'sarah.jones@gmail.com', is_approved: 0, is_admin: 0 },
      { email: 'david.brown@gmail.com', is_approved: 1, is_admin: 0 },
      { email: 'emma.davis@gmail.com', is_approved: 1, is_admin: 0 },
      { email: 'alex.taylor@gmail.com', is_approved: 0, is_admin: 0 },
      { email: 'lisa.garcia@gmail.com', is_approved: 1, is_admin: 0 },
    ];

    console.log('👥 Creating users...');
    for (const user of users) {
      await client.query(
        'INSERT INTO users (email, is_approved, is_admin) VALUES ($1, $2, $3)',
        [user.email, user.is_approved, user.is_admin]
      );
    }
    console.log(`✅ Created ${users.length} users`);

    // Insert events with better variety - using UTC timestamps for timezone flexibility
    const today = new Date();
    const events = [
      {
        title: 'Book Reading: Fantasy Night',
        description: 'Join us for a magical evening of fantasy book readings with special guest authors.',
        max_bookings_per_slot: 15,
        position: 1,
        image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
      },
      {
        title: 'Author Meet & Greet',
        description: 'Meet your favorite authors and get your books signed! Special Q&A session included.',
        max_bookings_per_slot: 25,
        position: 2,
        image_url: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=600&q=80',
      },
      {
        title: 'Children Story Hour',
        description: 'Fun and engaging story hour for children ages 4-8 with interactive activities.',
        max_bookings_per_slot: 20,
        position: 3,
        image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
      },
      {
        title: 'Poetry Slam Night',
        description: 'Showcase your poetry or enjoy others\' performances in this open mic night.',
        max_bookings_per_slot: 30,
        position: 4,
        image_url: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80',
      },
      {
        title: 'Mystery Book Club',
        description: 'Discuss the latest and greatest in mystery novels with fellow enthusiasts.',
        max_bookings_per_slot: 18,
        position: 5,
        image_url: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80',
      },
      {
        title: 'Sci-Fi Saturday',
        description: 'Explore new worlds with our sci-fi book discussions and movie screenings.',
        max_bookings_per_slot: 22,
        position: 6,
        image_url: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
      },
      {
        title: 'Cookbook Exchange',
        description: 'Bring a cookbook, take a cookbook, and share your favorite recipes with the community.',
        max_bookings_per_slot: 15,
        position: 7,
        image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
      },
      {
        title: 'Non-Fiction Night',
        description: 'Discuss biographies, memoirs, and more with engaging presentations.',
        max_bookings_per_slot: 25,
        position: 8,
        image_url: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=600&q=80',
      },
    ];

    console.log('📚 Creating events...');
    const eventIds = [];
    for (const event of events) {
      // Create event date in UTC - this will be automatically converted to user's timezone
      const eventDate = new Date(Date.UTC(
        today.getUTCFullYear(),
        today.getUTCMonth(),
        today.getUTCDate() + (event.position - 1),
        14, // 2 PM UTC (will show as appropriate time in user's timezone)
        0, 0, 0
      ));

      const res = await client.query(
        'INSERT INTO events (title, description, max_bookings_per_slot, position, image_url, date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
        [event.title, event.description, event.max_bookings_per_slot, event.position, event.image_url, eventDate]
      );
      eventIds.push(res.rows[0].id);
    }
    console.log(`✅ Created ${events.length} events`);

    // Insert multiple slots for each event (3-4 slots per event) - using UTC times
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

      // Create slots at different times throughout the day (UTC)
      const slotTimes = [
        new Date(eventDate.getTime() + 10 * 3600 * 1000), // 10 AM UTC
        new Date(eventDate.getTime() + 14 * 3600 * 1000), // 2 PM UTC
        new Date(eventDate.getTime() + 18 * 3600 * 1000), // 6 PM UTC
        new Date(eventDate.getTime() + 20 * 3600 * 1000), // 8 PM UTC
      ];

      for (const startTime of slotTimes) {
        slots.push({
          event_id: eventId,
          start_time: startTime,
          available_spots: events[i].max_bookings_per_slot
        });
      }
    }

    const slotIds = [];
    for (const slot of slots) {
      const res = await client.query(
        'INSERT INTO slots (event_id, start_time, available_spots) VALUES ($1, $2, $3) RETURNING id',
        [slot.event_id, slot.start_time, slot.available_spots]
      );
      slotIds.push(res.rows[0].id);
    }
    console.log(`✅ Created ${slots.length} slots`);

    // Insert realistic bookings for various slots
    console.log('📝 Creating bookings...');
    const bookingNames = [
      'John Doe', 'Jane Smith', 'Mike Wilson', 'Sarah Jones', 'David Brown',
      'Emma Davis', 'Alex Taylor', 'Lisa Garcia', 'Robert Johnson', 'Maria Rodriguez',
      'James Williams', 'Jennifer Brown', 'Michael Davis', 'Linda Miller', 'Christopher Wilson',
      'Amanda Moore', 'Daniel Taylor', 'Ashley Anderson', 'Matthew Thomas', 'Stephanie Jackson'
    ];

    const bookingEmails = [
      'john.doe@gmail.com', 'jane.smith@gmail.com', 'mike.wilson@gmail.com', 'sarah.jones@gmail.com', 'david.brown@gmail.com',
      'emma.davis@gmail.com', 'alex.taylor@gmail.com', 'lisa.garcia@gmail.com', 'robert.johnson@gmail.com', 'maria.rodriguez@gmail.com',
      'james.williams@gmail.com', 'jennifer.brown@gmail.com', 'michael.davis@gmail.com', 'linda.miller@gmail.com', 'christopher.wilson@gmail.com',
      'amanda.moore@gmail.com', 'daniel.taylor@gmail.com', 'ashley.anderson@gmail.com', 'matthew.thomas@gmail.com', 'stephanie.jackson@gmail.com'
    ];

    const bookings = [];

    // Add bookings to various slots (not all slots will be full)
    for (let i = 0; i < slotIds.length; i++) {
      const slotId = slotIds[i];
      const eventIndex = Math.floor(i / 4); // 4 slots per event
      const maxBookings = events[eventIndex].max_bookings_per_slot;

      // Randomly book 30-80% of available slots
      const numBookings = Math.floor(Math.random() * (maxBookings * 0.8 - maxBookings * 0.3 + 1)) + Math.floor(maxBookings * 0.3);

      for (let j = 0; j < numBookings; j++) {
        const nameIndex = (i * 3 + j) % bookingNames.length;
        const emailIndex = (i * 3 + j) % bookingEmails.length;

        bookings.push({
          slot_id: slotId,
          name: bookingNames[nameIndex],
          email: bookingEmails[emailIndex]
        });
      }
    }

    // Insert bookings and update available_spots
    for (const booking of bookings) {
      await client.query('BEGIN');
      try {
        await client.query(
          'INSERT INTO bookings (slot_id, name, email) VALUES ($1, $2, $3)',
          [booking.slot_id, booking.name, booking.email]
        );
        await client.query('UPDATE slots SET available_spots = available_spots - 1 WHERE id = $1', [booking.slot_id]);
        await client.query('COMMIT');
      } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error creating booking:', err);
      }
    }
    console.log(`✅ Created ${bookings.length} bookings`);

    console.log('\n🎉 Database reset and seeded successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - ${users.length} users (including admin@gmail.com as admin)`);
    console.log(`   - ${events.length} events`);
    console.log(`   - ${slots.length} slots (3-4 per event)`);
    console.log(`   - ${bookings.length} bookings`);
    console.log('\n🔑 Admin login: admin@gmail.com');
    console.log('🌍 All times are stored in UTC and will automatically adjust to user timezone');

  } catch (err) {
    console.error('❌ Error seeding data:', err);
  } finally {
    client.release();
    process.exit();
  }
}

seed();