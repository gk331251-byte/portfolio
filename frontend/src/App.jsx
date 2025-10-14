import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './components/CheckoutForm';
import axios from 'axios';
import './App.css';

// Load Stripe with your publishable key from environment variables
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function App() {
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch payment intent client secret on mount
  useEffect(() => {
    const fetchPaymentIntent = async () => {
      try {
        setLoading(true);
        const response = await axios.post('http://localhost:8000/create-payment-intent', {
          amount: 2999, // $29.99 in cents
          currency: 'usd',
          customer_email: 'demo@example.com',
          order_id: 'demo_' + Date.now()
        });

        setClientSecret(response.data.client_secret);
        setLoading(false);
      } catch (error) {
        console.error('Error creating payment intent:', error);
        setError('Failed to initialize payment. Please refresh the page.');
        setLoading(false);
      }
    };

    fetchPaymentIntent();
  }, []);

  // Options for Stripe Elements (appearance customization)
  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#3D5A3C',
      colorBackground: '#ffffff',
      colorText: '#333330',
      colorDanger: '#df1b41',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px',
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <h1>Stripe Payment Demo</h1>
        <p className="subtitle">Testing payment integration with working backend</p>
      </header>

      {/* Main content */}
      <main className="app-main">
        {/* Product card */}
        <div className="product-card">
          <div className="product-image">
            <div className="product-placeholder">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
          </div>
          <div className="product-details">
            <h2>Demo Product</h2>
            <p className="product-price">$29.99</p>
            <p className="product-description">
              Test payment processing with Stripe integration. This demo showcases
              secure payment intent creation, PCI-compliant checkout, and webhook
              event handling.
            </p>
            <ul className="product-features">
              <li>✓ Secure payment processing</li>
              <li>✓ Real-time validation</li>
              <li>✓ Multiple payment methods</li>
              <li>✓ Production-ready error handling</li>
            </ul>
          </div>
        </div>

        {/* Checkout form wrapped in Stripe Elements */}
        <div className="checkout-container">
          {loading && (
            <div className="loading-box">
              <div className="spinner"></div>
              <p>Initializing payment...</p>
            </div>
          )}

          {error && (
            <div className="error-box">
              <p>{error}</p>
              <button onClick={() => window.location.reload()}>Retry</button>
            </div>
          )}

          {clientSecret && !loading && !error && (
            <Elements stripe={stripePromise} options={options}>
              <CheckoutForm />
            </Elements>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>
          Built with <strong>FastAPI</strong> + <strong>React</strong> +{' '}
          <strong>Stripe</strong>
        </p>
        <p className="footer-note">
          This is a demo. Use test card: <code>4242 4242 4242 4242</code>
        </p>
      </footer>
    </div>
  );
}

export default App;
