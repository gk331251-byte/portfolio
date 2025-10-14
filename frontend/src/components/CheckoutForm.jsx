import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import './CheckoutForm.css';

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if Stripe.js has loaded
    if (!stripe || !elements) {
      setMessage('Payment system is still loading. Please wait.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Confirm the payment with Stripe
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + '/success',
        },
        redirect: 'if_required' // Stay on page if payment succeeds
      });

      if (error) {
        // Payment failed - show error message
        setMessage(error.message);
        setLoading(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Payment succeeded
        setMessage('✓ Payment successful! Thank you for your purchase.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setMessage('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <form className="checkout-form" onSubmit={handleSubmit}>
      <h3>Payment Details</h3>

      {/* Stripe Payment Element - handles card input, validation, etc. */}
      <PaymentElement />

      {/* Submit button */}
      <button
        type="submit"
        disabled={!stripe || loading}
        className={loading ? 'loading' : ''}
      >
        {loading ? (
          <>
            <span className="spinner-small"></span>
            Processing...
          </>
        ) : (
          'Pay $29.99'
        )}
      </button>

      {/* Success/Error message display */}
      {message && (
        <div className={`message ${message.includes('✓') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      {/* Security note */}
      <p className="security-note">
        🔒 Secured by Stripe - Your payment information is encrypted
      </p>
    </form>
  );
};

export default CheckoutForm;
