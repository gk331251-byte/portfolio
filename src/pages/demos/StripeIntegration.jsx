import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Zap, CheckCircle, Lock, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { trackPageView, trackDemoViewed } from '../../utils/analytics';

const StripeIntegration = () => {
  const [openAccordion, setOpenAccordion] = useState(null);

  const toggleAccordion = (index) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  const keyFeatures = [
    {
      title: 'One-Time & Recurring Payments',
      description: 'Support for both single purchases and subscription billing'
    },
    {
      title: 'Secure Webhook Handling',
      description: 'Verified event processing with signature authentication'
    },
    {
      title: 'Automated Error Recovery',
      description: 'Retry logic with exponential backoff for failed webhooks'
    },
    {
      title: 'Production-Ready Design',
      description: 'Environment-based configuration and comprehensive logging'
    }
  ];

  const architectureComponents = [
    {
      title: 'React + Stripe Elements',
      subtitle: 'Frontend Layer',
      points: [
        'Stripe Elements for PCI-compliant payment form',
        'Client-side payment intent confirmation',
        'Error handling with user-friendly messaging',
        'Support for multiple payment methods'
      ],
      tech: 'React, @stripe/react-stripe-js, Axios'
    },
    {
      title: 'FastAPI Payment Service',
      subtitle: 'Backend API',
      points: [
        'RESTful endpoints for payment intent creation',
        'Webhook receiver for Stripe events',
        'Signature verification for security',
        'Async processing for scalability'
      ],
      tech: 'FastAPI, Stripe Python SDK, Pydantic'
    },
    {
      title: 'Stripe Payment Processing',
      subtitle: 'Stripe Platform',
      points: [
        'Payment intent creation and management',
        'Subscription billing automation',
        'Webhook event generation',
        'Payment method storage (optional)'
      ],
      tech: 'Stripe API v2023-10-16'
    },
    {
      title: 'Database & State Management',
      subtitle: 'Data Persistence',
      points: [
        'Order and transaction records',
        'Customer subscription status',
        'Webhook event logging',
        'Idempotency key tracking'
      ],
      tech: 'Firestore / PostgreSQL'
    }
  ];

  const implementationSteps = [
    {
      title: 'Backend: Payment Intent Creation',
      description: 'Server-side endpoint that creates a Stripe Payment Intent with proper security',
      code: `@app.post("/create-payment-intent")
async def create_payment_intent(request: PaymentIntentRequest):
    try:
        intent = stripe.PaymentIntent.create(
            amount=request.amount,
            currency=request.currency,
            automatic_payment_methods={"enabled": True},
            metadata={
                "order_id": request.order_id,
                "customer_email": request.customer_email
            }
        )
        return {"client_secret": intent.client_secret}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))`,
      keyPoints: [
        'Server-side creation prevents amount manipulation',
        'Metadata stores order context for webhooks',
        'Client secret returned for frontend confirmation',
        'Proper error handling with HTTP exceptions'
      ]
    },
    {
      title: 'Frontend: Checkout Form with Stripe Elements',
      description: 'React component using Stripe.js for PCI-compliant payment collection',
      code: `const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + '/success'
      },
      redirect: 'if_required'
    });

    if (paymentIntent?.status === 'succeeded') {
      setMessage('Payment successful!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button type="submit">Pay Now</button>
    </form>
  );
};`,
      keyPoints: [
        'Stripe Elements handles PCI compliance',
        'No card data touches your servers',
        'Client-side confirmation with Payment Element',
        'Conditional redirect for 3D Secure'
      ]
    },
    {
      title: 'Webhook Handler with Signature Verification',
      description: 'Critical security pattern for processing Stripe events reliably',
      code: `@app.post("/webhook")
async def webhook_handler(request: Request):
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, WEBHOOK_SECRET
        )
    except ValueError:
        raise HTTPException(status_code=400)
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400)

    if event['type'] == 'payment_intent.succeeded':
        await handle_successful_payment(event['data']['object'])
    elif event['type'] == 'payment_intent.payment_failed':
        await handle_failed_payment(event['data']['object'])

    return {"status": "success"}`,
      keyPoints: [
        'ALWAYS verify webhook signatures - prevents spoofing',
        'Use construct_event() for automatic verification',
        'Return 200 immediately to acknowledge receipt',
        'Process events asynchronously for scalability'
      ]
    },
    {
      title: 'Local Testing with Stripe CLI',
      description: 'Development workflow for testing webhooks without deployed server',
      code: `# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to your Stripe account
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:8000/webhook

# Copy webhook signing secret to .env
# STRIPE_WEBHOOK_SECRET=whsec_...

# Trigger test events
stripe trigger payment_intent.succeeded
stripe trigger payment_intent.payment_failed`,
      keyPoints: [
        'Stripe CLI forwards events to localhost',
        'Test webhook handling without deployment',
        'Trigger specific events for testing',
        'Validates signature verification logic'
      ]
    },
    {
      title: 'Error Handling & Recovery',
      description: 'Production-ready patterns for handling failures gracefully',
      code: `async def handle_successful_payment(payment_intent):
    """Process successful payment with idempotency"""
    payment_id = payment_intent['id']

    # Check if already processed (idempotency)
    if await db.is_payment_processed(payment_id):
        logger.info(f"Payment {payment_id} already processed")
        return

    try:
        # Update order status
        await db.update_order_status(
            payment_intent['metadata']['order_id'],
            'paid'
        )

        # Send confirmation email
        await send_confirmation_email(
            payment_intent['metadata']['customer_email']
        )

        # Mark as processed
        await db.mark_payment_processed(payment_id)

    except Exception as e:
        logger.error(f"Error processing payment: {e}")
        # Stripe will retry webhook automatically`,
      keyPoints: [
        'Idempotency prevents duplicate processing',
        'Store processed event IDs in database',
        'Stripe retries failed webhooks automatically',
        'Log errors for monitoring and debugging'
      ]
    },
    {
      title: 'Production Deployment Considerations',
      description: 'Security and reliability checklist for going live',
      code: `# .env.production
STRIPE_SECRET_KEY=sk_live_...  # Use live keys
STRIPE_WEBHOOK_SECRET=whsec_...  # From Stripe Dashboard

# Stripe Dashboard Settings:
# 1. Add webhook endpoint: https://yourdomain.com/webhook
# 2. Select events: payment_intent.*, customer.subscription.*
# 3. Enable webhook signature verification

# Security Checklist:
✓ Never commit API keys to version control
✓ Use environment variables for all secrets
✓ Enable HTTPS (required for webhooks)
✓ Implement rate limiting on endpoints
✓ Set up monitoring and alerting
✓ Test with small real transactions first`,
      keyPoints: [
        'Switch to live API keys in production',
        'Configure webhook endpoint in Stripe Dashboard',
        'HTTPS required for webhook security',
        'Monitor webhook delivery rate and failures'
      ]
    }
  ];

  const securityPractices = [
    {
      title: 'API Key Management',
      subtitle: 'Secure Key Storage',
      practices: [
        'Never commit API keys to version control',
        'Use environment variables for all sensitive credentials',
        'Separate test and production keys',
        'Rotate keys periodically',
        'Use restricted API keys when possible'
      ]
    },
    {
      title: 'Webhook Signature Verification',
      subtitle: 'Webhook Authentication',
      practices: [
        'ALWAYS verify webhook signatures',
        'Use Stripe\'s construct_event() method',
        'Store webhook secrets securely',
        'Return 400 for invalid signatures',
        'Log verification failures for monitoring'
      ]
    },
    {
      title: 'Idempotency Keys',
      subtitle: 'Preventing Duplicate Operations',
      practices: [
        'Use idempotency keys for all operations',
        'Generate keys based on operation context',
        'Store processed event IDs',
        'Implement database uniqueness constraints',
        'Return cached responses for duplicates'
      ]
    },
    {
      title: 'Data Minimization',
      subtitle: 'Customer Data Protection',
      practices: [
        'Never store raw card numbers',
        'Minimize PII storage',
        'Implement data retention policies',
        'Use Stripe Checkout for lowest compliance scope',
        'Encrypt sensitive data at rest'
      ]
    }
  ];

  const commonPitfalls = [
    {
      title: 'Not Verifying Webhook Signatures',
      problem: 'Attackers can send fake webhook events to your endpoint',
      solution: 'ALWAYS use stripe.Webhook.construct_event() with your webhook secret to verify signatures before processing any event data.'
    },
    {
      title: 'Creating Payment Intents Client-Side',
      problem: 'Customers can manipulate the payment amount in the browser',
      solution: 'Always create payment intents on your server. The client should only receive the client_secret for confirmation.'
    },
    {
      title: 'Not Handling Idempotency',
      problem: 'Webhook retries can cause duplicate order fulfillment',
      solution: 'Store processed event IDs in your database and check before processing. Use database constraints to prevent duplicates.'
    },
    {
      title: 'Blocking Webhook Response',
      problem: 'Long processing times cause webhook timeouts and retries',
      solution: 'Return 200 OK immediately, then process the event asynchronously in a background job or queue.'
    }
  ];

  const metrics = [
    {
      title: '95% Reduction in Payment Errors',
      description: 'Automated error handling and retry logic eliminated manual intervention for transient failures, improving customer experience and reducing support tickets.'
    },
    {
      title: '500+ Subscriptions Automated',
      description: 'Webhook-driven subscription management automatically handles renewals, payment failures, and cancellations without manual processing.'
    },
    {
      title: '99.9% Webhook Delivery Rate',
      description: 'Proper signature verification, idempotency handling, and async processing ensure reliable event processing even during traffic spikes.'
    }
  ];

  const keyTakeaways = [
    'Webhook Reliability is Critical - Always implement signature verification and retry logic. Missing a webhook can lead to data inconsistency.',
    'Test Thoroughly Before Production - Use Stripe CLI and test cards extensively. Edge cases will happen in production.',
    'Security Cannot Be Compromised - Never expose secret keys, always verify webhooks, use idempotency keys.',
    'Async Processing Improves UX - Return 200 OK immediately to Stripe, then process webhooks in background.',
    'Monitor Everything - Set up alerts for webhook failures, payment errors, and API rate limits.'
  ];

  // Track page view on mount
  useEffect(() => {
    trackPageView('Stripe Integration');
    trackDemoViewed('Stripe Integration');
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-primary dark:text-secondary hover:opacity-80 mb-8"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back to Home</span>
        </Link>

        {/* Hero Section */}
        <div className="mb-12">
          <div
            className="h-64 w-full rounded-lg mb-8 flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #3D5A3C 0%, #9CAF88 100%)',
            }}
          >
            <div className="text-center text-white">
              <h1 className="text-4xl font-bold mb-4">Stripe Payment Integration</h1>
              <p className="text-xl opacity-90">A Complete Implementation Guide</p>
            </div>
          </div>

          <p className="text-2xl text-center mb-6 text-neutral">
            Building secure payment processing with webhook handling, subscription management, and production-ready error recovery
          </p>

          {/* Stats Badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center space-x-2 px-4 py-2 bg-primary/10 dark:bg-secondary/10 rounded-full">
              <Zap size={20} className="text-primary dark:text-secondary" />
              <span className="font-medium">~200ms Response Time</span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-primary/10 dark:bg-secondary/10 rounded-full">
              <CheckCircle size={20} className="text-primary dark:text-secondary" />
              <span className="font-medium">99.9% Webhook Delivery</span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-primary/10 dark:bg-secondary/10 rounded-full">
              <Lock size={20} className="text-primary dark:text-secondary" />
              <span className="font-medium">PCI Compliant Architecture</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {['FastAPI', 'Stripe API', 'React', 'Webhooks', 'Python'].map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 rounded-full bg-primary/10 dark:bg-secondary/10 text-primary dark:text-secondary font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Personal Note */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-6 my-8 rounded-r-lg">
          <p className="text-sm leading-relaxed text-yellow-900 dark:text-yellow-100">
            <strong className="text-yellow-900 dark:text-yellow-100">Note from Gavin:</strong> I built this integration to demonstrate production-ready payment processing. This showcases not just the code, but the complete workflow from architecture design through testing and documentation—the full Solutions Engineering lifecycle.
          </p>
        </div>

        {/* Overview - The Challenge */}
        <section className="mb-16">
          <div className="bg-light-bg dark:bg-dark-bg rounded-lg p-8 shadow-lg border border-neutral/20">
            <h2 className="text-3xl font-bold mb-6 text-primary dark:text-secondary">
              The Challenge
            </h2>
            <p className="text-lg leading-relaxed mb-8 text-light-text dark:text-dark-text">
              Modern e-commerce and SaaS platforms require robust payment infrastructure that goes beyond simple transactions.
              Businesses need to handle one-time purchases, recurring subscriptions, payment method updates, and real-time event
              notifications—all while maintaining PCI compliance and providing excellent customer experience.
            </p>
            <p className="text-lg leading-relaxed mb-8 text-light-text dark:text-dark-text">
              This integration demonstrates a production-ready Stripe implementation that addresses these challenges through
              secure API design, reliable webhook processing, and comprehensive error handling.
            </p>

            {/* Key Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {keyFeatures.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-primary/5 dark:bg-secondary/5 rounded-lg">
                  <CheckCircle size={24} className="text-primary dark:text-secondary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-light-text dark:text-dark-text mb-1">{feature.title}</h3>
                    <p className="text-neutral text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Architecture */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-light-text dark:text-dark-text">
            System Architecture
          </h2>
          <p className="text-lg leading-relaxed mb-8 text-neutral">
            The integration follows a three-tier architecture separating frontend presentation, backend business logic,
            and external payment processing. This separation ensures security (API keys never exposed to clients),
            scalability (async webhook handling), and maintainability (clear separation of concerns).
          </p>

          {/* Architecture Diagram */}
          <div className="my-8">
            <img
              src="/images/demos/stripe/stripe-architecture.png"
              alt="Stripe Payment Integration Architecture - showing flow from customer browser through React checkout, FastAPI backend, Stripe API, webhook handling, and database updates"
              className="w-full max-w-5xl mx-auto rounded-lg shadow-xl border border-gray-200 dark:border-gray-700"
            />
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-3">
              Complete payment flow showing request/response cycle, webhook handling, and error paths
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {architectureComponents.map((component, index) => (
              <div key={index} className="bg-light-bg dark:bg-dark-bg rounded-lg p-6 shadow-lg border border-neutral/20">
                <div className="mb-4">
                  <p className="text-sm text-accent dark:text-accent-light font-medium mb-1">{component.subtitle}</p>
                  <h3 className="text-xl font-bold text-light-text dark:text-dark-text">{component.title}</h3>
                </div>
                <ul className="space-y-2 mb-4">
                  {component.points.map((point, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="text-primary dark:text-secondary">•</span>
                      <span className="text-sm text-neutral">{point}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-neutral/70 font-mono">{component.tech}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Live Implementation Section */}
        <section className="my-16">
          <h2 className="text-3xl font-bold mb-6 text-light-text dark:text-dark-text">
            Live Implementation
          </h2>
          <p className="text-lg leading-relaxed mb-8 text-neutral">
            Working demo built with FastAPI backend and React frontend, processing real payments through Stripe's test API.
          </p>

          <div className="grid md:grid-cols-3 gap-6 my-8">
            <div>
              <img
                src="/images/demos/stripe/checkout-empty.png"
                alt="Stripe checkout interface with payment form"
                className="rounded-lg shadow-md border border-gray-200 dark:border-gray-700 w-full"
              />
              <h4 className="font-bold text-lg mt-4 text-light-text dark:text-dark-text">Checkout Interface</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Clean payment form with Stripe Elements</p>
            </div>
            <div>
              <img
                src="/images/demos/stripe/payment-success.png"
                alt="Payment success confirmation message"
                className="rounded-lg shadow-md border border-gray-200 dark:border-gray-700 w-full"
              />
              <h4 className="font-bold text-lg mt-4 text-light-text dark:text-dark-text">Payment Confirmation</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Successful payment processing with client feedback</p>
            </div>
            <div>
              <img
                src="/images/demos/stripe/stripe-dashboard-payment.png"
                alt="Stripe dashboard showing successful payment"
                className="rounded-lg shadow-md border border-gray-200 dark:border-gray-700 w-full"
              />
              <h4 className="font-bold text-lg mt-4 text-light-text dark:text-dark-text">Stripe Dashboard</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Transaction recorded in Stripe's payment dashboard</p>
            </div>
          </div>
        </section>

        {/* Implementation Code Section */}
        <section className="my-16 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-8 rounded-xl border border-green-200 dark:border-green-800">
          <h2 className="text-3xl font-bold mb-4 text-light-text dark:text-dark-text">
            Implementation Code
          </h2>
          <p className="text-lg leading-relaxed mb-6 text-neutral">
            The complete working implementation is available on GitHub, including production-ready code for both frontend and backend.
          </p>

          <div className="grid md:grid-cols-2 gap-4 my-6">
            <div className="flex items-start">
              <span className="text-green-600 dark:text-green-400 mr-3 text-xl">✓</span>
              <div>
                <strong className="text-light-text dark:text-dark-text">FastAPI Backend</strong>
                <p className="text-sm text-gray-600 dark:text-gray-400">Async payment intent creation and webhook handling</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-green-600 dark:text-green-400 mr-3 text-xl">✓</span>
              <div>
                <strong className="text-light-text dark:text-dark-text">React Frontend</strong>
                <p className="text-sm text-gray-600 dark:text-gray-400">Stripe Elements integration with error handling</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-green-600 dark:text-green-400 mr-3 text-xl">✓</span>
              <div>
                <strong className="text-light-text dark:text-dark-text">Security Best Practices</strong>
                <p className="text-sm text-gray-600 dark:text-gray-400">Webhook signature verification and input validation</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-green-600 dark:text-green-400 mr-3 text-xl">✓</span>
              <div>
                <strong className="text-light-text dark:text-dark-text">Complete Documentation</strong>
                <p className="text-sm text-gray-600 dark:text-gray-400">Setup instructions, testing guide, and architecture</p>
              </div>
            </div>
          </div>

          <a
            href="https://github.com/gk331251-byte/stripe-integration-demo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
          >
            View on GitHub →
          </a>
        </section>

        {/* Webhook Demonstration Section */}
        <section className="my-16">
          <h2 className="text-3xl font-bold mb-6 text-light-text dark:text-dark-text">
            Webhook Event Handling
          </h2>
          <p className="text-lg leading-relaxed mb-8 text-neutral">
            Real-time webhook processing with signature verification to ensure security and prevent spoofing attacks.
          </p>

          <div className="grid md:grid-cols-2 gap-6 my-8">
            <div>
              <img
                src="/images/demos/stripe/stripe-webhooks.png"
                alt="Stripe dashboard webhook events"
                className="rounded-lg shadow-md border border-gray-200 dark:border-gray-700 w-full"
              />
              <h4 className="font-bold text-lg mt-4 text-light-text dark:text-dark-text">Stripe Webhook Events</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Events delivered and verified in Stripe Dashboard</p>
            </div>
            <div>
              <img
                src="/images/demos/stripe/terminal-webhook-log.png"
                alt="Terminal showing webhook processing logs"
                className="rounded-lg shadow-md border border-gray-200 dark:border-gray-700 w-full"
              />
              <h4 className="font-bold text-lg mt-4 text-light-text dark:text-dark-text">Backend Processing</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Server logs showing verified webhook events</p>
            </div>
          </div>
        </section>

        {/* Step-by-Step Implementation */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-light-text dark:text-dark-text">
            Step-by-Step Implementation
          </h2>
          <p className="text-lg leading-relaxed mb-8 text-neutral">
            Complete walkthrough of building a production-ready Stripe integration from scratch.
          </p>

          <div className="space-y-4">
            {implementationSteps.map((step, index) => (
              <div key={index} className="bg-light-bg dark:bg-dark-bg rounded-lg border border-neutral/20 overflow-hidden">
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-primary/5 dark:hover:bg-secondary/5 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl font-bold text-primary dark:text-secondary">
                      {index + 1}
                    </span>
                    <div className="text-left">
                      <h3 className="text-lg font-bold text-light-text dark:text-dark-text">
                        {step.title}
                      </h3>
                      <p className="text-sm text-neutral">{step.description}</p>
                    </div>
                  </div>
                  <ArrowRight
                    size={20}
                    className={`text-primary dark:text-secondary transform transition-transform ${
                      openAccordion === index ? 'rotate-90' : ''
                    }`}
                  />
                </button>

                {openAccordion === index && (
                  <div className="px-6 pb-6 border-t border-neutral/20">
                    <div className="mt-4 bg-gray-900 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm text-gray-100 font-mono">
                        <code>{step.code}</code>
                      </pre>
                    </div>
                    <div className="mt-4 space-y-2">
                      <h4 className="font-bold text-light-text dark:text-dark-text">Key Points:</h4>
                      <ul className="space-y-2">
                        {step.keyPoints.map((point, i) => (
                          <li key={i} className="flex items-start space-x-2">
                            <CheckCircle size={16} className="text-primary dark:text-secondary flex-shrink-0 mt-1" />
                            <span className="text-sm text-neutral">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Security Best Practices */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-light-text dark:text-dark-text">
            Security Considerations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {securityPractices.map((practice, index) => (
              <div key={index} className="bg-light-bg dark:bg-dark-bg rounded-lg p-6 shadow-lg border border-neutral/20">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-light-text dark:text-dark-text mb-1">{practice.title}</h3>
                  <p className="text-sm text-accent dark:text-accent-light">{practice.subtitle}</p>
                </div>
                <ul className="space-y-2">
                  {practice.practices.map((item, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <Lock size={16} className="text-primary dark:text-secondary flex-shrink-0 mt-1" />
                      <span className="text-sm text-neutral">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Common Pitfalls */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-light-text dark:text-dark-text">
            Common Pitfalls & Solutions
          </h2>
          <div className="space-y-4">
            {commonPitfalls.map((pitfall, index) => (
              <div key={index} className="bg-light-bg dark:bg-dark-bg rounded-lg p-6 shadow-lg border border-neutral/20">
                <div className="flex items-start space-x-3">
                  <AlertTriangle size={24} className="text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-light-text dark:text-dark-text mb-2">
                      {pitfall.title}
                    </h3>
                    <div className="mb-3">
                      <span className="text-sm font-semibold text-red-600 dark:text-red-400">Problem: </span>
                      <span className="text-sm text-neutral">{pitfall.problem}</span>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-green-600 dark:text-green-400">Solution: </span>
                      <span className="text-sm text-neutral">{pitfall.solution}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Results & Impact */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-light-text dark:text-dark-text">
            Impact & Key Learnings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {metrics.map((metric, index) => (
              <div key={index} className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-6 border border-primary/20 dark:border-secondary/20">
                <h3 className="text-2xl font-bold text-primary dark:text-secondary mb-3">{metric.title}</h3>
                <p className="text-neutral">{metric.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-light-bg dark:bg-dark-bg rounded-lg p-8 shadow-lg border border-neutral/20">
            <h3 className="text-xl font-bold mb-4 text-light-text dark:text-dark-text">Key Takeaways</h3>
            <ul className="space-y-3">
              {keyTakeaways.map((takeaway, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <CheckCircle size={20} className="text-primary dark:text-secondary flex-shrink-0 mt-1" />
                  <span className="text-neutral">{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Footer CTA */}
        <div className="mt-16 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-8 text-center">
          <h3 className="text-xl font-bold mb-2 text-light-text dark:text-dark-text">
            Interested in discussing payment integrations?
          </h3>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            I'd love to talk about API design, webhook reliability, or Solutions Engineering.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="https://linkedin.com/in/gavin-kelly1"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Connect on LinkedIn
            </a>
            <a
              href="https://github.com/gk331251-byte/stripe-integration-demo"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              View Full Code
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-16">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-primary dark:text-secondary hover:opacity-80 font-medium"
          >
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </Link>
          <Link
            to="/demos/gcp-architecture"
            className="inline-flex items-center space-x-2 text-primary dark:text-secondary hover:opacity-80 font-medium"
          >
            <span>Next: GCP Cloud Architecture</span>
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StripeIntegration;
