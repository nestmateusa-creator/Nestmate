// Script to verify demo accounts in AWS DynamoDB
const AWS = require('aws-sdk');

// AWS Configuration
AWS.config.update({
    region: 'us-east-2',
    accessKeyId: 'AKIAXBLPTGPR44FNAHUL',
    secretAccessKey: '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'
});

const dynamodb = new AWS.DynamoDB.DocumentClient();

const demoEmails = [
    'demo.basic@nestmate.com',
    'demo.advanced@nestmate.com',
    'demo.advancedpro@nestmate.com',
    'demo.enterprise@nestmate.com'
];

async function verifyDemoAccounts() {
    console.log('🔍 Verifying demo accounts in AWS DynamoDB...\n');
    
    const results = [];
    
    for (const email of demoEmails) {
        try {
            console.log(`Checking account: ${email}`);
            
            // Query by email (assuming email is stored as a field)
            const params = {
                TableName: 'nestmate-users',
                FilterExpression: 'email = :email',
                ExpressionAttributeValues: {
                    ':email': email
                }
            };
            
            const result = await dynamodb.scan(params).promise();
            
            if (result.Items && result.Items.length > 0) {
                const user = result.Items[0];
                console.log(`✅ Found: ${user.name} (${user.subscription})`);
                console.log(`   User ID: ${user.userId}`);
                console.log(`   Subscription: ${user.subscription}`);
                console.log(`   Status: ${user.subscriptionStatus}`);
                console.log(`   Created: ${user.createdAt}\n`);
                
                results.push({
                    email: email,
                    found: true,
                    user: user
                });
            } else {
                console.log(`❌ Not found: ${email}\n`);
                results.push({
                    email: email,
                    found: false
                });
            }
        } catch (error) {
            console.error(`❌ Error checking ${email}:`, error.message);
            results.push({
                email: email,
                found: false,
                error: error.message
            });
        }
    }
    
    console.log('📊 VERIFICATION SUMMARY');
    console.log('========================\n');
    
    const found = results.filter(r => r.found).length;
    const notFound = results.filter(r => !r.found).length;
    
    console.log(`✅ Found: ${found}/${demoEmails.length} accounts`);
    console.log(`❌ Not found: ${notFound}/${demoEmails.length} accounts\n`);
    
    if (found === demoEmails.length) {
        console.log('🎉 All demo accounts are properly set up in AWS DynamoDB!');
    } else {
        console.log('⚠️  Some demo accounts are missing. You may need to run create-demo-accounts.js again.');
    }
    
    return results;
}

// Run verification
if (require.main === module) {
    verifyDemoAccounts().catch(console.error);
}

module.exports = { verifyDemoAccounts };
