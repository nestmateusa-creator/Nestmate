# Complete Signup Flow Guide

## Overview
The signup flow has been updated to guide users through: **Sign Up → Plan Selection → Payment → Dashboard**

## Flow Steps

### 1. Homepage → Sign Up
- User clicks "Get Started" button on homepage (`index.html`)
- Redirects to `register-aws.html`

### 2. Registration (`register-aws.html`)
- User enters:
  - Full Name
  - Email Address
  - Phone Number (optional)
  - Password
  - Confirm Password
- After successful signup:
  - Account created in AWS Cognito
  - User record created in DynamoDB
  - User automatically signed in
  - Redirects to `select-plan.html`

### 3. Plan Selection (`select-plan.html`)
- User sees 4 plan options:
  - Basic ($5/month)
  - Advanced ($10/month) - Most Popular
  - Advanced Pro ($16/month)
  - Enterprise ($50/month)
- User can:
  - Select a plan → Goes to Stripe checkout
  - Skip for now → Goes to basic dashboard with free features

### 4. Payment (Stripe Checkout)
- Stripe checkout session opens
- User enters payment details
- Payment processed by Stripe
- On success → Redirects to `payment-success.html`

### 5. Payment Success (`payment-success.html`)
- Payment processed
- User record updated in DynamoDB:
  - `subscription` set to selected plan
  - `subscriptionStatus` set to 'active'
  - `stripeCustomerId` saved
  - `stripeSubscriptionId` saved
- Redirects to appropriate dashboard based on plan

### 6. Dashboard
- User lands on their plan's dashboard:
  - Basic → `dashboard-basic-clean.html`
  - Advanced → `dashboard-advanced.html`
  - Advanced Pro → `dashboard-advanced-pro.html`
  - Enterprise → `dashboard-enterprise.html`
- Dashboard lock check runs automatically
- If payment failed 12+ hours ago → Dashboard locked

## Account Settings Integration

### Profile Page (`profile.html`)
Payment management is now integrated into the user's account settings:

1. **View Current Subscription**
   - Current plan name
   - Subscription status (Active/Inactive/Locked)
   - Last payment date
   - Payment failure date (if applicable)

2. **Change Plan**
   - Select from available plans
   - Upgrade or downgrade subscription
   - Prorated billing handled by Stripe

3. **Payment Methods**
   - View all saved payment methods
   - Add new payment method
   - Set default payment method
   - Delete payment methods

4. **Subscription Actions**
   - Open Stripe Customer Portal (full billing management)
   - Cancel subscription
   - Retry failed payment

## Files Updated

1. **`register-aws.html`**
   - Updated to redirect to `select-plan.html` after signup
   - Auto-signs in user after registration

2. **`select-plan.html`** (NEW)
   - Plan selection page
   - Integrates with Stripe payment system
   - Allows skipping plan selection

3. **`profile.html`**
   - Added payment management section
   - Integrated with Stripe payment system
   - Shows subscription info and payment methods

4. **`profile-payment-integration.js`** (NEW)
   - JavaScript for payment management in profile
   - Handles all payment operations
   - Works with AWS auth system

## User Recognition

The system recognizes users through:
- **AWS Cognito** - Authentication
- **DynamoDB** - User records with:
  - `userId` (Cognito user ID)
  - `email`
  - `subscription` (plan type)
  - `subscriptionStatus` (active/inactive/cancelled)
  - `stripeCustomerId`
  - `stripeSubscriptionId`
  - `paymentMethodId`
  - `paymentFailedAt`
  - `isLocked`

## Testing the Flow

1. **Test Signup**:
   - Go to homepage
   - Click "Get Started"
   - Fill out registration form
   - Should redirect to plan selection

2. **Test Plan Selection**:
   - Select a plan
   - Should open Stripe checkout
   - Use test card: `4242 4242 4242 4242`

3. **Test Payment Success**:
   - Complete checkout
   - Should redirect to payment success page
   - Then redirect to appropriate dashboard

4. **Test Account Settings**:
   - Go to profile page
   - Should see payment management section
   - Can manage subscription and payment methods

## Important Notes

- Users must be authenticated to access payment features
- Payment management in profile requires AWS auth (not Firebase)
- All payment data is stored securely in AWS DynamoDB
- Stripe handles all payment processing
- Dashboard locking happens automatically after 12 hours of payment failure

## Next Steps

1. Ensure Stripe products and prices are created
2. Update price IDs in `stripe-payment-system.js`
3. Add Stripe keys to Netlify environment variables
4. Test the complete flow end-to-end
5. Deploy to production

