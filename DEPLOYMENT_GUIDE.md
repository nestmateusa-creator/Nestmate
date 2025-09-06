# NextMate App Deployment Guide for www.nestmateusa.com

## Overview
This guide covers multiple deployment options for your NextMate app to www.nestmateusa.com.

## Prerequisites
- Domain: www.nestmateusa.com
- Firebase project configured
- Stripe account for payments
- Git repository (recommended)

## Option 1: Netlify Deployment (Recommended)

### Step 1: Prepare Your Project
1. **Update Firebase Configuration**
   - Replace demo config in `scripts/firebaseconfig.js` with your production Firebase config
   - Add your domain to Firebase Auth authorized domains

2. **Create Build Script**
   Add to your `package.json`:
   ```json
   {
     "scripts": {
       "build": "echo 'Build complete'",
       "deploy": "netlify deploy --prod"
     }
   }
   ```

3. **Update netlify.toml**
   ```toml
   [build]
     functions = "netlify/functions"
     publish = "."
   
   [build.environment]
     NODE_VERSION = "18"
   
   [[redirects]]
     from = "/api/*"
     to = "/.netlify/functions/:splat"
     status = 200
   ```

### Step 2: Deploy to Netlify
1. **Connect Repository:**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub/GitLab repository

2. **Configure Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `.` (root)
   - Functions directory: `netlify/functions`

3. **Set Environment Variables:**
   In Netlify dashboard → Site settings → Environment variables:
   ```
   FIREBASE_API_KEY=your_firebase_api_key
   FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   FIREBASE_PROJECT_ID=your_project_id
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

4. **Custom Domain Setup:**
   - Go to Domain settings
   - Add www.nestmateusa.com
   - Configure DNS as instructed by Netlify

### Step 3: Move Server Functions to Netlify Functions
Create `netlify/functions/payment.js`:
```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { amount, currency = 'usd' } = JSON.parse(event.body);
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
```

## Option 2: Traditional Web Hosting

### Step 1: Prepare Files
1. **Create Production Build:**
   - Minify CSS/JS files
   - Update all file paths to be relative
   - Remove development files

2. **Update Configuration:**
   - Replace Firebase demo config with production config
   - Update API endpoints to use your domain

### Step 2: Upload Files
1. **Via FTP/cPanel:**
   - Upload all files to public_html directory
   - Ensure proper file permissions (644 for files, 755 for directories)

2. **Backend Setup:**
   - If your host supports Node.js, upload server files
   - Set up environment variables
   - Install dependencies: `npm install`

### Step 3: Domain Configuration
1. **DNS Settings:**
   - Point www.nestmateusa.com to your hosting provider
   - Set up SSL certificate (Let's Encrypt recommended)

2. **Server Configuration:**
   - Configure web server to serve index.html for SPA routing
   - Set up API routes for backend functionality

## Option 3: Firebase Hosting

### Step 1: Install Firebase CLI
```bash
npm install -g firebase-tools
firebase login
```

### Step 2: Configure Firebase
Update `firebase.json`:
```json
{
  "hosting": {
    "public": ".",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**",
      "server/**",
      "test/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  },
  "functions": {
    "source": "functions"
  }
}
```

### Step 3: Deploy
```bash
firebase deploy --only hosting
```

## Option 4: Vercel Deployment

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Configure vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

### Step 3: Deploy
```bash
vercel --prod
```

## Post-Deployment Checklist

### Security
- [ ] Update Firebase Auth authorized domains
- [ ] Set up proper CORS policies
- [ ] Secure API endpoints
- [ ] Enable HTTPS/SSL
- [ ] Set up proper environment variables

### Performance
- [ ] Enable CDN/caching
- [ ] Minify CSS/JS files
- [ ] Optimize images
- [ ] Set up proper caching headers

### Monitoring
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure analytics
- [ ] Set up uptime monitoring
- [ ] Test all functionality

### Testing
- [ ] Test user authentication
- [ ] Test payment processing
- [ ] Test all dashboard features
- [ ] Test on mobile devices
- [ ] Test with different browsers

## Troubleshooting

### Common Issues:
1. **CORS Errors:** Ensure your API allows requests from your domain
2. **Firebase Auth Issues:** Check authorized domains in Firebase console
3. **Payment Issues:** Verify Stripe keys and webhook endpoints
4. **File Not Found:** Check file paths and server configuration

### Support:
- Check browser console for errors
- Verify environment variables are set correctly
- Test API endpoints independently
- Check server logs for backend issues

## Recommended Next Steps:
1. Choose your preferred deployment option
2. Set up a staging environment first
3. Test thoroughly before going live
4. Set up monitoring and backups
5. Plan for scaling as your user base grows
