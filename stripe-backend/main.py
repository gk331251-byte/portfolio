"""
Stripe Payment Integration - FastAPI Backend

This module provides a production-ready FastAPI backend for processing Stripe payments.
It includes endpoints for creating payment intents and handling webhook events securely.

Key Features:
- Payment intent creation with metadata tracking
- Secure webhook signature verification
- Comprehensive error handling
- CORS support for frontend integration
- Structured logging for debugging and monitoring
"""

import logging
import os
from typing import Dict, Any

from fastapi import FastAPI, HTTPException, Request, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv
import stripe

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables from .env file
load_dotenv()

# Initialize Stripe with secret key from environment
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")

# Validate that required environment variables are set
if not stripe.api_key:
    logger.error("STRIPE_SECRET_KEY environment variable is not set")
    raise ValueError("STRIPE_SECRET_KEY must be set in environment variables")

if not WEBHOOK_SECRET:
    logger.warning("STRIPE_WEBHOOK_SECRET is not set - webhook signature verification will fail")

# Initialize FastAPI application
app = FastAPI(
    title="Stripe Payment API",
    description="Production-ready Stripe payment processing backend",
    version="1.0.0"
)

# Configure CORS to allow requests from frontend (React app)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000"
    ],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)


# Pydantic Models for Request Validation
class PaymentIntentRequest(BaseModel):
    """Request model for creating a Stripe payment intent.

    Attributes:
        amount: Payment amount in cents (e.g., 2999 for $29.99)
        currency: Three-letter ISO currency code (default: 'usd')
        customer_email: Customer's email address for receipt and tracking
        order_id: Unique identifier for the order in your system
    """
    amount: int = Field(..., gt=0, description="Payment amount in cents")
    currency: str = Field(default="usd", min_length=3, max_length=3, description="Currency code")
    customer_email: str = Field(..., description="Customer email address")
    order_id: str = Field(..., min_length=1, description="Unique order identifier")

    class Config:
        json_schema_extra = {
            "example": {
                "amount": 2999,
                "currency": "usd",
                "customer_email": "customer@example.com",
                "order_id": "order_12345"
            }
        }


class PaymentIntentResponse(BaseModel):
    """Response model for successful payment intent creation.

    Attributes:
        client_secret: Secret key used by frontend to confirm payment
    """
    client_secret: str


class HealthResponse(BaseModel):
    """Response model for health check endpoint."""
    status: str


class WebhookResponse(BaseModel):
    """Response model for webhook endpoint."""
    status: str


# API Endpoints

@app.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check() -> Dict[str, str]:
    """
    Health check endpoint to verify the API is running.

    Returns:
        Dictionary with status 'healthy'

    Example:
        GET /health
        Response: {"status": "healthy"}
    """
    logger.info("Health check requested")
    return {"status": "healthy"}


@app.post("/create-payment-intent", response_model=PaymentIntentResponse, tags=["Payments"])
async def create_payment_intent(request: PaymentIntentRequest) -> Dict[str, str]:
    """
    Create a Stripe payment intent for processing a payment.

    This endpoint creates a payment intent on Stripe's servers and returns a
    client_secret that the frontend uses to confirm the payment securely.

    Security Note:
        - Never accept payment amounts from the client without validation
        - Always create payment intents server-side to prevent amount manipulation
        - The client_secret is safe to send to the frontend

    Args:
        request: PaymentIntentRequest containing amount, currency, email, and order_id

    Returns:
        Dictionary containing the client_secret for frontend payment confirmation

    Raises:
        HTTPException: 400 if Stripe API returns an error
        HTTPException: 500 for unexpected errors

    Example:
        POST /create-payment-intent
        Body: {
            "amount": 2999,
            "currency": "usd",
            "customer_email": "customer@example.com",
            "order_id": "order_12345"
        }
        Response: {"client_secret": "pi_xxx_secret_xxx"}
    """
    try:
        logger.info(
            f"Creating payment intent for order {request.order_id}: "
            f"${request.amount/100:.2f} {request.currency.upper()}"
        )

        # Create payment intent with Stripe
        intent = stripe.PaymentIntent.create(
            amount=request.amount,
            currency=request.currency,
            # Enable automatic payment methods (card, Google Pay, Apple Pay, etc.)
            automatic_payment_methods={"enabled": True},
            # Add metadata for tracking and reconciliation
            metadata={
                "order_id": request.order_id,
                "customer_email": request.customer_email
            },
            # Optional: Add description visible in Stripe dashboard
            description=f"Order {request.order_id}"
        )

        logger.info(f"Payment intent created successfully: {intent.id}")

        # Return only the client_secret - never expose the full intent object
        return {"client_secret": intent.client_secret}

    except stripe.error.CardError as e:
        # Card was declined
        logger.error(f"Card error: {e.user_message}")
        raise HTTPException(status_code=400, detail=e.user_message)

    except stripe.error.RateLimitError as e:
        # Too many requests to Stripe API
        logger.error("Stripe rate limit exceeded")
        raise HTTPException(status_code=429, detail="Too many requests. Please try again shortly.")

    except stripe.error.InvalidRequestError as e:
        # Invalid parameters sent to Stripe
        logger.error(f"Invalid request to Stripe: {str(e)}")
        raise HTTPException(status_code=400, detail="Invalid payment parameters")

    except stripe.error.AuthenticationError as e:
        # Authentication with Stripe failed - check API keys
        logger.critical("Stripe authentication failed - check API keys")
        raise HTTPException(status_code=500, detail="Payment system configuration error")

    except stripe.error.StripeError as e:
        # Generic Stripe error
        logger.error(f"Stripe error: {str(e)}")
        raise HTTPException(status_code=500, detail="Payment processing error")

    except Exception as e:
        # Unexpected error
        logger.exception("Unexpected error creating payment intent")
        raise HTTPException(status_code=500, detail="An unexpected error occurred")


@app.post("/webhook", response_model=WebhookResponse, tags=["Webhooks"])
async def webhook_handler(
    request: Request,
    stripe_signature: str = Header(None, alias="stripe-signature")
) -> Dict[str, str]:
    """
    Handle Stripe webhook events securely.

    Webhooks notify your application of events that happen asynchronously,
    such as successful payments, failed charges, or subscription updates.

    Critical Security:
        - ALWAYS verify webhook signatures before processing events
        - Without verification, attackers could send fake events to your endpoint
        - Use stripe.Webhook.construct_event() for automatic verification

    Args:
        request: Raw FastAPI request object (needed for body verification)
        stripe_signature: Signature header sent by Stripe for verification

    Returns:
        Dictionary with status 'success' to acknowledge receipt

    Raises:
        HTTPException: 400 if payload is invalid or signature verification fails
        HTTPException: 500 for unexpected errors

    Important:
        - Return 200 OK ONLY after successfully processing the event
        - Stripe will retry failed webhooks automatically for 3 days
        - Process heavy operations asynchronously to respond within 5 seconds

    Example:
        POST /webhook
        Headers: {
            "stripe-signature": "t=...,v1=..."
        }
        Body: <raw event JSON>
        Response: {"status": "success"}
    """
    # Get raw request body for signature verification
    payload = await request.body()

    if not stripe_signature:
        logger.error("Webhook received without stripe-signature header")
        raise HTTPException(status_code=400, detail="Missing stripe-signature header")

    try:
        # Verify webhook signature and construct event
        # This prevents processing of fake/tampered webhook events
        event = stripe.Webhook.construct_event(
            payload, stripe_signature, WEBHOOK_SECRET
        )

        logger.info(f"Webhook received: {event['type']} (ID: {event['id']})")

    except ValueError as e:
        # Invalid payload
        logger.error("Invalid webhook payload")
        raise HTTPException(status_code=400, detail="Invalid payload")

    except stripe.error.SignatureVerificationError as e:
        # Invalid signature - possible attack attempt
        logger.error(f"Webhook signature verification failed: {str(e)}")
        raise HTTPException(status_code=400, detail="Invalid signature")

    # Handle different event types
    event_type = event['type']
    event_data = event['data']['object']

    try:
        if event_type == 'payment_intent.succeeded':
            # Payment was successful
            payment_intent = event_data
            order_id = payment_intent.get('metadata', {}).get('order_id')
            amount = payment_intent.get('amount')

            logger.info(
                f"✓ Payment succeeded for order {order_id}: "
                f"${amount/100:.2f} (Payment Intent: {payment_intent['id']})"
            )

            # TODO: Update order status in your database
            # await update_order_status(order_id, 'paid')
            # await send_confirmation_email(customer_email)

        elif event_type == 'payment_intent.payment_failed':
            # Payment failed
            payment_intent = event_data
            order_id = payment_intent.get('metadata', {}).get('order_id')
            error_message = payment_intent.get('last_payment_error', {}).get('message', 'Unknown error')

            logger.warning(
                f"✗ Payment failed for order {order_id}: {error_message} "
                f"(Payment Intent: {payment_intent['id']})"
            )

            # TODO: Handle failed payment
            # await update_order_status(order_id, 'payment_failed')
            # await notify_customer_of_failure(customer_email, error_message)

        elif event_type == 'payment_intent.created':
            # Payment intent was created
            payment_intent = event_data
            logger.info(f"Payment intent created: {payment_intent['id']}")

        elif event_type == 'charge.succeeded':
            # Charge was successful (after payment intent succeeded)
            charge = event_data
            logger.info(f"Charge succeeded: {charge['id']}")

        elif event_type == 'customer.subscription.created':
            # New subscription created
            subscription = event_data
            logger.info(f"Subscription created: {subscription['id']}")

            # TODO: Activate subscription in your system
            # await activate_subscription(subscription)

        elif event_type == 'customer.subscription.updated':
            # Subscription updated (plan change, etc.)
            subscription = event_data
            logger.info(f"Subscription updated: {subscription['id']}")

        elif event_type == 'customer.subscription.deleted':
            # Subscription cancelled
            subscription = event_data
            logger.info(f"Subscription deleted: {subscription['id']}")

            # TODO: Deactivate subscription in your system
            # await deactivate_subscription(subscription)

        else:
            # Unhandled event type
            logger.info(f"Unhandled event type: {event_type}")

        # Return 200 OK to acknowledge successful receipt
        # Stripe will retry if we return any other status code
        return {"status": "success"}

    except Exception as e:
        # Log error but still return 200 to prevent Stripe from retrying
        # (only do this for non-critical errors)
        logger.exception(f"Error processing webhook event {event['id']}: {str(e)}")

        # For critical operations, raise HTTPException to trigger Stripe retry
        # raise HTTPException(status_code=500, detail="Error processing webhook")

        return {"status": "success"}


# Run the application
if __name__ == "__main__":
    import uvicorn

    # Run with: python main.py
    # Or use: uvicorn main:app --reload --port 8000
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,  # Enable auto-reload during development
        log_level="info"
    )
