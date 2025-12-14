# Quick Start - Payment System

## 🚀 What's Been Created

A complete Stripe payment system with:
- ✅ Plan selection and payment
- ✅ Subscription management
- ✅ Payment method management
- ✅ Dashboard locking after payment failure (12 hours)
- ✅ Full AWS DynamoDB integration

## ⚡ Quick Setup (5 Steps)

### Step 1: Create Stripe Products
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/products)
2. Create 4 products:
   - Basic: $5/month
   - Advanced: $10/month
   - Advanced Pro: $16/month
   - Enterprise: $50/month
3. Copy the **Price IDs** (start with `price_`)

### Step 2: Update Price IDs
Edit `stripe-payment-system.js`, line ~20-50, and replace:
```javascript
priceId: 'price_basic_monthly', // Replace with your actual Price ID
```

### Step 3: Get Stripe Keys
1. Go to Stripe Dashboard → Developers → API keys
2. Copy **Publishable key** (starts with `pk_live_`)
3. Copy your **Secret key** (starts with `sk_live_`) from the Stripe Dashboard

### Step 4: Setup Webhook
1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/.netlify/functions/stripe-webhook-aws`
3. Select events:
   - `invoice.payment_failed`
   - `invoice.payment_succeeded`
   - `customer.subscription.*` (all subscription events)
4. Copy the **Signing secret** (starts with `whsec_`)

### Step 5: Add to Netlify
Go to Netlify Dashboard → Site Settings → Environment Variables, add:

```
STRIPE_SECRET_KEY=sk_live_YOUR_SECRET_KEY_HERE
STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_PUBLISHABLE_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE
NESTMATE_AWS_REGION=us-east-2
NESTMATE_AWS_ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY
NESTMATE_AWS_SECRET_ACCESS_KEY=YOUR_AWS_SECRET_ACCESS_KEY
NESTMATE_DDB_USERS_TABLE=nestmate-users
SITE_URL=https://yourdomain.com
```

## 📁 Files to Know

- **`payment-management.html`** - Users manage payments here
- **`stripe-payment-system.js`** - Main payment logic
- **`dashboard-payment-lock.js`** - Locks dashboard after payment failure
- **`payment-success.html`** - Shows after successful payment

## 🎯 How It Works

1. User selects plan → Goes to Stripe checkout
2. Payment succeeds → User record updated in AWS
3. User redirected → To their dashboard
4. If payment fails → Dashboard locks after 12 hours
5. User updates payment → Can retry from payment management page

## 🔗 Add to Dashboards

Add this script tag to all dashboard HTML files (before `</body>`):
```html
<script src="dashboard-payment-lock.js"></script>
```

## ✅ Test It

1. Go to `payment-management.html`
2. Select a plan
3. Use test card: `4242 4242 4242 4242`
4. Complete checkout
5. Should redirect to dashboard

## 📖 Full Documentation

See `PAYMENT_SYSTEM_SETUP.md` for complete details.

