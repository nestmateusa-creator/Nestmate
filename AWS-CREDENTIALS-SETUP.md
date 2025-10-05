# 🔐 AWS Credentials Setup Guide

## For Production Deployment

### **Environment Variables Required:**

Set these environment variables in your hosting platform:

```bash
AWS_ACCESS_KEY_ID=AKIAXBLPTGPR44FNAHUL
AWS_SECRET_ACCESS_KEY=wolmLksFIm5go0kLZVelnfLnw7NGIxyZD9EvIu5O
AWS_REGION=us-east-2
```

### **Platform-Specific Setup:**

#### **Netlify:**
1. Go to Site Settings > Environment Variables
2. Add the variables above

#### **Vercel:**
1. Go to Project Settings > Environment Variables
2. Add the variables above

#### **AWS S3/CloudFront:**
1. Use IAM roles instead of access keys (more secure)
2. Or set environment variables in your deployment process

#### **GitHub Pages:**
1. Go to Repository Settings > Secrets and Variables > Actions
2. Add the variables as repository secrets

### **Security Notes:**
- ✅ Never commit credentials to Git
- ✅ Use environment variables in production
- ✅ Consider using IAM roles for AWS deployments
- ✅ Rotate access keys regularly

### **Your AWS Resources:**
- **User Pool**: `us-east-2_2aUT3c65F`
- **Client ID**: `3a603s7kgoc0e47cjjtj1nugfe`
- **S3 Bucket**: `nestmate-files-483954734051`
- **Region**: `us-east-2`
