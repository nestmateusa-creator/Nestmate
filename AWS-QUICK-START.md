# 🚀 NestMate AWS Migration - Quick Start Guide

## 🎯 What We're Building

A rock-solid AWS infrastructure to replace Firebase with:
- **Amazon DynamoDB** - NoSQL database (replaces Firestore)
- **Amazon Cognito** - User authentication (replaces Firebase Auth)
- **Amazon S3** - File storage (replaces Firebase Storage)
- **AWS Lambda** - Serverless functions (replaces Netlify Functions)

## 📋 Prerequisites

✅ AWS Account created  
✅ AWS CLI installed  
✅ Node.js installed  

## 🚀 Step-by-Step Setup

### 1. Install AWS CLI
```bash
# Windows (PowerShell as Administrator)
winget install Amazon.AWSCLI

# Verify installation
aws --version
```

### 2. Configure AWS Credentials
```bash
aws configure
```
You'll need:
- AWS Access Key ID
- AWS Secret Access Key  
- Default region: `us-east-1`
- Default output format: `json`

**Get your credentials:**
1. Go to AWS Console → IAM → Users
2. Create new user or use existing
3. Attach policy: `AdministratorAccess`
4. Create Access Key
5. Download credentials securely

### 3. Install Dependencies
```bash
# Copy package-aws.json to package.json
cp package-aws.json package.json

# Install AWS SDK
npm install
```

### 4. Run AWS Setup Script
```bash
# Make script executable
chmod +x aws-setup.sh

# Run the setup (creates all AWS resources)
./aws-setup.sh
```

This will create:
- ✅ 6 DynamoDB tables
- ✅ 2 S3 buckets  
- ✅ 1 Cognito User Pool
- ✅ 1 IAM role for Lambda
- ✅ Configuration file: `aws-config.json`

### 5. Test Your Setup
```bash
# Run comprehensive tests
npm test
```

This will test:
- ✅ DynamoDB operations
- ✅ S3 file operations
- ✅ Cognito authentication
- ✅ Data integrity

### 6. Migrate from Firebase (Optional)
```bash
# Follow migration instructions
npm run migrate
```

## 📊 What Gets Created

### DynamoDB Tables:
- `nestmate-users` - User profiles and authentication
- `nestmate-homes` - Home data and details
- `nestmate-tasks` - User tasks and reminders
- `nestmate-service-records` - Maintenance history
- `nestmate-photos` - Photo metadata
- `nestmate-subscriptions` - Stripe integration data

### S3 Buckets:
- `nestmate-user-data-*` - User photos and files
- `nestmate-static-assets-*` - Website assets

### Cognito:
- User Pool for authentication
- User Pool Client for app integration

## 🔧 Using AWS Services in Your Code

### Replace Firebase with AWS:

```javascript
// OLD: Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// NEW: AWS
const { db, auth, storage } = require('./aws-services');

// Create user
const result = await db.createUser({
    userId: 'user123',
    email: 'user@example.com',
    name: 'John Doe',
    plan: 'basic'
});

// Authenticate user
const authResult = await auth.signIn('user@example.com', 'password');

// Upload file
const uploadResult = await storage.uploadUserPhoto('user123', 'photo1', fileBuffer, 'image/jpeg');
```

## 💰 Cost Estimation

### AWS Costs (Monthly):
- **DynamoDB**: ~$5-20 (pay per request)
- **Cognito**: Free for first 50,000 users
- **S3**: ~$1-5 (very cheap storage)
- **Lambda**: ~$1-10 (pay per execution)

**Total estimated cost: $10-40/month** (vs Firebase's unpredictable costs)

## 🛡️ Reliability Benefits

| Feature | Firebase | AWS |
|---------|----------|-----|
| **Uptime SLA** | No SLA | 99.99% |
| **Data Consistency** | Eventual | Strong |
| **Backup/Recovery** | Limited | 35-day PITR |
| **Multi-Region** | Limited | Global Tables |
| **Performance** | Variable | Predictable |

## 🔍 Monitoring & Management

### AWS Console Links:
- **DynamoDB**: https://console.aws.amazon.com/dynamodb/
- **Cognito**: https://console.aws.amazon.com/cognito/
- **S3**: https://console.aws.amazon.com/s3/
- **CloudWatch**: https://console.aws.amazon.com/cloudwatch/

### Key Metrics to Monitor:
- DynamoDB read/write capacity
- S3 storage usage
- Cognito user registrations
- Lambda execution times

## 🚨 Troubleshooting

### Common Issues:

**1. AWS CLI not found**
```bash
# Reinstall AWS CLI
winget install Amazon.AWSCLI
```

**2. Access denied errors**
```bash
# Check your AWS credentials
aws sts get-caller-identity
```

**3. DynamoDB table not found**
```bash
# List all tables
aws dynamodb list-tables
```

**4. S3 bucket access denied**
```bash
# Check bucket permissions
aws s3 ls s3://your-bucket-name
```

## 🎉 Next Steps

1. **Test the infrastructure** with `npm test`
2. **Update your NestMate code** to use AWS services
3. **Migrate your Firebase data** (optional)
4. **Deploy to production** with confidence
5. **Monitor performance** in AWS Console

## 📞 Support

If you run into issues:
1. Check the AWS Console for error details
2. Review the test output for specific failures
3. Verify your AWS credentials and permissions
4. Check the AWS documentation for your specific service

**Your AWS infrastructure is now ready to handle NestMate with enterprise-grade reliability!** 🚀
