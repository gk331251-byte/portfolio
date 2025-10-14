# Stripe Payment Integration Demo

> Production-ready payment processing with FastAPI backend and React frontend

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg)](https://reactjs.org/)
[![Stripe](https://img.shields.io/badge/Stripe-API-635BFF.svg)](https://stripe.com/)

## 🎯 Overview

A complete implementation of Stripe payment processing demonstrating:
- Payment Intent creation and confirmation
- Secure webhook event handling with signature verification
- PCI-compliant checkout using Stripe Elements
- Comprehensive error handling and logging
- Test mode for safe development

Built as part of my Solutions Engineering portfolio to showcase API integration expertise and customer-facing technical documentation skills.

## 🏗️ Architecture

**Frontend:** React with Stripe Elements for secure payment form
**Backend:** FastAPI with async webhook handling
**Payment Provider:** Stripe Payment Intent API

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   React     │─────▶│   FastAPI    │─────▶│   Stripe    │
│   Client    │      │   Backend    │      │     API     │
└─────────────┘      └──────────────┘      └─────────────┘
      │                     ▲                      │
      │                     │                      │
      │              ┌──────┴────────┐            │
      └──────────────│   Stripe.js   │◀───────────┘
                     │   Elements    │
                     └───────────────┘

                     ┌──────────────┐
                     │   Webhooks   │
                     │   (Events)   │
                     └──────┬───────┘
                            │
                            ▼
                     ┌──────────────┐
                     │   FastAPI    │
                     │   /webhook   │
                     └──────────────┘
```

**Data Flow:**
1. Frontend requests payment intent from backend
2. Backend creates payment intent with Stripe API
3. Frontend uses Stripe.js to confirm payment
4. Stripe sends webhook events to backend
5. Backend verifies signature and processes events

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- Stripe account (free test mode)
- Stripe CLI for local webhook testing

### Backend Setup

```bash
cd stripe-backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Add your Stripe keys to .env
cp .env.example .env
# Edit .env with your keys from https://dashboard.stripe.com/apikeys

uvicorn main:app --reload --port 8000
```

Backend runs at: http://localhost:8000
API docs available at: http://localhost:8000/docs

### Frontend Setup

```bash
cd frontend
npm install

# Add your Stripe publishable key
cp .env.local.example .env.local
# Edit .env.local with your key

npm run dev
```

Frontend runs at: http://localhost:5173

### Webhook Testing

```bash
# In a new terminal
stripe login
stripe listen --forward-to localhost:8000/webhook

# Copy the webhook signing secret (whsec_...) to backend/.env
# STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# Restart backend server to load new webhook secret
```

## 🧪 Testing

### Test Cards

Use these Stripe test cards for different scenarios:

| Card Number | Scenario | Result |
|------------|----------|--------|
| `4242 4242 4242 4242` | Success | Payment succeeds |
| `4000 0000 0000 0002` | Declined | Card is declined |
| `4000 0000 0000 9995` | Insufficient funds | Insufficient funds error |
| `4000 0027 6000 3184` | 3D Secure | Requires authentication |

**Additional test details:**
- **Expiry:** Any future date (e.g., `12/34`)
- **CVC:** Any 3 digits (e.g., `123`)
- **ZIP:** Any 5 digits (e.g., `12345`)

### Triggering Webhook Events

```bash
# Test successful payment
stripe trigger payment_intent.succeeded

# Test failed payment
stripe trigger payment_intent.payment_failed

# Test subscription creation
stripe trigger customer.subscription.created
```

Check your backend logs to see the events being processed!

## 📸 Screenshots

### Payment Form
![Stripe Payment Form](./screenshots/payment-form.png)
*PCI-compliant checkout with Stripe Elements*

### Successful Payment
![Payment Success](./screenshots/payment-success.png)
*Confirmation message after successful payment*

### Backend API Documentation
![FastAPI Docs](./screenshots/api-docs.png)
*Interactive API documentation with Swagger UI*

### Webhook Event Logging
![Webhook Logs](./screenshots/webhook-logs.png)
*Real-time webhook event processing in backend logs*

### Architecture Diagram
![System Architecture](./screenshots/stripe-architecture.png)
*Complete payment flow with all components*

### Error Handling
![Error Handling](./screenshots/error-handling.png)
*User-friendly error messages for failed payments*

## 🔐 Security Features

- ✅ **Webhook signature verification** - Prevents spoofing and replay attacks
- ✅ **Environment-based API key management** - Secrets never committed to git
- ✅ **PCI-compliant payment form** - Card data handled by Stripe, not your servers
- ✅ **Input validation with Pydantic** - Type-safe request models
- ✅ **Proper error handling** - No sensitive data exposed in error messages
- ✅ **CORS configuration** - Only allowed origins can access API
- ✅ **Server-side payment intent creation** - Prevents amount manipulation

### Security Best Practices Implemented

1. **Never expose secret keys** - API keys stored in `.env` files (gitignored)
2. **Always verify webhook signatures** - Using `stripe.Webhook.construct_event()`
3. **Create payment intents server-side** - Clients can't manipulate amounts
4. **Use HTTPS in production** - Required for webhooks
5. **Implement idempotency** - Prevent duplicate payment processing
6. **Separate test and production keys** - Different environments

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python async framework
- **Stripe Python SDK** - Official Stripe library
- **Pydantic** - Data validation and serialization
- **Python-dotenv** - Environment variable management
- **Uvicorn** - ASGI server for FastAPI

### Frontend
- **React 18** - UI library
- **Vite** - Fast build tool and dev server
- **Stripe.js** - Official Stripe client library
- **@stripe/react-stripe-js** - React components for Stripe
- **Axios** - HTTP client for API calls

### Testing & Development
- **Stripe CLI** - Local webhook testing
- **Test Mode API keys** - Safe development environment
- **FastAPI auto-docs** - Interactive API documentation

## 📚 Key Learnings

### Technical Insights
- **Webhook reliability requires signature verification** - Without it, attackers can send fake events
- **Payment intents must be created server-side** - Client-side creation allows amount manipulation
- **Proper error handling improves customer experience** - Clear messages reduce support tickets
- **Async webhook processing prevents timeout issues** - Stripe expects responses within 5 seconds
- **Idempotency keys prevent duplicate charges** - Critical for production reliability

### Solutions Engineering Takeaways
- **Clear documentation accelerates customer adoption** - This README mirrors production docs
- **Test cards enable confident demos** - No risk when showcasing to customers
- **Error messages should be actionable** - Tell users what to do, not just what went wrong
- **Architecture diagrams clarify complex flows** - Essential for technical conversations

## 📄 API Endpoints

### `POST /create-payment-intent`
Creates a Stripe Payment Intent for processing a payment.

**Request Body:**
```json
{
  "amount": 2999,
  "currency": "usd",
  "customer_email": "customer@example.com",
  "order_id": "order_123"
}
```

**Response:**
```json
{
  "client_secret": "pi_3Abc123_secret_xyz"
}
```

**Example:**
```bash
curl -X POST http://localhost:8000/create-payment-intent \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 2999,
    "currency": "usd",
    "customer_email": "test@example.com",
    "order_id": "demo_12345"
  }'
```

### `POST /webhook`
Receives and processes Stripe webhook events.

**Handled Events:**
- `payment_intent.succeeded` - Payment completed successfully
- `payment_intent.payment_failed` - Payment failed
- `customer.subscription.created` - New subscription created
- `customer.subscription.updated` - Subscription modified
- `customer.subscription.deleted` - Subscription cancelled

**Response:**
```json
{
  "status": "success"
}
```

### `GET /health`
Health check endpoint for monitoring.

**Response:**
```json
{
  "status": "healthy"
}
```

## 🚦 Project Structure

```
stripe-integration-demo/
├── stripe-backend/           # FastAPI backend
│   ├── main.py              # Main application with all endpoints
│   ├── requirements.txt     # Python dependencies
│   ├── .env.example         # Example environment variables
│   ├── .env                 # Your actual keys (gitignored)
│   └── README.md            # This file
│
├── frontend/                # React frontend
│   ├── src/
│   │   ├── App.jsx          # Main app component
│   │   ├── components/
│   │   │   ├── CheckoutForm.jsx
│   │   │   └── CheckoutForm.css
│   │   ├── App.css
│   │   └── index.css
│   ├── .env.local.example   # Example env vars
│   ├── .env.local           # Your actual keys (gitignored)
│   └── package.json
│
└── screenshots/             # Demo screenshots
```

## 🔄 Development Workflow

1. **Start Backend:** `uvicorn main:app --reload --port 8000`
2. **Start Frontend:** `npm run dev`
3. **Start Webhook Forwarding:** `stripe listen --forward-to localhost:8000/webhook`
4. **Test Payment:** Use test card `4242 4242 4242 4242`
5. **Monitor Logs:** Watch backend terminal for payment events

## 🐛 Troubleshooting

### CORS Errors
**Problem:** Frontend can't reach backend
**Solution:** Check that frontend port is in `allow_origins` list in `main.py`

### Webhook Signature Verification Fails
**Problem:** Webhook events return 400 errors
**Solution:** Ensure `STRIPE_WEBHOOK_SECRET` in `.env` matches the one from `stripe listen`

### Payment Intent Creation Fails
**Problem:** 500 error when creating payment
**Solution:** Verify `STRIPE_SECRET_KEY` is correct and starts with `sk_test_`

### Frontend Shows White Screen
**Problem:** React app doesn't load
**Solution:** Check that `.env.local` has `VITE_STRIPE_PUBLISHABLE_KEY` set

## 🎓 Learning Resources

- [Stripe Payment Intents Guide](https://stripe.com/docs/payments/payment-intents)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Stripe Webhooks Best Practices](https://stripe.com/docs/webhooks/best-practices)
- [React Stripe.js Documentation](https://stripe.com/docs/stripe-js/react)

## 🚀 Production Deployment Checklist

Before deploying to production:

- [ ] Use production Stripe keys (`sk_live_...`)
- [ ] Enable HTTPS (required for webhooks)
- [ ] Update CORS origins to production domain
- [ ] Set up proper logging and monitoring
- [ ] Implement rate limiting
- [ ] Set up webhook endpoint in Stripe Dashboard
- [ ] Test with small real transactions
- [ ] Implement database for order tracking
- [ ] Add idempotency key handling
- [ ] Set up error alerting (email/Slack)

## 👤 Author

**Gavin Kelly**
Solutions Engineer | Engineering Physics @ Tulane | GCP Professional Cloud Architect

- 🔗 LinkedIn: [linkedin.com/in/gavin-kelly](https://linkedin.com/in/gavin-kelly)
- 🌐 Portfolio: [gavin-kelly-solutions.dev](https://gavin-kelly-solutions.dev)
- 📧 Email: gavin@example.com

### About This Project
This demo was built to showcase my technical abilities for Solutions Engineering roles. It demonstrates:
- API integration expertise
- Customer-facing technical documentation
- Full-stack development skills
- Security best practices
- Clear communication of complex technical concepts

## 📄 License

MIT License - feel free to use for learning and portfolio purposes.

## 🙏 Acknowledgments

- Stripe for excellent documentation and test infrastructure
- FastAPI for making Python API development enjoyable
- The React and Vite teams for great developer experience

---

**Built with ❤️ as part of my transition from Engineering Physics to Solutions Engineering.**

*Questions? Feel free to reach out or open an issue!*
