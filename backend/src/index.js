import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { migrate } from './database.js';
import eventsRouter from './routes/events.js';
import bookingsRouter from './routes/bookings.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.send('BookMySlot API is running');
});

app.use('/events', eventsRouter);
app.use('/', bookingsRouter);

// Run DB migrations on startup
migrate();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
