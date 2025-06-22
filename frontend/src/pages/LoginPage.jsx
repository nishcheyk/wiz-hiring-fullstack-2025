import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Use the real admin email from frontend .env
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@gmail.com';
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin';
    
    if (email === adminEmail && password === adminPassword) {
      localStorage.setItem('userType', 'admin');
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userId', email); // Save userId as email for admin
      console.log('localStorage after admin login:', {
        userType: localStorage.getItem('userType'),
        userEmail: localStorage.getItem('userEmail'),
        userId: localStorage.getItem('userId')
      });
      navigate('/admin/users');
    } else if (email && password) {
      localStorage.setItem('userType', 'user');
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userId', email); // Save userId as email for user
      console.log('localStorage after user login:', {
        userType: localStorage.getItem('userType'),
        userEmail: localStorage.getItem('userEmail'),
        userId: localStorage.getItem('userId')
      });
      navigate('/');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="main-content animate-fade-in">
      <div className="form-container">
        <h1 className="title mb-4">Login</h1>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <Button type="submit">Login</Button>
        </form>
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          Don't have an account?{' '}
          <Button type="button" variant="link" onClick={() => navigate('/signup')} style={{ color: '#a78bfa', background: 'none', border: 'none', padding: 0, fontWeight: 500 }}>Sign Up</Button>
        </div>
        {error && <div style={{ color: '#f87171', marginTop: 8 }}>{error}</div>}
      </div>
    </div>
  );
}

export default LoginPage;
