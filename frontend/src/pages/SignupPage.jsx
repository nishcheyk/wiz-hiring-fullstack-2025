import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

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
    // Simulate user creation (in real app, call backend)
    localStorage.setItem('userType', 'user');
    localStorage.setItem('userEmail', email);
    setMessage('Signup successful! You can now log in.');
    setTimeout(() => navigate('/login'), 1200);
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
        {message && <div style={{ color: '#34d399', marginTop: 8 }}>{message}</div>}
      </div>
    </div>
  );
}

export default SignupPage;
