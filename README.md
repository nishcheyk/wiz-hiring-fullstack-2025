# BookWIZ – Event Booking App

## Overview
BookWIZ is a fullstack event booking platform built with React (frontend), Express (backend), and PostgreSQL. It supports event creation, slot booking, admin event management, event branding with image URL, and Google Calendar sync (mocked). No email confirmation is required or implemented.

---

## Tech Stack
- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** PostgreSQL
- **Deployment:** Render (backend) (frontend)

---

## Folder Structure
```
BookWIZ/
  backend/
    src/
      routes/
      database.js
      mail.js
    .env.example
    ...
  frontend/
    src/
      pages/
      components/
    .env.example
    ...
```

---

## Features
- Event listing, details, and slot booking
- Admin drag-and-drop event reordering
- Event branding (image URL)
- Google Calendar sync (mocked link)
- My Bookings page
- Admin user approval

---

## Getting Started (Local)

### Backend
1. Copy `.env.example` to `.env` and fill in your PostgreSQL credentials.
2. Install dependencies:
   ```
   npm install
   ```
3. Run migrations:
   ```
   npm run migrate
   ```
4. Start server:
   ```
   npm start
   ```

### Frontend
1. Copy `.env.example` to `.env` and set `VITE_API_URL` to your backend URL.
2. Install dependencies:
   ```
   npm install
   ```
3. Start dev server:
   ```
   npm run dev
   ```

---

## Deployment
- **Backend:** [Render](https://render.com/) (or Railway)
- **Frontend:** [Vercel](https://vercel.com/) or [Netlify](https://netlify.com/)
- Add your deployed URLs here:
  - Backend: `https://your-backend.onrender.com`
  - Frontend: `https://your-frontend.vercel.app`

---

## Environment Variables

### Backend (`backend/.env.example`)
```
PORT=5000
DATABASE_URL=your_postgres_url
ADMIN_EMAIL=admin@gmail.com
```

### Frontend (`frontend/.env.example`)
```
VITE_API_URL=https://your-backend.onrender.com
ADMIN_EMAIL=admin@gmail.com
```

---

## Bonus Features
- Drag-and-drop event reordering (admin)
- Google Calendar sync (mocked)
- Event branding (image URL)

---

## Assumptions & Areas for Improvement
**Assumptions:**
- Users are identified by email (no password reset or OAuth).
- Admin email is set in `.env`.
- Image upload is via URL, not file upload.

**Areas for Improvement:**
- Add file/image upload support (e.g., Cloudinary).
- Add user authentication (JWT, OAuth).
- Improve error handling and user feedback.
- Add real-time updates (WebSocket) for bookings.
- Enhance admin dashboard (analytics, user management).

---

## Commit History
- All code and history migrated from the original repo. See commit log for details.

---

## Contact
For questions or support, contact the maintainer at `nishcheycapture2014@gmail.com`.
