import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './styles/uiverse-form.css';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import EventDetailsPage from './pages/EventDetailsPage';
import CreateEventPage from './pages/CreateEventPage';
import MyBookingsPage from './pages/MyBookingsPage';
import AdminBookingsPage from './pages/AdminBookingsPage';
import AdminLoginPage from './pages/AdminLoginPage';
import LoginPage from './pages/LoginPage';
import AdminUsersPage from './pages/AdminUsersPage';
import SignupPage from './pages/SignupPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/events/:id" element={<EventDetailsPage />} />
          <Route path="/create" element={<CreateEventPage />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/bookings" element={<AdminBookingsPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
