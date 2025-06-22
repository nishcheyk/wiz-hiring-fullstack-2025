import React, { useState } from 'react';
import Button from './Button';
import './CheckoutForm.css';

function CheckoutForm({ onSubmit }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [card, setCard] = useState('');
  const [exp, setExp] = useState('');
  const [cvv, setCvv] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, email, card, exp, cvv });
  };

  return (
    <form className="checkout-form" onSubmit={handleSubmit}>
      <h2>Checkout</h2>
      <input type="text" placeholder="Name on Card" value={name} onChange={e => setName(e.target.value)} required />
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
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
