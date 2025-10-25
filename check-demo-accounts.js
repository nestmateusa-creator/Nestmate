// Script to check and confirm demo accounts in AWS Cognito
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

const demoAccounts = [
    { email: 'demo.basic@nestmate.com', password: 'DemoBasic123!' },
    { email: 'demo.advanced@nestmate.com', password: 'DemoAdvanced123!' },
    { email: 'demo.advancedpro@nestmate.com', password: 'DemoAdvancedPro123!' },
    { email: 'demo.enterprise@nestmate.com', password: 'DemoEnterprise123!' }
];

async function checkUserStatus(email) {
    try {
        console.log(`Checking user status for: ${email}`);
        
        // Get user from Cognito
        const params = {
            UserPoolId: COGNITO_CONFIG.userPoolId,
            Username: email
        };
        
        const result = await cognito.adminGetUser(params).promise();
        
        console.log(`✅ User found: ${email}`);
        console.log(`   Status: ${result.UserStatus}`);
        console.log(`   Enabled: ${result.Enabled}`);
        console.log(`   Created: ${result.UserCreateDate}`);
        console.log(`   Modified: ${result.UserLastModifiedDate}`);
        
        // Check if user needs confirmation
        if (result.UserStatus === 'UNCONFIRMED') {
            console.log(`⚠️  User needs confirmation: ${email}`);
            return { needsConfirmation: true, user: result };
        }
        
        return { needsConfirmation: false, user: result };
        
    } catch (error) {
        if (error.code === 'UserNotFoundException') {
            console.log(`❌ User not found: ${email}`);
            return { notFound: true };
        } else {
            console.error(`❌ Error checking user ${email}:`, error.message);
            return { error: error.message };
        }
    }
}

async function confirmUser(email) {
    try {
        console.log(`Confirming user: ${email}`);
        
        const params = {
            UserPoolId: COGNITO_CONFIG.userPoolId,
            Username: email
        };
        
        await cognito.adminConfirmSignUp(params).promise();
        console.log(`✅ User confirmed: ${email}`);
        return { success: true };
        
    } catch (error) {
        console.error(`❌ Error confirming user ${email}:`, error.message);
        return { success: false, error: error.message };
    }
}

async function testLogin(email, password) {
    try {
        console.log(`Testing login for: ${email}`);
        
        const params = {
            AuthFlow: 'USER_PASSWORD_AUTH',
            ClientId: COGNITO_CONFIG.clientId,
            AuthParameters: {
                USERNAME: email,
                PASSWORD: password
            }
        };
        
        const result = await cognito.initiateAuth(params).promise();
        console.log(`✅ Login successful: ${email}`);
        return { success: true, result };
        
    } catch (error) {
        console.error(`❌ Login failed for ${email}:`, error.message);
        console.error(`   Error code: ${error.code}`);
        return { success: false, error: error.message, code: error.code };
    }
}

async function checkAndFixDemoAccounts() {
    console.log('🔍 Checking demo accounts status...\n');
    
    for (const account of demoAccounts) {
        console.log(`\n--- Checking ${account.email} ---`);
        
        // Check user status
        const statusResult = await checkUserStatus(account.email);
        
        if (statusResult.notFound) {
            console.log(`❌ User not found in Cognito: ${account.email}`);
            continue;
        }
        
        if (statusResult.error) {
            console.log(`❌ Error checking user: ${statusResult.error}`);
            continue;
        }
        
        if (statusResult.needsConfirmation) {
            console.log(`🔧 Confirming user: ${account.email}`);
            const confirmResult = await confirmUser(account.email);
            
            if (confirmResult.success) {
                console.log(`✅ User confirmed successfully`);
            } else {
                console.log(`❌ Failed to confirm user: ${confirmResult.error}`);
                continue;
            }
        }
        
        // Test login
        console.log(`🔐 Testing login for: ${account.email}`);
        const loginResult = await testLogin(account.email, account.password);
        
        if (loginResult.success) {
            console.log(`✅ Login test successful`);
        } else {
            console.log(`❌ Login test failed: ${loginResult.error}`);
            console.log(`   Error code: ${loginResult.code}`);
        }
    }
    
    console.log('\n📊 Demo accounts check completed!');
}

// Run the check
if (require.main === module) {
    checkAndFixDemoAccounts().catch(console.error);
}

module.exports = { checkAndFixDemoAccounts };
