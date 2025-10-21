# Netlify Environment Variables Setup Guide

## Quick Setup Instructions

1. **Go to your Netlify dashboard**
2. **Navigate to**: Site settings → Environment variables
3. **Add each variable** from the list below:

## Required Environment Variables

### AWS Configuration
- **Variable**: `NESTMATE_AWS_ACCESS_KEY_ID`
- **Value**: `AKIAXBLPTGPR44FNAHUL`

- **Variable**: `NESTMATE_AWS_SECRET_ACCESS_KEY`
- **Value**: `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`

- **Variable**: `NESTMATE_AWS_REGION`
- **Value**: `us-east-2`

### DynamoDB Configuration
- **Variable**: `NESTMATE_DDB_USERS_TABLE`
- **Value**: `nestmate-users`

### AWS Cognito Configuration
- **Variable**: `NESTMATE_COGNITO_USER_POOL_ID`
- **Value**: `us-east-2_XXXXXXXXX` (replace with your actual User Pool ID)

- **Variable**: `NESTMATE_COGNITO_CLIENT_ID`
- **Value**: `XXXXXXXXXXXXXXXXXXXXXXXXXX` (replace with your actual Client ID)

### Stripe Configuration
- **Variable**: `STRIPE_SECRET_KEY`
- **Value**: `sk_test_XXXXXXXXXXXXXXXXXXXXXXXXXX` (replace with your actual Stripe secret key)

### Node.js Configuration
- **Variable**: `NODE_VERSION`
- **Value**: `18.20.8`

### Netlify Configuration
- **Variable**: `SECRETS_SCAN_SMART_DETECTION_ENABLED`
- **Value**: `false`

## How to Add Variables in Netlify

1. Go to your Netlify site dashboard
2. Click on **Site settings**
3. Click on **Environment variables** in the left sidebar
4. Click **Add a variable**
5. Enter the variable name and value
6. Click **Save**
7. Repeat for each variable

## After Adding Variables

1. **Redeploy your site** (go to Deploys tab and click "Trigger deploy")
2. The deployment should now succeed without secrets scanning errors

## Security Notes

- These environment variables are now secure and not exposed in your code
- Netlify will inject these values at build time
- Your AWS credentials are protected and not visible in the repository
