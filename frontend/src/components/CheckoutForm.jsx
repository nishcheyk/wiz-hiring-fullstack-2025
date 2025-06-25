import React, { useState, useEffect } from 'react';
import Button from './Button';
import './CheckoutForm.css';

function CheckoutForm({ onSubmit, email: propEmail }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState(propEmail || '');
  const [paymentMethod, setPaymentMethod] = useState('card');

  // Card fields
  const [card, setCard] = useState('');
  const [exp, setExp] = useState('');
  const [cvv, setCvv] = useState('');

  // UPI field
  const [upiId, setUpiId] = useState('');

  // Phone number for PhonePe and Paytm
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    if (propEmail) setEmail(propEmail);
  }, [propEmail]);

  const handleNameChange = (e) => {
    // Allow only alphabets and spaces
    let value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
    setName(value);
  };

  const handleCardChange = (e) => {
    // Allow only numbers
    let value = e.target.value.replace(/\D/g, '');
    setCard(value.substring(0, 16));
  };

  const handleExpChange = (e) => {
    // Allow only numbers and auto-format as MM/YY
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    setExp(value.substring(0, 5));
  };

  const handleCvvChange = (e) => {
    // Allow only numbers
    let value = e.target.value.replace(/\D/g, '');
    setCvv(value.substring(0, 4));
  };

  const handleUpiChange = (e) => {
    // Allow letters, numbers, @, ., _, -
    let value = e.target.value.replace(/[^a-zA-Z0-9@._-]/g, '');
    setUpiId(value);
  };

  const handlePhoneChange = (e) => {
    // Allow only numbers and limit to exactly 10 digits
    let value = e.target.value.replace(/\D/g, '');
    setPhoneNumber(value.substring(0, 10));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let paymentData = { name, email, paymentMethod };

    switch (paymentMethod) {
      case 'card':
        paymentData = { ...paymentData, card, exp, cvv };
        break;
      case 'upi':
        paymentData = { ...paymentData, upiId };
        break;
      case 'phonepe':
      case 'paytm':
        paymentData = { ...paymentData, phoneNumber };
        break;
    }

    onSubmit(paymentData);
  };

  const renderPaymentFields = () => {
    switch (paymentMethod) {
      case 'card':
        return (
          <>
            <input
              type="text"
              placeholder="Card Number (Numbers Only)"
              value={card}
              onChange={handleCardChange}
              required
              maxLength={16}
            />
            <small className="input-hint">Only numbers allowed</small>

            <div className="checkout-row">
              <input
                type="text"
                placeholder="MM/YY"
                value={exp}
                onChange={handleExpChange}
                required
                maxLength={5}
              />
              <input
                type="text"
                placeholder="CVV"
                value={cvv}
                onChange={handleCvvChange}
                required
                maxLength={4}
              />
            </div>
            <small className="input-hint">Only numbers allowed</small>
          </>
        );

      case 'upi':
        return (
          <>
            <input
              type="text"
              placeholder="UPI ID (e.g., username@upi)"
              value={upiId}
              onChange={handleUpiChange}
              required
            />
            <small className="input-hint">Letters, numbers, @, ., _, - allowed</small>
          </>
        );

      case 'phonepe':
      case 'paytm':
        return (
          <>
            <input
              type="tel"
              placeholder="Enter 10-digit phone number"
              value={phoneNumber}
              onChange={handlePhoneChange}
              required
              maxLength={10}
              pattern="[0-9]{10}"
            />
            <small className="input-hint">
              {phoneNumber.length === 10 ? '✅ Valid phone number' : `Enter ${10 - phoneNumber.length} more digits`}
            </small>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <form className="checkout-form" onSubmit={handleSubmit}>
      <h2>Checkout</h2>

      <input
        type="text"
        placeholder="Name (Letters Only)"
        value={name}
        onChange={handleNameChange}
        required
      />
      <small className="input-hint">Only alphabets and spaces allowed</small>

      {propEmail ? (
        <input type="email" value={email} readOnly style={{ background: '#23272f', color: '#a78bfa', fontWeight: 600 }} />
      ) : (
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
      )}

      <div className="payment-methods">
        <button
          type="button"
          className={`payment-method ${paymentMethod === 'card' ? 'active' : ''}`}
          onClick={() => setPaymentMethod('card')}
        >
          💳 Credit/Debit Card
        </button>
        <button
          type="button"
          className={`payment-method ${paymentMethod === 'upi' ? 'active' : ''}`}
          onClick={() => setPaymentMethod('upi')}
        >
          📱 UPI
        </button>
        <button
          type="button"
          className={`payment-method ${paymentMethod === 'phonepe' ? 'active' : ''}`}
          onClick={() => setPaymentMethod('phonepe')}
        >
          📱 PhonePe
        </button>
        <button
          type="button"
          className={`payment-method ${paymentMethod === 'paytm' ? 'active' : ''}`}
          onClick={() => setPaymentMethod('paytm')}
        >
          📱 Paytm
        </button>
      </div>

      {renderPaymentFields()}

      <Button type="submit">Pay & Book</Button>
    </form>
  );
}

export default CheckoutForm;
