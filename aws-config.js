// AWS Configuration for NestMate
// This file contains all AWS service configurations

// Load AWS configuration from JSON file
let awsConfig = {};

// Try to load from aws-config.json if it exists
try {
    awsConfig = require('./aws-config.json');
} catch (error) {
    console.warn('aws-config.json not found. Using default configuration.');
    awsConfig = {
        region: 'us-east-1',
        projectName: 'nestmate',
        environment: 'production'
    };
}

// AWS SDK Configuration
const AWS_CONFIG = {
    region: awsConfig.region || 'us-east-1',
    credentials: {
        // These will be set by AWS SDK automatically from environment or IAM roles
        // For local development, use AWS CLI credentials
        // For production, use IAM roles
    }
};

// DynamoDB Configuration
const DYNAMODB_CONFIG = {
    region: awsConfig.region || 'us-east-1',
    tables: {
        users: awsConfig.dynamodb?.usersTable || 'nestmate-users',
        homes: awsConfig.dynamodb?.homesTable || 'nestmate-homes',
        tasks: awsConfig.dynamodb?.tasksTable || 'nestmate-tasks',
        serviceRecords: awsConfig.dynamodb?.serviceRecordsTable || 'nestmate-service-records',
        photos: awsConfig.dynamodb?.photosTable || 'nestmate-photos',
        subscriptions: awsConfig.dynamodb?.subscriptionsTable || 'nestmate-subscriptions'
    }
};

// Cognito Configuration
const COGNITO_CONFIG = {
    region: awsConfig.region || 'us-east-1',
    userPoolId: awsConfig.cognito?.userPoolId || '',
    clientId: awsConfig.cognito?.clientId || '',
    identityPoolId: awsConfig.cognito?.identityPoolId || ''
};

// S3 Configuration
const S3_CONFIG = {
    region: awsConfig.region || 'us-east-1',
    buckets: {
        userData: awsConfig.s3?.userDataBucket || 'nestmate-user-data',
        staticAssets: awsConfig.s3?.staticAssetsBucket || 'nestmate-static-assets'
    }
};

// Lambda Configuration
const LAMBDA_CONFIG = {
    region: awsConfig.region || 'us-east-1',
    functionName: awsConfig.projectName || 'nestmate',
    roleArn: `arn:aws:iam::${awsConfig.accountId || 'YOUR_ACCOUNT_ID'}:role/nestmate-lambda-role`
};

// API Gateway Configuration
const API_GATEWAY_CONFIG = {
    region: awsConfig.region || 'us-east-1',
    restApiId: awsConfig.apiGateway?.restApiId || '',
    stage: awsConfig.environment || 'production'
};

// Export configurations
module.exports = {
    AWS_CONFIG,
    DYNAMODB_CONFIG,
    COGNITO_CONFIG,
    S3_CONFIG,
    LAMBDA_CONFIG,
    API_GATEWAY_CONFIG,
    awsConfig
};

// Environment-specific configurations
if (process.env.NODE_ENV === 'development') {
    console.log('🔧 Development mode: Using local AWS configuration');
    console.log('📁 Make sure aws-config.json exists and is properly configured');
} else if (process.env.NODE_ENV === 'production') {
    console.log('🚀 Production mode: Using AWS IAM roles and environment variables');
}
