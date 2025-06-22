import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { isUserApproved } from '../utils/auth';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [approved, setApproved] = useState(false);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    setUserType(localStorage.getItem('userType'));
    async function checkApproval() {
      if (localStorage.getItem('userType') === 'user') {
        setApproved(await isUserApproved());
      } else {
        setApproved(false);
      }
    }
    checkApproval();
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.clear();
    setUserType(null);
    setApproved(false);
    navigate('/login');
  };

  return (
    <nav className="navbar slide-up">
      <div className="navbar-logo">
        <Link to="/" className="navbar-title">BookMySlot</Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>Events</Link></li>
        {userType === 'user' && approved && (
          <li><Link to="/create" className={location.pathname === '/create' ? 'active' : ''}>Add Event</Link></li>
        )}
        <li><Link to="/my-bookings" className={location.pathname === '/my-bookings' ? 'active' : ''}>My Bookings</Link></li>
        {userType === 'admin' && (
          <>
            <li><Link to="/admin/users" className={location.pathname === '/admin/users' ? 'active' : ''}>Admin</Link></li>
            <li><Link to="/admin/bookings" className={location.pathname === '/admin/bookings' ? 'active' : ''}>Bookings</Link></li>
          </>
        )}
        {userType && (
          <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
        )}
        {!userType && (
          <>
            <li><Link to="/login" className={location.pathname === '/login' ? 'active' : ''}>Login</Link></li>
            <li><Link to="/signup" className={location.pathname === '/signup' ? 'active' : ''}>Sign Up</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
