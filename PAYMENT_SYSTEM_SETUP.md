# Stripe Payment System Setup Guide

## Overview
This payment system integrates Stripe with AWS DynamoDB to handle subscriptions, payment methods, and dashboard locking after payment failures.

## Features
- ✅ Plan selection and subscription management
- ✅ Payment method management (add, edit, delete, set default)
- ✅ Upgrade/downgrade subscriptions
- ✅ Automatic dashboard locking 12 hours after payment failure
- ✅ Payment retry functionality
- ✅ AWS DynamoDB integration
- ✅ Stripe webhook handling

## Files Created

### Frontend Files
1. **stripe-payment-system.js** - Main payment system class
2. **payment-management.html** - Payment management interface
3. **payment-success.html** - Payment success page
4. **dashboard-payment-lock.js** - Dashboard lock check system

### Backend Files (Netlify Functions)
1. **create-checkout-session.js** - Creates Stripe checkout sessions
2. **payment-success.js** - Handles successful payments
3. **change-subscription.js** - Handles plan upgrades/downgrades
4. **get-payment-methods.js** - Retrieves user payment methods
5. **create-setup-intent.js** - Creates setup intents for adding payment methods
6. **set-default-payment-method.js** - Sets default payment method
7. **delete-payment-method.js** - Deletes payment methods
8. **retry-payment.js** - Retries failed payments
9. **stripe-webhook-aws.js** - Handles Stripe webhooks (updated)

## Setup Instructions

### 1. Stripe Configuration

#### Create Products and Prices in Stripe Dashboard
1. Go to Stripe Dashboard → Products
2. Create products for each plan:
   - **Basic Plan**: $5/month
   - **Advanced Plan**: $10/month
   - **Advanced Pro Plan**: $16/month
   - **Enterprise Plan**: $50/month

3. For each product, create a recurring price:
   - Billing period: Monthly
   - Price: Match the plan price
   - Copy the Price ID (starts with `price_`)

#### Update Price IDs
Edit `stripe-payment-system.js` and update the `getPlans()` method with your actual Stripe Price IDs:

```javascript
getPlans() {
    return {
        basic: {
            name: 'Basic',
            priceId: 'price_YOUR_BASIC_PRICE_ID', // Replace with actual Price ID
            // ...
        },
        // ... other plans
    };
}
```

#### Get Publishable Key
1. Go to Stripe Dashboard → Developers → API keys
2. Copy your **Publishable key** (starts with `pk_live_` or `pk_test_`)

#### Setup Webhook
1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://yourdomain.com/.netlify/functions/stripe-webhook-aws`
4. Select events to listen to:
   - `invoice.payment_failed`
   - `invoice.payment_succeeded`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `customer.subscription.paused`
   - `customer.subscription.resumed`
5. Copy the **Signing secret** (starts with `whsec_`)

### 2. Netlify Environment Variables

Add these environment variables in Netlify Dashboard → Site Settings → Environment Variables:

```
STRIPE_SECRET_KEY=sk_live_YOUR_SECRET_KEY_HERE
STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET

NESTMATE_AWS_REGION=us-east-2
NESTMATE_AWS_ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY
NESTMATE_AWS_SECRET_ACCESS_KEY=YOUR_AWS_SECRET_ACCESS_KEY

NESTMATE_DDB_USERS_TABLE=nestmate-users
SITE_URL=https://yourdomain.com
```

### 3. Update Frontend Code

#### Add Stripe.js to HTML Pages
Add this script tag to pages that use payment functionality:

```html
<script src="https://js.stripe.com/v3/"></script>
```

#### Add Payment Lock Check to Dashboards
Add this script tag to all dashboard HTML files (before closing `</body>` tag):

```html
<script src="dashboard-payment-lock.js"></script>
```

#### Update Pricing Page
The pricing page should call the payment system when a plan is selected. Update the plan action buttons to use:

```javascript
async function selectPlan(planKey) {
    const paymentSystem = new StripePaymentSystem();
    await paymentSystem.createCheckoutSession(planKey);
}
```

### 4. DynamoDB Table Updates

Ensure your `nestmate-users` table has these fields:
- `subscription` (String) - Plan type: 'basic', 'pro', 'advanced-pro', 'enterprise'
- `subscriptionStatus` (String) - 'active', 'inactive', 'cancelled'
- `stripeCustomerId` (String) - Stripe customer ID
- `stripeSubscriptionId` (String) - Stripe subscription ID
- `paymentMethodId` (String) - Default payment method ID
- `lastPayment` (String) - ISO timestamp of last payment
- `paymentFailedAt` (String) - ISO timestamp of payment failure
- `isLocked` (Boolean) - Whether dashboard is locked
- `lockedAt` (String) - ISO timestamp when locked

### 5. Email Index (GSI)

Create a Global Secondary Index (GSI) on the `nestmate-users` table:
- Index name: `email-index`
- Partition key: `email` (String)

This is needed for webhook processing to find users by email.

## Usage

### For Users

1. **Select a Plan**: Go to `pricing.html` and click on a plan
2. **Complete Payment**: Stripe checkout will open
3. **Access Dashboard**: After payment, redirect to appropriate dashboard
4. **Manage Payments**: Go to `payment-management.html` to:
   - View current subscription
   - Change plan
   - Add/edit payment methods
   - Retry failed payments
   - Cancel subscription

### For Developers

#### Initialize Payment System
```javascript
const paymentSystem = new StripePaymentSystem();
await paymentSystem.getCurrentUser(); // Ensure user is authenticated
```

#### Create Checkout Session
```javascript
await paymentSystem.createCheckoutSession('basic'); // or 'advanced', 'advanced-pro', 'enterprise'
```

#### Check Dashboard Lock
```javascript
const isLocked = await paymentSystem.checkDashboardLock();
if (isLocked) {
    // Dashboard is locked, show lock screen
}
```

#### Get User Subscription
```javascript
const subscription = await paymentSystem.getUserSubscription();
console.log(subscription.subscription, subscription.status);
```

## Payment Flow

1. User selects plan → `createCheckoutSession()` called
2. Stripe Checkout opens → User enters payment details
3. Payment succeeds → Redirects to `payment-success.html`
4. `payment-success.js` function processes payment → Updates DynamoDB
5. User redirected to appropriate dashboard
6. Dashboard checks for lock → `dashboard-payment-lock.js` runs
7. If payment failed 12+ hours ago → Dashboard locked

## Webhook Flow

1. Stripe sends webhook → `stripe-webhook-aws.js` receives it
2. Event type determines action:
   - `invoice.payment_failed` → Set `paymentFailedAt` timestamp
   - `invoice.payment_succeeded` → Clear `paymentFailedAt`, set status to 'active'
   - Subscription events → Update subscription status
3. DynamoDB updated with new status

## Dashboard Locking Logic

- Payment fails → `paymentFailedAt` timestamp set
- 12 hours pass → Dashboard automatically locked (`isLocked = true`)
- User updates payment method → Retry payment
- Payment succeeds → Lock removed, dashboard unlocked

## Testing

### Test Mode
Use Stripe test mode for development:
- Test publishable key: `pk_test_...`
- Test secret key: `sk_test_...`
- Test card: `4242 4242 4242 4242`

### Test Scenarios
1. **Successful Payment**: Complete checkout with test card
2. **Payment Failure**: Use card that will fail (e.g., `4000 0000 0000 0002`)
3. **Dashboard Lock**: Wait 12 hours after failure (or manually set `paymentFailedAt` to 12+ hours ago)
4. **Retry Payment**: Update payment method and retry

## Troubleshooting

### Payment Not Processing
- Check Stripe API keys are correct
- Verify webhook endpoint is accessible
- Check Netlify function logs

### Dashboard Not Locking
- Verify `paymentFailedAt` is set in DynamoDB
- Check `dashboard-payment-lock.js` is loaded on dashboard
- Verify 12 hours have passed since failure

### User Not Found in Webhook
- Ensure email-index GSI exists
- Check customer metadata has `userId`
- Verify user email matches Stripe customer email

## Security Notes

- ✅ Stripe secret key only in Netlify environment variables (never in frontend)
- ✅ Webhook signature verification
- ✅ User authentication required for all payment operations
- ✅ AWS credentials in environment variables only

## Support

For issues or questions:
1. Check Netlify function logs
2. Check Stripe Dashboard → Events for webhook events
3. Check AWS CloudWatch for DynamoDB errors
4. Review browser console for frontend errors

