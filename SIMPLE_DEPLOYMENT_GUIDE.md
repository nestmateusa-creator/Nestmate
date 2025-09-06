# 🚀 Simple Deployment Guide - Let's Get You Live!

## What I've Done For You:
✅ Updated your Firebase config with your real project details  
✅ Created Netlify functions for payments  
✅ Set up build configuration  
✅ Prepared all files for deployment  

## What You Need to Do (5 minutes):

### Option 1: Deploy via Netlify Website (EASIEST)

1. **Go to [netlify.com](https://netlify.com)**
2. **Sign up/Login** (free account)
3. **Click "New site from Git"**
4. **Click "Deploy manually"** (drag and drop)
5. **Drag your entire project folder** to the deploy area
6. **Wait for deployment** (2-3 minutes)
7. **Your site will be live!** (you'll get a URL like `https://amazing-name-123456.netlify.app`)

### Option 2: Use the Batch File I Created

1. **Double-click `deploy-to-netlify.bat`** in your project folder
2. **Follow the prompts** (it will open a browser for login)
3. **Wait for deployment**

## After Deployment:

1. **Go to your Netlify dashboard**
2. **Click "Domain settings"**
3. **Add custom domain:** `www.nestmateusa.com`
4. **Follow DNS instructions** to point your domain

## Environment Variables to Set:

In Netlify dashboard → Site settings → Environment variables:

```
FIREBASE_API_KEY=AIzaSyC7vRXVWl64DyBHywDOcRHAwm5Oij5G7yI
FIREBASE_AUTH_DOMAIN=nestmate-167ed.firebaseapp.com
FIREBASE_PROJECT_ID=nestmate-167ed
FIREBASE_STORAGE_BUCKET=nestmate-167ed.appspot.com
FIREBASE_MESSAGING_SENDER_ID=865171535257
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

## That's It! 

Your NextMate app will be live at www.nestmateusa.com

**Which option would you like to try first?**

