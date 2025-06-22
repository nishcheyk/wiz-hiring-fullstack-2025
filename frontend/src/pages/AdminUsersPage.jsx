import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../components/Button';

function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Get admin email from localStorage
  const userType = localStorage.getItem('userType');
  const adminEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    if (userType !== 'admin') {
      navigate('/login');
      return;
    }
    fetchUsers();
  }, [navigate, userType]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users?adminEmail=${adminEmail}`);
      setUsers(res.data);
    } catch (err) {
      setMessage('Failed to fetch users');
    }
  };

  const approveUser = async (userEmail) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/users/approve`, { adminEmail, userEmail });
      setMessage(`Approved ${userEmail}`);
      fetchUsers();
    } catch (err) {
      setMessage('Failed to approve user');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="form-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="title mb-4">User Approvals</h1>
        <Button type="button" onClick={handleLogout} style={{ marginLeft: 16 }}>Logout</Button>
      </div>
      <div style={{ marginBottom: 16 }}>
        <input
          type="email"
          placeholder="User email to approve"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ marginRight: 8 }}
        />
        <Button type="button" onClick={() => approveUser(email)}>Approve</Button>
      </div>
      <h2 style={{ fontSize: '1.1rem', margin: '16px 0 8px 0' }}>All Users</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {users.map(u => (
          <li key={u.email} style={{ marginBottom: 8, background: '#23272f', borderRadius: 6, padding: 8 }}>
            {u.email} {u.is_approved ? <span style={{ color: '#34d399' }}>(Approved)</span> : <Button type="button" onClick={() => approveUser(u.email)} size="sm">Approve</Button>}
          </li>
        ))}
      </ul>
      {message && <div style={{ color: '#a78bfa', marginTop: 12 }}>{message}</div>}
    </div>
  );
}

export default AdminUsersPage;
