# 🚀 Node.js Installation Guide for Windows

## 🎯 **Quick Solution: Test Payments Without Server**

**For immediate testing, use:** `simple-payment-test.html`
- ✅ Tests Stripe integration
- ✅ Creates payment methods
- ✅ No server required
- ✅ Works right now!

---

## 📥 **Install Node.js (For Full Payment Processing)**

### **Step 1: Download Node.js**
1. Go to [nodejs.org](https://nodejs.org/)
2. Download the **LTS version** (recommended)
3. Choose **Windows Installer (.msi)**

### **Step 2: Install Node.js**
1. Run the downloaded `.msi` file
2. Follow the installation wizard
3. ✅ **Check "Add to PATH"** (should be checked by default)
4. Click "Install"

### **Step 3: Verify Installation**
Open a **new** PowerShell window and run:
```powershell
node --version
npm --version
```
You should see version numbers (e.g., v18.17.0)

### **Step 4: Start Your Payment Server**
```powershell
cd server
npm install
npm start
```

---

## 🧪 **Test Your Payment System**

### **Option 1: Simple Test (No Server)**
1. Open `simple-payment-test.html`
2. Use test card: `4242 4242 4242 4242`
3. This tests Stripe integration without charging

### **Option 2: Full Test (With Server)**
1. Install Node.js (steps above)
2. Start server: `cd server && npm start`
3. Open `test-payment.html`
4. This tests complete payment processing

---

## 🔧 **Troubleshooting**

### **"npm is not recognized"**
- **Solution:** Install Node.js (includes npm)
- **Alternative:** Use `simple-payment-test.html` for now

### **"node is not recognized"**
- **Solution:** Restart PowerShell after installing Node.js
- **Check:** Make sure Node.js was added to PATH

### **Server won't start**
- **Solution:** Run `npm install` first to install dependencies
- **Check:** Make sure you're in the `server` directory

---

## 🎉 **What Works Right Now**

Even without Node.js installed, your payment system is **partially functional**:

✅ **Stripe Integration** - Your keys are working  
✅ **Card Validation** - Real-time error checking  
✅ **Payment Method Creation** - Secure card tokenization  
✅ **UI/UX** - Professional payment forms  

❌ **Actual Charging** - Requires server (needs Node.js)

---

## 🚀 **Next Steps**

1. **Test now:** Use `simple-payment-test.html`
2. **Install Node.js:** Follow the guide above
3. **Full testing:** Use `test-payment.html` with server
4. **Production:** Deploy to a hosting service

Your payment system is working - you just need Node.js for the full server functionality! 🎯


