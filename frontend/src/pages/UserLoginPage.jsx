import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

function UserLoginPage() {
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (userId.trim().length < 3) {
      setError('User ID must be at least 3 characters.');
      return;
    }
    localStorage.setItem('userId', userId);
    navigate('/create');
  };

  return (
    <div className="main-content animate-fade-in">
      <div className="form-container">
        <h1 className="title mb-4">User Login</h1>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input type="text" placeholder="Enter your User ID" value={userId} onChange={e => setUserId(e.target.value)} required />
          <Button type="submit">Login</Button>
        </form>
        {error && <div style={{ color: '#f87171', marginTop: 8 }}>{error}</div>}
      </div>
    </div>
  );
}

export default UserLoginPage;
