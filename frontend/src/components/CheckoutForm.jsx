import React, { useState, useEffect } from 'react';
import Button from './Button';
import './CheckoutForm.css';

function CheckoutForm({ onSubmit, email: propEmail }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState(propEmail || '');
  const [card, setCard] = useState('');
  const [exp, setExp] = useState('');
  const [cvv, setCvv] = useState('');

  useEffect(() => {
    if (propEmail) setEmail(propEmail);
  }, [propEmail]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, email, card, exp, cvv });
  };

  return (
    <form className="checkout-form" onSubmit={handleSubmit}>
      <h2>Checkout</h2>
      <input type="text" placeholder="Name on Card" value={name} onChange={e => setName(e.target.value)} required />
      {propEmail ? (
        <input type="email" value={email} readOnly style={{ background: '#23272f', color: '#a78bfa', fontWeight: 600 }} />
      ) : (
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
      )}
      <input type="text" placeholder="Card Number" value={card} onChange={e => setCard(e.target.value)} required maxLength={16} />
      <div className="checkout-row">
        <input type="text" placeholder="MM/YY" value={exp} onChange={e => setExp(e.target.value)} required maxLength={5} />
        <input type="text" placeholder="CVV" value={cvv} onChange={e => setCvv(e.target.value)} required maxLength={4} />
      </div>
      <Button type="submit">Pay & Book</Button>
    </form>
  );
}

export default CheckoutForm;
