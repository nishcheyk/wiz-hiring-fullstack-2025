import React, { useState } from 'react';
import './PaymentMethod.css';

function PaymentMethod({ onPaymentComplete, amount }) {
  const [paymentText, setPaymentText] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePaymentTextChange = (e) => {
    // Allow only alphabets and spaces
    let value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
    setPaymentText(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!paymentText.trim()) {
      alert('Please enter payment details');
      return;
    }

    setLoading(true);

    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      onPaymentComplete({
        success: true,
        paymentText: paymentText.trim(),
        amount,
        transactionId: 'TXN' + Date.now()
      });
    }, 2000);
  };

  return (
    <div className="payment-method-container">
      <h2>Payment Method</h2>
      <div className="amount-display">
        <span>Amount to Pay:</span>
        <span className="amount">₹{amount}</span>
      </div>

      <form onSubmit={handleSubmit} className="payment-form-container">
        <div className="form-group">
          <label>Payment Details (Letters Only)</label>
          <input
            type="text"
            value={paymentText}
            onChange={handlePaymentTextChange}
            placeholder="Enter payment details using letters only"
            className="payment-input"
            required
          />
          <small>Only alphabets and spaces are allowed</small>
        </div>

        <button
          type="submit"
          className="pay-button"
          disabled={loading || !paymentText.trim()}
        >
          {loading ? 'Processing...' : `Pay ₹${amount}`}
        </button>
      </form>
    </div>
  );
}

export default PaymentMethod;