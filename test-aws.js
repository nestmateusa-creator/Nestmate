// AWS Infrastructure Test Script
// This script tests all AWS services to ensure they're working correctly

const { db, auth, storage } = require('./aws-services');
const { v4: uuidv4 } = require('uuid');

// Test data
const testUserId = uuidv4();
const testHomeId = uuidv4();
const testTaskId = uuidv4();

console.log('🧪 Starting AWS Infrastructure Tests...\n');

// Test DynamoDB
async function testDynamoDB() {
    console.log('📊 Testing DynamoDB...');
    
    try {
        // Test user creation
        const userResult = await db.createUser({
            userId: testUserId,
            email: 'test@nestmate.com',
            name: 'Test User',
            plan: 'basic'
        });
        
        if (userResult.success) {
            console.log('✅ User created successfully');
        } else {
            console.log('❌ User creation failed:', userResult.error);
            return false;
        }

        // Test user retrieval
        const getUserResult = await db.getUser(testUserId);
        if (getUserResult.success) {
            console.log('✅ User retrieved successfully');
        } else {
            console.log('❌ User retrieval failed:', getUserResult.error);
            return false;
        }

        // Test home creation
        const homeResult = await db.createHome({
            homeId: testHomeId,
            userId: testUserId,
            address: '123 Test Street',
            squareFootage: 2000,
            yearBuilt: 2020
        });

        if (homeResult.success) {
            console.log('✅ Home created successfully');
        } else {
            console.log('❌ Home creation failed:', homeResult.error);
            return false;
        }

        // Test task creation
        const taskResult = await db.createTask({
            taskId: testTaskId,
            userId: testUserId,
            title: 'Test Task',
            description: 'This is a test task',
            dueDate: new Date().toISOString()
        });

        if (taskResult.success) {
            console.log('✅ Task created successfully');
        } else {
            console.log('❌ Task creation failed:', taskResult.error);
            return false;
        }

        // Test query by user
        const userHomesResult = await db.getHomesByUser(testUserId);
        if (userHomesResult.success && userHomesResult.data.length > 0) {
            console.log('✅ User homes query successful');
        } else {
            console.log('❌ User homes query failed:', userHomesResult.error);
            return false;
        }

        console.log('✅ DynamoDB tests passed!\n');
        return true;

    } catch (error) {
        console.log('❌ DynamoDB test error:', error.message);
        return false;
    }
}

// Test S3
async function testS3() {
    console.log('📁 Testing S3...');
    
    try {
        // Test file upload (simulate with a small text file)
        const testFile = Buffer.from('This is a test file for NestMate AWS integration');
        const uploadResult = await storage.uploadFile('userData', `test/${testUserId}/test.txt`, testFile, 'text/plain');
        
        if (uploadResult.success) {
            console.log('✅ File upload successful');
        } else {
            console.log('❌ File upload failed:', uploadResult.error);
            return false;
        }

        // Test presigned URL generation
        const urlResult = await storage.generatePresignedUrl('userData', `test/${testUserId}/test.txt`);
        
        if (urlResult.success) {
            console.log('✅ Presigned URL generation successful');
            console.log('🔗 Test URL:', urlResult.data.url.substring(0, 100) + '...');
        } else {
            console.log('❌ Presigned URL generation failed:', urlResult.error);
            return false;
        }

        // Test file deletion
        const deleteResult = await storage.deleteFile('userData', `test/${testUserId}/test.txt`);
        
        if (deleteResult.success) {
            console.log('✅ File deletion successful');
        } else {
            console.log('❌ File deletion failed:', deleteResult.error);
            return false;
        }

        console.log('✅ S3 tests passed!\n');
        return true;

    } catch (error) {
        console.log('❌ S3 test error:', error.message);
        return false;
    }
}

// Test Cognito (if configured)
async function testCognito() {
    console.log('🔐 Testing Cognito...');
    
    try {
        // Check if Cognito is configured
        if (!auth.userPoolId || !auth.clientId) {
            console.log('⚠️  Cognito not configured - skipping tests');
            console.log('💡 Run aws-setup.sh to configure Cognito\n');
            return true;
        }

        // Test user pool exists
        const AWS = require('aws-sdk');
        const cognito = new AWS.CognitoIdentityServiceProvider();
        
        const result = await cognito.describeUserPool({
            UserPoolId: auth.userPoolId
        }).promise();

        if (result.UserPool) {
            console.log('✅ Cognito User Pool accessible');
            console.log(`📝 User Pool Name: ${result.UserPool.Name}`);
        } else {
            console.log('❌ Cognito User Pool not found');
            return false;
        }

        console.log('✅ Cognito tests passed!\n');
        return true;

    } catch (error) {
        console.log('❌ Cognito test error:', error.message);
        return false;
    }
}

// Cleanup test data
async function cleanup() {
    console.log('🧹 Cleaning up test data...');
    
    try {
        // Delete test records
        await db.delete('users', { userId: testUserId });
        await db.delete('homes', { homeId: testHomeId });
        await db.delete('tasks', { taskId: testTaskId });
        
        console.log('✅ Test data cleaned up');
    } catch (error) {
        console.log('⚠️  Cleanup warning:', error.message);
    }
}

// Run all tests
async function runTests() {
    const results = [];
    
    results.push(await testDynamoDB());
    results.push(await testS3());
    results.push(await testCognito());
    
    // Cleanup
    await cleanup();
    
    // Summary
    const passed = results.filter(r => r).length;
    const total = results.length;
    
    console.log('📊 Test Results Summary:');
    console.log(`✅ Passed: ${passed}/${total}`);
    console.log(`❌ Failed: ${total - passed}/${total}`);
    
    if (passed === total) {
        console.log('\n🎉 All AWS infrastructure tests passed!');
        console.log('🚀 Your AWS setup is ready for NestMate!');
    } else {
        console.log('\n⚠️  Some tests failed. Please check the errors above.');
        console.log('💡 Make sure you have run aws-setup.sh and configured your AWS credentials.');
    }
}

// Run the tests
runTests().catch(console.error);
