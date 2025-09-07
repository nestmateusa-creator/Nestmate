# NestMate Payment System Setup

This guide will help you set up a working payment system for NestMate using Stripe.

## Prerequisites

1. **Stripe Account**: Create a free account at [stripe.com](https://stripe.com)
2. **Node.js**: Install Node.js (version 14 or higher)
3. **npm**: Comes with Node.js

## Setup Steps

### 1. Stripe Account Setup

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Get your API keys:
   - **Publishable Key** (starts with `pk_test_`): Use this in your frontend
   - **Secret Key** (starts with `sk_test_`): Use this in your backend (keep secret!)

### 2. Create Products and Prices

In your Stripe Dashboard:

1. Go to **Products** → **Add Product**
2. Create these products:

**Basic Plan ($5/month)**
- Name: "NestMate Basic"
- Price: $5.00 USD
- Billing: Recurring monthly
- Copy the Price ID (starts with `price_`)

**Pro Plan ($10/month)**
- Name: "NestMate Pro"
- Price: $10.00 USD
- Billing: Recurring monthly
- Copy the Price ID

**Advanced Pro Plan ($16/month)**
- Name: "NestMate Advanced Pro"
- Price: $16.00 USD
- Billing: Recurring monthly
- Copy the Price ID

### 3. Backend Server Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` file with your Stripe keys:
   ```
   STRIPE_SECRET_KEY=YOUR_LIVE_STRIPE_SECRET_KEY_HERE
   STRIPE_PUBLISHABLE_KEY=pk_test_51S4C0sAmpksixclYeG19nYyKaIrbc41a2Twtw8uNCPTEFO9BLQl6BRN6V9HxLNyCZZrMdPIy9wzk5xOGfd943BNM00Z3gp2GuY
   PORT=3001
   ```

5. Start the server:
   ```bash
   npm start
   ```

### 4. Frontend Integration

1. Update the Stripe publishable key in your HTML files:
   ```javascript
   const stripe = Stripe('pk_test_your_actual_publishable_key');
   ```

2. Update the server URL in your JavaScript:
   ```javascript
   const SERVER_URL = 'http://localhost:3001';
   ```

3. Your publishable key is already configured in all upgrade pages:
   ```javascript
   const stripe = Stripe('pk_test_51S4C0sAmpksixclYeG19nYyKaIrbc41a2Twtw8uNCPTEFO9BLQl6BRN6V9HxLNyCZZrMdPIy9wzk5xOGfd943BNM00Z3gp2GuY');
   ```

### 5. Test the Payment System

1. Use Stripe test card numbers:
   - **Success**: `4242 4242 4242 4242`
   - **Decline**: `4000 0000 0000 0002`
   - **Requires Authentication**: `4000 0025 0000 3155`

2. Use any future expiry date (e.g., `12/25`)
3. Use any 3-digit CVC (e.g., `123`)

## Production Deployment

### 1. Switch to Live Mode

1. In Stripe Dashboard, toggle to **Live mode**
2. Get your live API keys
3. Update your environment variables

### 2. Set up Webhooks

1. In Stripe Dashboard, go to **Webhooks**
2. Add endpoint: `https://yourdomain.com/webhook`
3. Select events:
   - `payment_intent.succeeded`
   - `payment_method.attached`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

### 3. Security Considerations

- Never expose your secret key in frontend code
- Use HTTPS in production
- Validate webhook signatures
- Implement proper error handling
- Store customer data securely

## API Endpoints

### Create Payment Intent
```
POST /create-payment-intent
{
  "amount": 500,
  "currency": "usd",
  "planType": "basic"
}
```

### Create Customer
```
POST /create-customer
{
  "email": "user@example.com",
  "name": "John Doe"
}
```

### Create Subscription
```
POST /create-subscription
{
  "customerId": "cus_...",
  "priceId": "price_...",
  "paymentMethodId": "pm_..."
}
```

## Troubleshooting

### Common Issues

1. **"Invalid API Key"**: Check your Stripe keys are correct
2. **"No such price"**: Verify your Price IDs in Stripe Dashboard
3. **CORS errors**: Make sure your server is running and accessible
4. **Webhook failures**: Check webhook URL and signature verification

### Testing

- Use Stripe's test mode for development
- Test with different card numbers for various scenarios
- Monitor Stripe Dashboard for payment events
- Check server logs for errors

## Support

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Testing Guide](https://stripe.com/docs/testing)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
