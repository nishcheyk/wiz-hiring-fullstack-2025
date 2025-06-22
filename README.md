# 📚 BookWIZ – Event Booking App

BookWIZ is a full-stack event booking platform where users can explore events, book slots, and admins can manage event visibility, order, and branding. It features drag-and-drop event reordering, an animated slider, and a streamlined booking experience — all built using React, Node.js, and PostgreSQL.

---

## 🌟 Features

### 👥 Users
- View upcoming events
- Book slots with availability management
- View personal bookings
- Mobile-friendly interface

### 👑 Admins
- Create, update, and delete events
- Approve user accounts
- Drag-and-drop to reorder event appearance
- Assign image URLs and mock Google Calendar links

### 🎞️ Animated Event Slider
- Displays top events in a **horizontally scrolling banner**
- Auto scrolls back and forth (right-to-left and left-to-right)
- Fully responsive
- Clickable cards linking to event details

---

## 🛠️ Tech Stack

| Layer      | Technology                     |
|------------|--------------------------------|
| Frontend   | React, Vite, Tailwind CSS      |
| Backend    | Node.js, Express               |
| Database   | PostgreSQL                     |
| Drag/Drop  | @hello-pangea/dnd              |
| Deployment | Render (backend), Vercel/Netlify (frontend) |

---

## 📁 Folder Structure

```
BookWIZ/
  ├── backend/
  │   ├── src/
  │   │   ├── routes/
  │   │   ├── controllers/
  │   │   ├── database.js
  │   │   ├── mail.js
  │   └── .env.example
  └── frontend/
      ├── src/
      │   ├── components/
      │   │   ├── EventSlider.jsx
      │   │   └── EventSlider.css
      │   ├── pages/
      └── .env.example
```

---

## 🚀 Getting Started

### Backend Setup

```bash
cd backend
cp .env.example .env
# Add your PostgreSQL DATABASE_URL
npm install
npm run migrate
npm start
```

### Frontend Setup

```bash
cd frontend
cp .env.example .env
# Set VITE_API_URL to your backend (e.g., http://localhost:5000)
npm install
npm run dev
```

---

## 🌐 Deployment

### Backend
- Platform: [Render](https://render.com/)
- Add the following environment variables:
  - `DATABASE_URL`
  - `PORT`
  - `ADMIN_EMAIL`

### Frontend
- Platform: [Vercel](https://vercel.com/) or [Netlify](https://netlify.com/)
- Set environment:
  - `VITE_API_URL=https://your-backend.onrender.com`

---

## 🌈 Live Demo

- **Frontend:** https://bookwiz.vercel.app
- **Backend:** https://bookwiz-api.onrender.com

> ⚠️ Replace with your actual links.

---

## 📦 Environment Variables

### Backend (`.env`)
```
PORT=5000
DATABASE_URL=your_postgres_connection_url
ADMIN_EMAIL=admin@gmail.com
```

### Frontend (`.env`)
```
VITE_API_URL=https://your-backend.onrender.com
ADMIN_EMAIL=admin@gmail.com
```

---

## 🧩 Notable Components

### 🎞️ `EventSlider.jsx`
- Auto-scrolls events horizontally in both directions
- Uses CSS `@keyframes` with `alternate` mode
- Fully clickable cards for navigation

### 🧲 Drag-and-Drop Event Ordering
- Visit `/admin/events`
- Built with `@hello-pangea/dnd`
- Saves order persistently to backend

---

## 🧪 Bonus Features
- Google Calendar sync (mock link)
- Admin user approval flow
- Responsive design
- Smooth animations and hover effects
- Mocked mail setup (placeholder for SMTP)

---

## 📌 Assumptions

- Users are identified by email; no OAuth
- Admin email is hardcoded/set in `.env`
- Images are added via public URL (not file uploads)

---

## 🧠 Areas for Improvement

- Add JWT-based login & authentication
- Implement file upload with Cloudinary or S3
- Add pagination or lazy loading for large event lists
- Integrate real SMTP service for confirmations
- Add real-time updates using WebSockets
- Expand Admin Dashboard with analytics and metrics

---

## 🧾 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙋‍♂️ Contact

For questions, contributions, or feedback, contact:

**Nishchey Khajuria**
📧 [nishcheycapture2014@gmail.com](mailto:nishcheycapture2014@gmail.com)

---

> ⭐ If you find this project useful, give it a star on GitHub!
