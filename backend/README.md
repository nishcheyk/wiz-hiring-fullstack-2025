# BookMySlot Backend

Express.js API for BookMySlot scheduling app.

## Setup

1. Copy `.env.example` to `.env` and update as needed.
2. Install dependencies:
   ```
   npm install
   ```
3. Start the server:
   ```
   npm run dev
   ```

## Environment Variables
- `PORT`: Port to run the server (default: 5000)
- `DATABASE_URL`: Database connection string (default: SQLite)

## API Endpoints
- `POST   /events`            – Create an event
- `GET    /events`            – List all events
- `GET    /events/:id`        – Get event + slots
- `POST   /events/:id/bookings` – Book a slot
- `GET    /users/:email/bookings` – View bookings (optional)

## Tech Stack
- Node.js, Express.js
- SQLite (default, can switch to PostgreSQL)

---

## To Do
- [x] Scaffold basic Express server
- [ ] Add event and booking routes
- [ ] Add database models
- [ ] Implement API logic
- [ ] Connect to frontend
- [ ] Deployment instructions
