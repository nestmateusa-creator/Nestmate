#!/bin/bash

# AWS Infrastructure Setup for NestMate
# This script creates all necessary AWS resources for NestMate

set -e  # Exit on any error

echo "🚀 Starting AWS Infrastructure Setup for NestMate..."

# Configuration
REGION="us-east-1"
PROJECT_NAME="nestmate"
ENVIRONMENT="production"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    print_error "AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check AWS credentials
if ! aws sts get-caller-identity &> /dev/null; then
    print_error "AWS credentials not configured. Run 'aws configure' first."
    exit 1
fi

print_success "AWS CLI is configured and ready!"

# Create DynamoDB Tables
print_status "Creating DynamoDB tables..."

# Users table
aws dynamodb create-table \
    --table-name "${PROJECT_NAME}-users" \
    --attribute-definitions \
        AttributeName=userId,AttributeType=S \
    --key-schema \
        AttributeName=userId,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --region $REGION

print_success "Created users table"

# Homes table
aws dynamodb create-table \
    --table-name "${PROJECT_NAME}-homes" \
    --attribute-definitions \
        AttributeName=homeId,AttributeType=S \
        AttributeName=userId,AttributeType=S \
    --key-schema \
        AttributeName=homeId,KeyType=HASH \
    --global-secondary-indexes \
        IndexName=UserIdIndex,KeySchema='[{AttributeName=userId,KeyType=HASH}]',Projection='{ProjectionType=ALL}' \
    --billing-mode PAY_PER_REQUEST \
    --region $REGION

print_success "Created homes table"

# Tasks table
aws dynamodb create-table \
    --table-name "${PROJECT_NAME}-tasks" \
    --attribute-definitions \
        AttributeName=taskId,AttributeType=S \
        AttributeName=userId,AttributeType=S \
    --key-schema \
        AttributeName=taskId,KeyType=HASH \
    --global-secondary-indexes \
        IndexName=UserIdIndex,KeySchema='[{AttributeName=userId,KeyType=HASH}]',Projection='{ProjectionType=ALL}' \
    --billing-mode PAY_PER_REQUEST \
    --region $REGION

print_success "Created tasks table"

# Service Records table
aws dynamodb create-table \
    --table-name "${PROJECT_NAME}-service-records" \
    --attribute-definitions \
        AttributeName=recordId,AttributeType=S \
        AttributeName=userId,AttributeType=S \
    --key-schema \
        AttributeName=recordId,KeyType=HASH \
    --global-secondary-indexes \
        IndexName=UserIdIndex,KeySchema='[{AttributeName=userId,KeyType=HASH}]',Projection='{ProjectionType=ALL}' \
    --billing-mode PAY_PER_REQUEST \
    --region $REGION

print_success "Created service records table"

# Photos table
aws dynamodb create-table \
    --table-name "${PROJECT_NAME}-photos" \
    --attribute-definitions \
        AttributeName=photoId,AttributeType=S \
        AttributeName=userId,AttributeType=S \
    --key-schema \
        AttributeName=photoId,KeyType=HASH \
    --global-secondary-indexes \
        IndexName=UserIdIndex,KeySchema='[{AttributeName=userId,KeyType=HASH}]',Projection='{ProjectionType=ALL}' \
    --billing-mode PAY_PER_REQUEST \
    --region $REGION

print_success "Created photos table"

# Subscriptions table
aws dynamodb create-table \
    --table-name "${PROJECT_NAME}-subscriptions" \
    --attribute-definitions \
        AttributeName=subscriptionId,AttributeType=S \
        AttributeName=userId,AttributeType=S \
    --key-schema \
        AttributeName=subscriptionId,KeyType=HASH \
    --global-secondary-indexes \
        IndexName=UserIdIndex,KeySchema='[{AttributeName=userId,KeyType=HASH}]',Projection='{ProjectionType=ALL}' \
    --billing-mode PAY_PER_REQUEST \
    --region $REGION

print_success "Created subscriptions table"

# Create S3 Buckets
print_status "Creating S3 buckets..."

# Main bucket for user data
aws s3 mb "s3://${PROJECT_NAME}-user-data-$(date +%s)" --region $REGION
print_success "Created user data S3 bucket"

# Static assets bucket
aws s3 mb "s3://${PROJECT_NAME}-static-assets-$(date +%s)" --region $REGION
print_success "Created static assets S3 bucket"

# Create Cognito User Pool
print_status "Creating Cognito User Pool..."

USER_POOL_ID=$(aws cognito-idp create-user-pool \
    --pool-name "${PROJECT_NAME}-user-pool" \
    --policies '{
        "PasswordPolicy": {
            "MinimumLength": 8,
            "RequireUppercase": true,
            "RequireLowercase": true,
            "RequireNumbers": true,
            "RequireSymbols": false
        }
    }' \
    --auto-verified-attributes email \
    --username-attributes email \
    --region $REGION \
    --query 'UserPool.Id' \
    --output text)

print_success "Created Cognito User Pool: $USER_POOL_ID"

# Create Cognito User Pool Client
CLIENT_ID=$(aws cognito-idp create-user-pool-client \
    --user-pool-id $USER_POOL_ID \
    --client-name "${PROJECT_NAME}-client" \
    --explicit-auth-flows USER_PASSWORD_AUTH ALLOW_USER_SRP_AUTH \
    --generate-secret \
    --region $REGION \
    --query 'UserPoolClient.ClientId' \
    --output text)

print_success "Created Cognito User Pool Client: $CLIENT_ID"

# Create IAM Role for Lambda
print_status "Creating IAM role for Lambda functions..."

aws iam create-role \
    --role-name "${PROJECT_NAME}-lambda-role" \
    --assume-role-policy-document '{
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Principal": {
                    "Service": "lambda.amazonaws.com"
                },
                "Action": "sts:AssumeRole"
            }
        ]
    }' \
    --region $REGION

# Attach policies to Lambda role
aws iam attach-role-policy \
    --role-name "${PROJECT_NAME}-lambda-role" \
    --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

aws iam attach-role-policy \
    --role-name "${PROJECT_NAME}-lambda-role" \
    --policy-arn arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess

aws iam attach-role-policy \
    --role-name "${PROJECT_NAME}-lambda-role" \
    --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess

print_success "Created IAM role for Lambda functions"

# Create configuration file
print_status "Creating AWS configuration file..."

cat > aws-config.json << EOF
{
    "region": "$REGION",
    "projectName": "$PROJECT_NAME",
    "environment": "$ENVIRONMENT",
    "dynamodb": {
        "usersTable": "${PROJECT_NAME}-users",
        "homesTable": "${PROJECT_NAME}-homes",
        "tasksTable": "${PROJECT_NAME}-tasks",
        "serviceRecordsTable": "${PROJECT_NAME}-service-records",
        "photosTable": "${PROJECT_NAME}-photos",
        "subscriptionsTable": "${PROJECT_NAME}-subscriptions"
    },
    "cognito": {
        "userPoolId": "$USER_POOL_ID",
        "clientId": "$CLIENT_ID"
    },
    "s3": {
        "userDataBucket": "${PROJECT_NAME}-user-data-$(date +%s)",
        "staticAssetsBucket": "${PROJECT_NAME}-static-assets-$(date +%s)"
    }
}
EOF

print_success "Created AWS configuration file: aws-config.json"

# Wait for tables to be active
print_status "Waiting for DynamoDB tables to be active..."
aws dynamodb wait table-exists --table-name "${PROJECT_NAME}-users" --region $REGION
aws dynamodb wait table-exists --table-name "${PROJECT_NAME}-homes" --region $REGION
aws dynamodb wait table-exists --table-name "${PROJECT_NAME}-tasks" --region $REGION
aws dynamodb wait table-exists --table-name "${PROJECT_NAME}-service-records" --region $REGION
aws dynamodb wait table-exists --table-name "${PROJECT_NAME}-photos" --region $REGION
aws dynamodb wait table-exists --table-name "${PROJECT_NAME}-subscriptions" --region $REGION

print_success "All DynamoDB tables are active!"

# Summary
echo ""
echo "🎉 AWS Infrastructure Setup Complete!"
echo ""
echo "📊 Created Resources:"
echo "  ✅ 6 DynamoDB Tables"
echo "  ✅ 2 S3 Buckets"
echo "  ✅ 1 Cognito User Pool"
echo "  ✅ 1 Cognito User Pool Client"
echo "  ✅ 1 IAM Role for Lambda"
echo ""
echo "📁 Configuration saved to: aws-config.json"
echo ""
echo "🔧 Next Steps:"
echo "  1. Review the aws-config.json file"
echo "  2. Install AWS SDK in your NestMate project"
echo "  3. Update your code to use AWS services"
echo "  4. Test the infrastructure"
echo ""
echo "💡 To view your resources in AWS Console:"
echo "  DynamoDB: https://console.aws.amazon.com/dynamodb/home?region=$REGION"
echo "  Cognito: https://console.aws.amazon.com/cognito/home?region=$REGION"
echo "  S3: https://console.aws.amazon.com/s3/home?region=$REGION"
echo ""
