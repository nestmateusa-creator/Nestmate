# 🔧 Payment System Troubleshooting Guide

## 🚨 **"Unexpected Error" - Common Issues & Solutions**

### **Issue 1: Server Not Running**
**Symptoms:** "Network error" or "Failed to fetch"
**Solution:**
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Start the server
npm start
```
**Expected Output:** `Node server listening on port 3001!`

---

### **Issue 2: CORS Errors**
**Symptoms:** "CORS policy" errors in browser console
**Solution:** ✅ **Already Fixed** - Updated CORS configuration to allow all local origins

---

### **Issue 3: Amount Calculation Error**
**Symptoms:** "Invalid amount" or payment fails
**Solution:** ✅ **Already Fixed** - Removed double conversion (was multiplying by 100 twice)

---

### **Issue 4: Stripe Key Issues**
**Symptoms:** "Invalid API key" errors
**Solution:** ✅ **Keys are correctly configured**
- Publishable Key: `pk_test_51S4C0sAmpksixclYeG19nYyKaIrbc41a2Twtw8uNCPTEFO9BLQl6BRN6V9HxLNyCZZrMdPIy9wzk5xOGfd943BNM00Z3gp2GuY`
- Secret Key: `sk_test_51S4C0sAmpksixclY7VHwdV1oc86f76nRfWMPBA8CptvUtSmFUPzjnJswAYIbZRBMCgQcB8f6d4xCMePOmnani6FV007JlAA3SH`

---

## 🧪 **Testing Your Payment System**

### **Step 1: Use the Test Page**
1. Open `test-payment.html` in your browser
2. This page will show detailed debug information
3. Use test card: `4242 4242 4242 4242`

### **Step 2: Check Server Logs**
The server now logs all requests:
```
Payment intent request received: { amount: 500, planType: 'basic' }
Payment intent created successfully: pi_xxxxx
```

### **Step 3: Browser Console**
Open Developer Tools (F12) and check for errors in the Console tab.

---

## 🔍 **Debug Checklist**

### **✅ Server Status**
- [ ] Server is running on port 3001
- [ ] No errors in server console
- [ ] Dependencies installed (`npm install`)

### **✅ Browser Issues**
- [ ] No CORS errors in console
- [ ] Stripe Elements loading correctly
- [ ] No JavaScript errors

### **✅ Payment Flow**
- [ ] Card validation working
- [ ] Payment method creation successful
- [ ] Server receives request
- [ ] Payment intent created

---

## 🚀 **Quick Fix Commands**

### **Restart Everything:**
```bash
# Stop any running servers (Ctrl+C)
# Then run:
cd server
npm install
npm start
```

### **Test Server Connection:**
```bash
# In another terminal:
curl -X POST http://localhost:3001/create-payment-intent \
  -H "Content-Type: application/json" \
  -d '{"amount":500,"planType":"basic","currency":"usd"}'
```

---

## 📱 **Test Cards**

| Card Number | Expected Result |
|-------------|----------------|
| `4242 4242 4242 4242` | ✅ Success |
| `4000 0000 0000 0002` | ❌ Declined |
| `4000 0025 0000 3155` | 🔐 Requires Auth |

**Use any future date and any 3-digit CVV**

---

## 🆘 **Still Having Issues?**

### **Check These Files:**
1. **test-payment.html** - Use this for debugging
2. **server/payment-server.js** - Check server logs
3. **Browser Console** - Look for JavaScript errors

### **Common Error Messages:**
- **"Failed to fetch"** → Server not running
- **"Invalid amount"** → Amount calculation issue (fixed)
- **"CORS error"** → Browser blocking request (fixed)
- **"Invalid API key"** → Stripe key issue (keys are correct)

---

## 🎯 **What's Been Fixed**

1. ✅ **Amount Calculation** - Removed double conversion
2. ✅ **CORS Configuration** - Added all local origins
3. ✅ **Error Logging** - Added detailed server logs
4. ✅ **Test Page** - Created debugging tool
5. ✅ **Error Handling** - Improved error messages

---

## 🎉 **Your Payment System Should Now Work!**

**Try the test page first:** `test-payment.html`
**Then test the upgrade pages:** `upgrade-basic.html`, `upgrade-pro.html`, `upgrade-advanced.html`

If you're still getting errors, the test page will show exactly what's happening! 🔍

