import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import './AdminLoginPage.css';

function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // For demo: hardcoded admin credentials
    if (email === 'admin@gmail.com' && password === 'admin') {
      localStorage.setItem('adminLoggedIn', 'true');
      localStorage.setItem('adminEmail', email);
      navigate('/admin/bookings');
    } else {
      setError('Invalid admin credentials');
    }
  };

  return (
    <div className="main-content animate-fade-in">
      <div className="form-container">
        <h1 className="title mb-4">Admin Login</h1>
        <form onSubmit={handleLogin} className="admin-login-form">
          <input type="email" placeholder="Admin Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <Button type="submit">Login</Button>
        </form>
        {error && <div className="admin-login-error">{error}</div>}
      </div>
    </div>
  );
}

export default AdminLoginPage;
