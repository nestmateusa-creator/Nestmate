# AWS Setup Guide for NestMate Migration

## Prerequisites
- AWS Account created ✅
- AWS CLI installed (see instructions below)

## Step 1: Install AWS CLI

### Windows (PowerShell as Administrator):
```powershell
# Download and install AWS CLI
winget install Amazon.AWSCLI
```

### Alternative Windows Installation:
1. Download AWS CLI MSI installer from: https://aws.amazon.com/cli/
2. Run the installer
3. Restart your terminal

### Verify Installation:
```bash
aws --version
```

## Step 2: Configure AWS CLI
```bash
aws configure
```
You'll need:
- AWS Access Key ID
- AWS Secret Access Key
- Default region (us-east-1 recommended)
- Default output format (json)

## Step 3: Get Your AWS Credentials
1. Go to AWS Console → IAM → Users
2. Create a new user or use existing
3. Attach policies: AdministratorAccess (for setup)
4. Create Access Key
5. Download credentials securely

## Step 4: Run Setup Scripts
```bash
# Make scripts executable
chmod +x aws-setup.sh

# Run the setup
./aws-setup.sh
```

## Step 5: Verify Setup
```bash
# Test DynamoDB access
aws dynamodb list-tables

# Test Cognito access
aws cognito-idp list-user-pools --max-items 10
```

## Next Steps
1. Run the setup scripts
2. Verify all services are created
3. Test the infrastructure
4. Begin data migration
