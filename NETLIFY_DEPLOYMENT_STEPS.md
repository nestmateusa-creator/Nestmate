# 🚀 Netlify Deployment Steps for www.nestmateusa.com

## Step 1: Get Your Firebase Project Details (5 minutes)

1. **Go to [Firebase Console](https://console.firebase.google.com)**
2. **Select your project** (or create a new one if needed)
3. **Go to Project Settings** (gear icon) → General tab
4. **Copy these values:**
   - API Key
   - Auth Domain
   - Project ID
   - Storage Bucket
   - Messaging Sender ID
   - App ID
   - Measurement ID (if using Analytics)

## Step 2: Update Firebase Configuration (2 minutes)

1. **Open `scripts/firebaseconfig-production.js`**
2. **Replace the placeholder values** with your actual Firebase project details:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_ACTUAL_FIREBASE_API_KEY",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-actual-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "YOUR_ACTUAL_SENDER_ID",
    appId: "YOUR_ACTUAL_APP_ID",
    measurementId: "G-YOUR_ACTUAL_MEASUREMENT_ID"
};
```

3. **Save this file as `scripts/firebaseconfig.js`** (overwrite the demo version)

## Step 3: Deploy to Netlify (10 minutes)

### Option A: Deploy from Git (Recommended)

1. **Go to [netlify.com](https://netlify.com) and sign up/login**
2. **Click "New site from Git"**
3. **Connect your repository** (GitHub/GitLab/Bitbucket)
4. **Configure build settings:**
   - Build command: `npm run build`
   - Publish directory: `.` (root directory)
   - Functions directory: `netlify/functions`
5. **Click "Deploy site"**

### Option B: Deploy via Netlify CLI

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify:**
   ```bash
   netlify login
   ```

3. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

## Step 4: Set Environment Variables (5 minutes)

In your Netlify dashboard:

1. **Go to Site settings** → Environment variables
2. **Add these variables:**

```
FIREBASE_API_KEY=your_actual_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_actual_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_actual_sender_id
FIREBASE_APP_ID=your_actual_app_id
FIREBASE_MEASUREMENT_ID=G-your_actual_measurement_id
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

## Step 5: Configure Custom Domain (5 minutes)

1. **In Netlify dashboard** → Domain settings
2. **Add custom domain:** `www.nestmateusa.com`
3. **Follow DNS instructions** to point your domain to Netlify
4. **Enable SSL** (automatic with Netlify)

## Step 6: Update Firebase Auth (3 minutes)

1. **Go to Firebase Console** → Authentication → Settings
2. **Add authorized domains:**
   - `www.nestmateusa.com`
   - `your-site-name.netlify.app` (for testing)

## Step 7: Test Your Deployment (5 minutes)

Test these features:
- [ ] Homepage loads: `https://www.nestmateusa.com`
- [ ] User can sign up/sign in with Google
- [ ] Dashboard loads and functions properly
- [ ] Payment processing works
- [ ] Mobile responsive design
- [ ] All navigation links work

## 🎉 You're Live!

Your NextMate app should now be accessible at **www.nestmateusa.com**

## 🔧 Troubleshooting

### Common Issues:

**CORS Errors:**
- Check Firebase authorized domains
- Verify environment variables are set

**Payment Issues:**
- Ensure Stripe keys are production keys (not test keys)
- Check Stripe webhook endpoints

**Authentication Issues:**
- Verify Firebase config is correct
- Check authorized domains in Firebase Console

**File Not Found:**
- Check that all files are in the root directory
- Verify netlify.toml redirects are working

### Need Help?

1. **Check Netlify build logs** in the dashboard
2. **Check browser console** for JavaScript errors
3. **Verify environment variables** are set correctly
4. **Test API endpoints** independently

## 📞 Next Steps After Deployment

1. **Set up monitoring** (uptime, errors, performance)
2. **Configure backups** (database, files)
3. **Set up analytics** (Google Analytics, Firebase Analytics)
4. **Plan for scaling** as your user base grows
5. **Regular security updates** and maintenance

---

**Total Deployment Time: ~30 minutes**


