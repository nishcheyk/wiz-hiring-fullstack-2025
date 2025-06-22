import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import axios from 'axios';

function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage('Please enter email and password.');
      return;
    }
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/users/signup`, { email, password });
      setMessage('Signup successful! You can now log in.');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Signup failed.');
    }
  };

  return (
    <div className="main-content animate-fade-in">
      <div className="form-container">
        <h1 className="title mb-4">Sign Up</h1>
        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <Button type="submit">Sign Up</Button>
        </form>
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          Already have an account?{' '}
          <Button type="button" variant="link" onClick={() => navigate('/login')} style={{ color: '#a78bfa', background: 'none', border: 'none', padding: 0, fontWeight: 500 }}>Login</Button>
        </div>
        {message && <div style={{ color: '#34d399', marginTop: 8 }}>{message}</div>}
      </div>
    </div>
  );
}

export default SignupPage;
