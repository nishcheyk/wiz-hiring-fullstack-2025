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
    if (email === 'admin@gmail.com' && password === 'admin') {
      localStorage.setItem('userType', 'admin');
      localStorage.setItem('userEmail', email);
      navigate('/admin/users');
    } else if (email && password) {
      localStorage.setItem('userType', 'user');
      localStorage.setItem('userEmail', email);
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
        {error && <div style={{ color: '#f87171', marginTop: 8 }}>{error}</div>}
      </div>
    </div>
  );
}

export default LoginPage;
