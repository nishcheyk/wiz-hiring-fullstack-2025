# BookWIZ – Event Booking App

## Overview
BookWIZ is a fullstack event booking platform built with React (frontend), Express (backend), and PostgreSQL. It features a modern, responsive design with smooth animations, multiple payment options, and comprehensive event management capabilities.

---

## ✨ Key Features

### 🎯 **Core Functionality**
- **Event listing with smooth auto-sliding carousel** - Responsive slider showing 4-6 events with drag/swipe support
- **Event details and slot booking** with real-time availability tracking
- **Admin event management** with drag-and-drop reordering
- **User booking management** with booking history
- **Timezone-aware scheduling** with proper date handling

### 🎨 **UI/UX Features**
- **Smooth continuous slider** with ping-pong animation and pause-on-hover
- **Responsive design** that adapts to all screen sizes
- **Modern dark theme** with purple accent colors
- **Interactive payment method selection** with real-time validation
- **Form validation** with helpful input hints and character restrictions

### 💳 **Payment System**
- **Multiple payment options:**
  - Credit/Debit Card (with card number, expiry, CVV validation)
  - UPI (accepts letters, numbers, and special characters)
  - PhonePe (10-digit phone number validation)
  - Paytm (10-digit phone number validation)
- **Real-time input validation** and formatting
- **Character restrictions** and input sanitization

### 🔧 **Technical Features**
- **Lazy loading** for optimized image display
- **Backend pagination** for efficient data loading
- **Database availability tracking** with transactional booking updates
- **Admin user management** with approval system
- **Event branding** with image URL support

---

## 🎠 Smooth Event Slider

**Experience our signature smooth auto-sliding carousel:**
- **Continuous ping-pong animation** - slides left to right, reverses at ends
- **Drag/swipe support** with inertia for mobile and desktop
- **Pause-on-hover** functionality
- **Responsive design** - shows 4 cards on desktop, 3 on tablet, 2 on mobile
- **Smooth 60fps animation** using requestAnimationFrame
- **Touch-friendly** with proper touch event handling

---

## 🚀 Admin Features

### Drag-and-Drop Event Reordering
- Go to `/admin/events` after logging in as admin
- Drag events up or down to change their order
- New order saves instantly and reflects for all users
- Powered by `@hello-pangea/dnd` for React 19 compatibility

### Event Management
- Create, edit, and delete events
- Manage event slots and availability
- View booking statistics
- User approval system

---

## Tech Stack
- **Frontend:** React 18+, Vite, Tailwind CSS, Custom CSS animations
- **Backend:** Node.js, Express, PostgreSQL
- **Database:** PostgreSQL with proper schema and relationships
- **Deployment:** Render (backend), Vercel/Netlify (frontend)

---

## Folder Structure
```
BookWIZ/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── bookings.js
│   │   │   ├── events.js
│   │   │   └── users.js
│   │   ├── database.js
│   │   ├── mail.js
│   │   └── index.js
│   ├── seed.js
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── EventSlider.jsx
│   │   │   ├── CheckoutForm.jsx
│   │   │   ├── Layout.jsx
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── EventDetailsPage.jsx
│   │   │   ├── AdminEventsPage.jsx
│   │   │   └── ...
│   │   └── utils/
│   └── .env
└── README.md
```

---

## Getting Started (Local)

### Prerequisites
- Node.js 16+ and npm
- PostgreSQL database
- Git

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Configure your PostgreSQL database URL in `.env`:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/bookwiz
   ```

5. Run database migrations:
   ```bash
   npm run migrate
   ```

6. Seed the database with sample data:
   ```bash
   npm run seed
   ```

7. Start the development server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Configure your backend API URL in `.env`:
   ```
   VITE_API_URL=http://localhost:5000
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open your browser to `http://localhost:5173`

---

## Database Schema

### Events Table
- `id`, `title`, `description`, `image_url`, `date`, `created_at`, `updated_at`

### Slots Table
- `id`, `event_id`, `start_time`, `end_time`, `available_spots`, `created_at`

### Users Table
- `id`, `name`, `email`, `is_admin`, `created_at`

### Bookings Table
- `id`, `user_id`, `slot_id`, `created_at`

---

## Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/bookwiz
ADMIN_EMAIL=admin@example.com
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000
ADMIN_EMAIL=admin@example.com
```

---

## API Endpoints

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create new event (admin)
- `PUT /api/events/:id` - Update event (admin)
- `DELETE /api/events/:id` - Delete event (admin)

### Bookings
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create new booking
- `DELETE /api/bookings/:id` - Cancel booking

### Users
- `GET /api/users` - Get all users (admin)
- `PUT /api/users/:id/approve` - Approve user (admin)

---

## Deployment

### Backend (Render)
1. Connect your GitHub repository to Render
2. Set environment variables in Render dashboard
3. Deploy with Node.js build command

### Frontend (Vercel/Netlify)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy with Vite build command

---

## Features in Detail

### 🎠 Event Slider
- **Smooth animation** with 60fps performance
- **Responsive breakpoints** for different screen sizes
- **Touch and mouse support** with proper event handling
- **Auto-play with pause-on-hover**
- **Direction reversal** at slider ends

### 💳 Payment System
- **Multiple payment methods** with dedicated validation
- **Real-time input formatting** and character restrictions
- **Visual feedback** for form validation
- **Mobile-optimized** input fields

### 📱 Responsive Design
- **Mobile-first approach** with progressive enhancement
- **Flexible layouts** that adapt to screen size
- **Touch-friendly** interface elements
- **Optimized performance** across devices

---

## Future Enhancements
- [ ] Real payment gateway integration
- [ ] Email notifications and confirmations
- [ ] User authentication with JWT
- [ ] File upload for event images
- [ ] Real-time booking updates with WebSocket
- [ ] Advanced admin analytics dashboard
- [ ] Multi-language support
- [ ] PWA capabilities

---

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## License
This project is licensed under the MIT License.

---

## Contact
For questions or support, contact the maintainer at `nishcheycapture2014@gmail.com`.

