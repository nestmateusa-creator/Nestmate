// Demo Account Creation Script for NestMate Dashboards
// This script creates demo accounts for each subscription tier

const AWS = require('aws-sdk');

// AWS Configuration
AWS.config.update({
    region: 'us-east-2',
    accessKeyId: 'AKIAXBLPTGPR44FNAHUL',
    secretAccessKey: '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'
});

const cognito = new AWS.CognitoIdentityServiceProvider();
const dynamodb = new AWS.DynamoDB.DocumentClient();

const COGNITO_CONFIG = {
    userPoolId: 'us-east-2_2aUT3c65F',
    clientId: '3a603s7kgoc0e47cjjtj1nugfe'
};

// Demo accounts configuration
const demoAccounts = [
    {
        email: 'demo.basic@nestmate.com',
        password: 'DemoBasic123!',
        name: 'Basic Demo User',
        subscription: 'basic',
        plan: 'Basic ($5/month)',
        dashboard: 'dashboard-basic-clean.html'
    },
    {
        email: 'demo.advanced@nestmate.com',
        password: 'DemoAdvanced123!',
        name: 'Advanced Demo User',
        subscription: 'pro',
        plan: 'Pro ($10/month)',
        dashboard: 'dashboard-advanced.html'
    },
    {
        email: 'demo.advancedpro@nestmate.com',
        password: 'DemoAdvancedPro123!',
        name: 'Advanced Pro Demo User',
        subscription: 'advanced-pro',
        plan: 'Advanced Pro ($16/month)',
        dashboard: 'dashboard-advanced-pro.html'
    },
    {
        email: 'demo.enterprise@nestmate.com',
        password: 'DemoEnterprise123!',
        name: 'Enterprise Demo User',
        subscription: 'enterprise',
        plan: 'Enterprise ($50/month)',
        dashboard: 'dashboard-enterprise.html'
    }
];

async function createDemoAccount(account) {
    try {
        console.log(`Creating demo account for ${account.email}...`);
        
        // Create Cognito user
        const signUpParams = {
            ClientId: COGNITO_CONFIG.clientId,
            Username: account.email,
            Password: account.password,
            UserAttributes: [
                { Name: 'email', Value: account.email },
                { Name: 'name', Value: account.name }
            ]
        };

        const signUpResult = await cognito.signUp(signUpParams).promise();
        console.log(`✅ Cognito user created: ${account.email}`);

        // Create DynamoDB user record
        const userRecord = {
            userId: signUpResult.UserSub,
            email: account.email,
            name: account.name,
            phone: '',
            subscription: account.subscription,
            subscriptionStatus: 'active',
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            homes: [],
            preferences: {
                theme: 'dark',
                notifications: true
            }
        };

        const dynamoParams = {
            TableName: 'nestmate-users',
            Item: userRecord
        };

        await dynamodb.put(dynamoParams).promise();
        console.log(`✅ DynamoDB record created for ${account.email}`);

        return {
            success: true,
            email: account.email,
            password: account.password,
            name: account.name,
            plan: account.plan,
            dashboard: account.dashboard
        };

    } catch (error) {
        console.error(`❌ Error creating account for ${account.email}:`, error.message);
        return {
            success: false,
            email: account.email,
            error: error.message
        };
    }
}

async function createAllDemoAccounts() {
    console.log('🚀 Creating demo accounts for NestMate dashboards...\n');
    
    const results = [];
    
    for (const account of demoAccounts) {
        const result = await createDemoAccount(account);
        results.push(result);
        console.log(''); // Empty line for readability
    }
    
    console.log('📊 DEMO ACCOUNT CREATION SUMMARY');
    console.log('=====================================\n');
    
    results.forEach((result, index) => {
        if (result.success) {
            console.log(`✅ ${result.plan}`);
            console.log(`   Email: ${result.email}`);
            console.log(`   Password: ${result.password}`);
            console.log(`   Dashboard: ${result.dashboard}`);
            console.log(`   Name: ${result.name}\n`);
        } else {
            console.log(`❌ Failed to create account for ${result.email}`);
            console.log(`   Error: ${result.error}\n`);
        }
    });
    
    console.log('🔗 LOGIN INSTRUCTIONS');
    console.log('=====================');
    console.log('1. Go to: login-aws.html');
    console.log('2. Use any of the demo credentials above');
    console.log('3. You will be redirected to the appropriate dashboard');
    console.log('4. Each dashboard showcases different features based on the plan tier\n');
    
    console.log('📝 DASHBOARD FEATURES');
    console.log('=====================');
    console.log('• Basic: Single home, 10 tasks, basic features');
    console.log('• Advanced (Pro): Up to 5 homes, unlimited tasks, health score, VIP support');
    console.log('• Advanced Pro: Family features, up to 5 family members, shared tasks');
    console.log('• Enterprise: Unlimited homes, client management, team collaboration');
}

// Run the script
if (require.main === module) {
    createAllDemoAccounts().catch(console.error);
}

module.exports = { createDemoAccount, createAllDemoAccounts, demoAccounts };
