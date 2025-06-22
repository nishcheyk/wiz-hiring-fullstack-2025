# BookMySlot

A modern, fullstack scheduling application where users can create events and let others book available time slots. Built with React (Vite) + CSS (frontend) and Node.js (Express.js) + SQLite (backend).

## ✨ Features
- Create events with custom slots and max bookings per slot
- Public event listing and event details
- Book slots (with time zone support, auto-converted to your local time)
- Prevent double booking and overbooking
- View your bookings by email
- Admin UI to view all bookings (with admin email)
- Clean, modern UI with custom CSS and subtle animations

## 📁 Folder Structure
- `frontend/` – React (Vite) app
  - `src/components/` – Reusable UI components
  - `src/pages/` – App pages (Home, Event, Create, Bookings, Admin)
  - `src/styles/` – CSS files (theme, forms, animations)
- `backend/` – Express.js API

## 🚀 Getting Started

### 1. Clone the repository
```sh
git clone <your-repo-url>
cd BookMySlot
```

### 2. Setup Environment Variables
Copy `.env.example` to `.env` in both `frontend/` and `backend/` folders and update as needed.

### 3. Start the Backend
```sh
cd backend
npm install
npm run dev
```

### 4. Start the Frontend
```sh
cd frontend
npm install
npm run dev
```

Open your browser at [http://localhost:5173](http://localhost:5173)

## 🛠️ Tech Stack
- **Frontend:** React (Vite), CSS (custom, minimal Tailwind), Luxon (time zones)
- **Backend:** Node.js, Express.js, SQLite (easy local dev)

## 📝 .env Example
See `.env.example` in each folder for required variables. No email/SMPP setup needed.

## 🖥️ Admin UI
- Set your admin email in `.env` as `ADMIN_EMAIL`.
- Visit `/admin/bookings` in the app to view all bookings (admin only).

## 📦 Deployment
- Frontend: Vercel, Netlify, or any static host
- Backend: Render, Railway, or any Node.js host

## 📄 Submission Checklist
- [x] Working backend with all relevant routes and validations
- [x] Functional frontend with event listing, detail view, and booking
- [x] Clear GitHub repository with meaningful commit history
- [x] Local setup instructions (with `.env.example`)
- [x] Well-written README explaining tech choices, folder structure, and approach
- [x] Bonus features (admin UI) clearly listed
- [x] No email/SMPP config required

## 🙌 Credits
- UI form theme inspired by [Uiverse.io](https://uiverse.io/)

---

Feel free to open issues or submit PRs for improvements!
