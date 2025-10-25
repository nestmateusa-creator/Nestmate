# NestMate Demo Accounts - Complete Access Information

## 🚀 Quick Access
**Demo Access Page:** `demo-access.html` - Interactive page with all demo accounts and one-click login

## 📊 Demo Account Summary

### 1. Basic Plan Demo ($5/month)
- **Email:** `demo.basic@nestmate.com`
- **Password:** `DemoBasic123!`
- **Dashboard:** `dashboard-basic-clean.html`
- **Features:** Single home, 10 tasks, basic features, cloud backup

### 2. Advanced Plan Demo ($10/month) 
- **Email:** `demo.advanced@nestmate.com`
- **Password:** `DemoAdvanced123!`
- **Dashboard:** `dashboard-advanced.html`
- **Features:** Up to 5 homes, unlimited tasks, home health score, VIP support, advanced analytics

### 3. Advanced Pro Plan Demo ($16/month)
- **Email:** `demo.advancedpro@nestmate.com`
- **Password:** `DemoAdvancedPro123!`
- **Dashboard:** `dashboard-advanced-pro.html`
- **Features:** Family features, up to 5 family members, shared tasks, family analytics, emergency services

### 4. Enterprise Plan Demo ($50/month)
- **Email:** `demo.enterprise@nestmate.com`
- **Password:** `DemoEnterprise123!`
- **Dashboard:** `dashboard-enterprise.html`
- **Features:** Unlimited homes, client management, team collaboration, property valuation, tenant management

## 🔗 How to Access

### Method 1: Demo Access Page (Recommended)
1. Open `demo-access.html` in your browser
2. Click any "Login to [Plan] Demo" button
3. Credentials will be auto-filled on the login page
4. Click "Sign In" to access the dashboard

### Method 2: Direct Login
1. Go to `login-aws.html`
2. Enter any of the demo credentials above
3. Click "Sign In"
4. You'll be redirected to the appropriate dashboard

## 🎯 Dashboard Features by Plan

### Basic Dashboard (`dashboard-basic-clean.html`)
- Single home management
- 10 essential tasks & reminders
- Basic home details & organization
- Cloud backup
- Product recommendations
- Standard support

### Advanced Dashboard (`dashboard-advanced.html`)
- Up to 5 home profiles
- Unlimited tasks & reminders
- Home Health Score with detailed analytics
- VIP priority support
- Advanced analytics & insights
- Professional floor plan designer
- Photo management & organization
- Advanced data export

### Advanced Pro Dashboard (`dashboard-advanced-pro.html`)
- All Advanced features
- Up to 5 family members
- Shared tasks & reminders
- Family dashboard for collaboration
- Family analytics & insights
- Emergency contact management for families
- Hand-picked contractor services
- Family-first support

### Enterprise Dashboard (`dashboard-enterprise.html`)
- Unlimited home profiles
- Client management system with property portfolios
- Team collaboration tools for real estate teams
- Property valuation tracking & market analytics
- Maintenance scheduling across multiple properties
- Tenant management features for landlords
- Professional floor plan designer with advanced tools
- White-label reporting for client presentations
- Priority enterprise support with dedicated account manager

## 🛠️ Technical Details

### Authentication System
- Uses AWS Cognito for user authentication
- DynamoDB for user data storage
- Automatic subscription-based dashboard routing
- Session management with token refresh

### File Structure
```
├── demo-access.html          # Interactive demo access page
├── login-aws.html           # Main login page with auto-fill
├── dashboard-basic-clean.html    # Basic plan dashboard
├── dashboard-advanced.html        # Advanced plan dashboard
├── dashboard-advanced-pro.html   # Advanced Pro plan dashboard
├── dashboard-enterprise.html    # Enterprise plan dashboard
├── auth-aws.js              # Authentication system
└── create-demo-accounts.js   # Demo account creation script
```

### Database Records
Each demo account has a corresponding DynamoDB record in the `nestmate-users` table with:
- Active subscription status
- Appropriate subscription tier
- User preferences
- Home management data

## 🔄 Switching Between Accounts

1. **Sign out** from current dashboard
2. Go to `demo-access.html` or `login-aws.html`
3. Use different demo credentials
4. You'll be redirected to the appropriate dashboard

## 📝 Notes for Development

- All demo accounts have **active subscriptions**
- Each account showcases **plan-specific features**
- **No payment required** for demo access
- Accounts are **pre-configured** with sample data
- **Full functionality** available for testing

## 🚨 Important Security Notes

- Demo accounts are for **testing purposes only**
- **Do not use** demo credentials for production
- Accounts may be **reset periodically**
- **No sensitive data** should be stored in demo accounts

---

**Created:** January 2025  
**Last Updated:** January 2025  
**Status:** Ready for testing and development
