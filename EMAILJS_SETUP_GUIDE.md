# EmailJS Setup Guide for NestMate Contact Form

## Overview
This guide will help you set up EmailJS to enable actual email sending from your contact form to `support@nestmateusa.com`.

## Step 1: Create EmailJS Account

1. **Go to [EmailJS.com](https://www.emailjs.com/)**
2. **Sign up for a free account** (allows 200 emails/month)
3. **Verify your email address**

## Step 2: Add Email Service

1. **Go to Email Services** in your EmailJS dashboard
2. **Click "Add New Service"**
3. **Choose your email provider:**
   - **Gmail** (recommended for personal use)
   - **Outlook** (if you use Outlook/Hotmail)
   - **Yahoo** (if you use Yahoo Mail)
   - **Custom SMTP** (for other providers)

### For Gmail Setup:
1. **Select "Gmail"**
2. **Connect your Gmail account** (the one you want to send emails from)
3. **Copy the Service ID** (you'll need this later)

## Step 3: Create Email Template

1. **Go to Email Templates** in your EmailJS dashboard
2. **Click "Create New Template"**
3. **Use this template content:**

```
Subject: New Contact Form Submission - {{subject}}

From: {{from_name}} ({{from_email}})
Subject: {{subject}}

Message:
{{message}}

---
This message was sent from the NestMate contact form.
Reply directly to: {{from_email}}
```

4. **Save the template**
5. **Copy the Template ID** (you'll need this later)

## Step 4: Get Your Public Key

1. **Go to Account** in your EmailJS dashboard
2. **Find "Public Key"** in the API Keys section
3. **Copy the Public Key**

## Step 5: Update Your Contact Form

1. **Open `contact.html`**
2. **Replace these placeholders:**

```javascript
// Replace 'YOUR_PUBLIC_KEY' with your actual public key
emailjs.init('YOUR_PUBLIC_KEY');

// Replace 'YOUR_SERVICE_ID' with your service ID
// Replace 'YOUR_TEMPLATE_ID' with your template ID
const response = await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams);
```

### Example with real values:
```javascript
emailjs.init('user_abc123def456');

const response = await emailjs.send('service_gmail', 'template_contact', templateParams);
```

## Step 6: Test Your Setup

1. **Save your changes**
2. **Deploy to your website**
3. **Test the contact form**
4. **Check your email** (support@nestmateusa.com) for the message

## Troubleshooting

### Common Issues:

1. **"EmailJS is not defined" error:**
   - Make sure the EmailJS script is loaded before your JavaScript
   - Check that the script URL is correct

2. **"Service not found" error:**
   - Verify your Service ID is correct
   - Make sure the service is active in your EmailJS dashboard

3. **"Template not found" error:**
   - Verify your Template ID is correct
   - Make sure the template is published (not in draft mode)

4. **Emails not being received:**
   - Check your spam folder
   - Verify the recipient email address is correct
   - Check EmailJS dashboard for delivery logs

### EmailJS Dashboard:
- **Monitor email delivery** in the "Activity" section
- **Check usage limits** in the "Usage" section
- **View error logs** if emails fail to send

## Security Notes

1. **Public Key is safe to expose** in frontend code
2. **Never expose Service ID or Template ID** in public repositories
3. **Consider using environment variables** for production

## Alternative: Netlify Forms

If you prefer not to use EmailJS, you can also use Netlify Forms:

1. **Add `netlify` attribute to your form:**
```html
<form id="contactForm" netlify>
```

2. **Add hidden input for Netlify:**
```html
<input type="hidden" name="form-name" value="contact">
```

3. **Netlify will automatically handle form submissions** and send emails to your configured address.

## Support

If you need help with EmailJS setup:
- **EmailJS Documentation:** https://www.emailjs.com/docs/
- **EmailJS Support:** https://www.emailjs.com/support/
- **Contact NestMate Support:** support@nestmateusa.com

---

**Once configured, your contact form will actually send emails to support@nestmateusa.com!** 🚀
