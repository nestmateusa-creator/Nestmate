// Complete AWS Test Suite for NestMate
// This script tests all AWS services and functionality

const NestMateAWSServices = require('./aws-nestmate-services');

class AWSCompleteTest {
    constructor() {
        this.awsServices = new NestMateAWSServices();
        this.testResults = {
            authentication: { passed: 0, failed: 0, tests: [] },
            userManagement: { passed: 0, failed: 0, tests: [] },
            homeManagement: { passed: 0, failed: 0, tests: [] },
            taskManagement: { passed: 0, failed: 0, tests: [] },
            subscriptionManagement: { passed: 0, failed: 0, tests: [] },
            fileStorage: { passed: 0, failed: 0, tests: [] }
        };
    }

    async runAllTests() {
        console.log('🧪 Starting Complete AWS Test Suite...\n');

        try {
            await this.testAuthentication();
            await this.testUserManagement();
            await this.testHomeManagement();
            await this.testTaskManagement();
            await this.testSubscriptionManagement();
            await this.testFileStorage();
            
            this.printTestResults();
            
        } catch (error) {
            console.error('❌ Test suite failed:', error);
        }
    }

    async testAuthentication() {
        console.log('🔐 Testing Authentication...');
        
        // Test 1: Sign up a test user
        try {
            const signUpResult = await this.awsServices.signUp(
                'test@nestmate.com',
                'TestPassword123!',
                { name: 'Test User', phone: '+1234567890' }
            );
            
            if (signUpResult.success) {
                this.testResults.authentication.passed++;
                this.testResults.authentication.tests.push('✅ User sign up successful');
                console.log('✅ User sign up successful');
            } else {
                this.testResults.authentication.failed++;
                this.testResults.authentication.tests.push(`❌ User sign up failed: ${signUpResult.error}`);
                console.log(`❌ User sign up failed: ${signUpResult.error}`);
            }
        } catch (error) {
            this.testResults.authentication.failed++;
            this.testResults.authentication.tests.push(`❌ User sign up error: ${error.message}`);
            console.log(`❌ User sign up error: ${error.message}`);
        }

        // Test 2: Confirm sign up (if needed)
        try {
            const confirmResult = await this.awsServices.confirmSignUp(
                'test@nestmate.com',
                '123456' // This will likely fail, but we're testing the method
            );
            
            if (confirmResult.success) {
                this.testResults.authentication.passed++;
                this.testResults.authentication.tests.push('✅ Email confirmation successful');
                console.log('✅ Email confirmation successful');
            } else {
                this.testResults.authentication.failed++;
                this.testResults.authentication.tests.push(`❌ Email confirmation failed: ${confirmResult.error}`);
                console.log(`❌ Email confirmation failed: ${confirmResult.error}`);
            }
        } catch (error) {
            this.testResults.authentication.failed++;
            this.testResults.authentication.tests.push(`❌ Email confirmation error: ${error.message}`);
            console.log(`❌ Email confirmation error: ${error.message}`);
        }

        console.log(`📊 Authentication: ${this.testResults.authentication.passed} passed, ${this.testResults.authentication.failed} failed\n`);
    }

    async testUserManagement() {
        console.log('👥 Testing User Management...');
        
        // Test 1: Create user record
        try {
            const createResult = await this.awsServices.createUser({
                userId: 'test_user_123',
                email: 'testuser@nestmate.com',
                name: 'Test User',
                phone: '+1234567890',
                subscription: 'pro',
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            });
            
            if (createResult.success) {
                this.testResults.userManagement.passed++;
                this.testResults.userManagement.tests.push('✅ User record created');
                console.log('✅ User record created');
            } else {
                this.testResults.userManagement.failed++;
                this.testResults.userManagement.tests.push(`❌ User record creation failed: ${createResult.error}`);
                console.log(`❌ User record creation failed: ${createResult.error}`);
            }
        } catch (error) {
            this.testResults.userManagement.failed++;
            this.testResults.userManagement.tests.push(`❌ User record creation error: ${error.message}`);
            console.log(`❌ User record creation error: ${error.message}`);
        }

        // Test 2: Get user record
        try {
            const getResult = await this.awsServices.getUser('test_user_123');
            
            if (getResult.success && getResult.user) {
                this.testResults.userManagement.passed++;
                this.testResults.userManagement.tests.push('✅ User record retrieved');
                console.log('✅ User record retrieved');
            } else {
                this.testResults.userManagement.failed++;
                this.testResults.userManagement.tests.push(`❌ User record retrieval failed: ${getResult.error}`);
                console.log(`❌ User record retrieval failed: ${getResult.error}`);
            }
        } catch (error) {
            this.testResults.userManagement.failed++;
            this.testResults.userManagement.tests.push(`❌ User record retrieval error: ${error.message}`);
            console.log(`❌ User record retrieval error: ${error.message}`);
        }

        // Test 3: Update user record
        try {
            const updateResult = await this.awsServices.updateUser('test_user_123', {
                name: 'Updated Test User',
                lastLogin: new Date().toISOString()
            });
            
            if (updateResult.success) {
                this.testResults.userManagement.passed++;
                this.testResults.userManagement.tests.push('✅ User record updated');
                console.log('✅ User record updated');
            } else {
                this.testResults.userManagement.failed++;
                this.testResults.userManagement.tests.push(`❌ User record update failed: ${updateResult.error}`);
                console.log(`❌ User record update failed: ${updateResult.error}`);
            }
        } catch (error) {
            this.testResults.userManagement.failed++;
            this.testResults.userManagement.tests.push(`❌ User record update error: ${error.message}`);
            console.log(`❌ User record update error: ${error.message}`);
        }

        console.log(`📊 User Management: ${this.testResults.userManagement.passed} passed, ${this.testResults.userManagement.failed} failed\n`);
    }

    async testHomeManagement() {
        console.log('🏠 Testing Home Management...');
        
        // Test 1: Create home
        try {
            const createResult = await this.awsServices.createHome('test_user_123', {
                name: 'Test Home',
                address: '123 Test Street, Test City, TC 12345',
                type: 'house',
                bedrooms: 3,
                bathrooms: 2,
                squareFeet: 1500,
                yearBuilt: '2020',
                purchasePrice: 250000,
                currentValue: 275000
            });
            
            if (createResult.success) {
                this.testResults.homeManagement.passed++;
                this.testResults.homeManagement.tests.push('✅ Home created');
                console.log('✅ Home created');
            } else {
                this.testResults.homeManagement.failed++;
                this.testResults.homeManagement.tests.push(`❌ Home creation failed: ${createResult.error}`);
                console.log(`❌ Home creation failed: ${createResult.error}`);
            }
        } catch (error) {
            this.testResults.homeManagement.failed++;
            this.testResults.homeManagement.tests.push(`❌ Home creation error: ${error.message}`);
            console.log(`❌ Home creation error: ${error.message}`);
        }

        // Test 2: Get user homes
        try {
            const getResult = await this.awsServices.getUserHomes('test_user_123');
            
            if (getResult.success) {
                this.testResults.homeManagement.passed++;
                this.testResults.homeManagement.tests.push('✅ User homes retrieved');
                console.log('✅ User homes retrieved');
            } else {
                this.testResults.homeManagement.failed++;
                this.testResults.homeManagement.tests.push(`❌ User homes retrieval failed: ${getResult.error}`);
                console.log(`❌ User homes retrieval failed: ${getResult.error}`);
            }
        } catch (error) {
            this.testResults.homeManagement.failed++;
            this.testResults.homeManagement.tests.push(`❌ User homes retrieval error: ${error.message}`);
            console.log(`❌ User homes retrieval error: ${error.message}`);
        }

        console.log(`📊 Home Management: ${this.testResults.homeManagement.passed} passed, ${this.testResults.homeManagement.failed} failed\n`);
    }

    async testTaskManagement() {
        console.log('📋 Testing Task Management...');
        
        // Test 1: Create task
        try {
            const createResult = await this.awsServices.createTask('test_home_123', {
                title: 'Test Task',
                description: 'This is a test task',
                category: 'maintenance',
                priority: 'medium',
                status: 'pending',
                dueDate: '2025-12-01',
                assignedTo: 'test_user_123',
                estimatedCost: 100
            });
            
            if (createResult.success) {
                this.testResults.taskManagement.passed++;
                this.testResults.taskManagement.tests.push('✅ Task created');
                console.log('✅ Task created');
            } else {
                this.testResults.taskManagement.failed++;
                this.testResults.taskManagement.tests.push(`❌ Task creation failed: ${createResult.error}`);
                console.log(`❌ Task creation failed: ${createResult.error}`);
            }
        } catch (error) {
            this.testResults.taskManagement.failed++;
            this.testResults.taskManagement.tests.push(`❌ Task creation error: ${error.message}`);
            console.log(`❌ Task creation error: ${error.message}`);
        }

        // Test 2: Get home tasks
        try {
            const getResult = await this.awsServices.getHomeTasks('test_home_123');
            
            if (getResult.success) {
                this.testResults.taskManagement.passed++;
                this.testResults.taskManagement.tests.push('✅ Home tasks retrieved');
                console.log('✅ Home tasks retrieved');
            } else {
                this.testResults.taskManagement.failed++;
                this.testResults.taskManagement.tests.push(`❌ Home tasks retrieval failed: ${getResult.error}`);
                console.log(`❌ Home tasks retrieval failed: ${getResult.error}`);
            }
        } catch (error) {
            this.testResults.taskManagement.failed++;
            this.testResults.taskManagement.tests.push(`❌ Home tasks retrieval error: ${error.message}`);
            console.log(`❌ Home tasks retrieval error: ${error.message}`);
        }

        console.log(`📊 Task Management: ${this.testResults.taskManagement.passed} passed, ${this.testResults.taskManagement.failed} failed\n`);
    }

    async testSubscriptionManagement() {
        console.log('💳 Testing Subscription Management...');
        
        // Test 1: Create subscription
        try {
            const createResult = await this.awsServices.createSubscription('test_user_123', {
                plan: 'pro',
                status: 'active',
                startDate: new Date().toISOString(),
                billingCycle: 'monthly',
                amount: 15,
                stripeCustomerId: 'cus_test123',
                stripeSubscriptionId: 'sub_test123'
            });
            
            if (createResult.success) {
                this.testResults.subscriptionManagement.passed++;
                this.testResults.subscriptionManagement.tests.push('✅ Subscription created');
                console.log('✅ Subscription created');
            } else {
                this.testResults.subscriptionManagement.failed++;
                this.testResults.subscriptionManagement.tests.push(`❌ Subscription creation failed: ${createResult.error}`);
                console.log(`❌ Subscription creation failed: ${createResult.error}`);
            }
        } catch (error) {
            this.testResults.subscriptionManagement.failed++;
            this.testResults.subscriptionManagement.tests.push(`❌ Subscription creation error: ${error.message}`);
            console.log(`❌ Subscription creation error: ${error.message}`);
        }

        // Test 2: Get user subscription
        try {
            const getResult = await this.awsServices.getUserSubscription('test_user_123');
            
            if (getResult.success) {
                this.testResults.subscriptionManagement.passed++;
                this.testResults.subscriptionManagement.tests.push('✅ User subscription retrieved');
                console.log('✅ User subscription retrieved');
            } else {
                this.testResults.subscriptionManagement.failed++;
                this.testResults.subscriptionManagement.tests.push(`❌ User subscription retrieval failed: ${getResult.error}`);
                console.log(`❌ User subscription retrieval failed: ${getResult.error}`);
            }
        } catch (error) {
            this.testResults.subscriptionManagement.failed++;
            this.testResults.subscriptionManagement.tests.push(`❌ User subscription retrieval error: ${error.message}`);
            console.log(`❌ User subscription retrieval error: ${error.message}`);
        }

        console.log(`📊 Subscription Management: ${this.testResults.subscriptionManagement.passed} passed, ${this.testResults.subscriptionManagement.failed} failed\n`);
    }

    async testFileStorage() {
        console.log('📁 Testing File Storage...');
        
        // Test 1: Upload file
        try {
            const uploadResult = await this.awsServices.uploadFile(
                'test.txt',
                'This is a test file content',
                'text/plain'
            );
            
            if (uploadResult.success) {
                this.testResults.fileStorage.passed++;
                this.testResults.fileStorage.tests.push('✅ File upload successful');
                console.log('✅ File upload successful');
            } else {
                this.testResults.fileStorage.failed++;
                this.testResults.fileStorage.tests.push(`❌ File upload failed: ${uploadResult.error}`);
                console.log(`❌ File upload failed: ${uploadResult.error}`);
            }
        } catch (error) {
            this.testResults.fileStorage.failed++;
            this.testResults.fileStorage.tests.push(`❌ File upload error: ${error.message}`);
            console.log(`❌ File upload error: ${error.message}`);
        }

        // Test 2: Generate presigned URL
        try {
            const urlResult = await this.awsServices.getPresignedUrl('test-file-key', 3600);
            
            if (urlResult.success) {
                this.testResults.fileStorage.passed++;
                this.testResults.fileStorage.tests.push('✅ Presigned URL generated');
                console.log('✅ Presigned URL generated');
            } else {
                this.testResults.fileStorage.failed++;
                this.testResults.fileStorage.tests.push(`❌ Presigned URL generation failed: ${urlResult.error}`);
                console.log(`❌ Presigned URL generation failed: ${urlResult.error}`);
            }
        } catch (error) {
            this.testResults.fileStorage.failed++;
            this.testResults.fileStorage.tests.push(`❌ Presigned URL generation error: ${error.message}`);
            console.log(`❌ Presigned URL generation error: ${error.message}`);
        }

        console.log(`📊 File Storage: ${this.testResults.fileStorage.passed} passed, ${this.testResults.fileStorage.failed} failed\n`);
    }

    printTestResults() {
        console.log('🎉 AWS Test Suite Complete!\n');
        console.log('📊 Test Results Summary:');
        console.log('========================');
        
        let totalPassed = 0;
        let totalFailed = 0;
        
        Object.keys(this.testResults).forEach(category => {
            const results = this.testResults[category];
            const successRate = results.passed + results.failed > 0 ? 
                ((results.passed / (results.passed + results.failed)) * 100).toFixed(1) : 0;
            
            console.log(`\n${category.toUpperCase()}:`);
            console.log(`  ✅ Passed: ${results.passed}`);
            console.log(`  ❌ Failed: ${results.failed}`);
            console.log(`  📈 Success Rate: ${successRate}%`);
            
            if (results.tests.length > 0) {
                console.log('  📝 Test Details:');
                results.tests.forEach(test => {
                    console.log(`    ${test}`);
                });
            }
            
            totalPassed += results.passed;
            totalFailed += results.failed;
        });
        
        const overallSuccessRate = totalPassed + totalFailed > 0 ? 
            ((totalPassed / (totalPassed + totalFailed)) * 100).toFixed(1) : 0;
        
        console.log('\n🏆 OVERALL RESULTS:');
        console.log(`  ✅ Total Passed: ${totalPassed}`);
        console.log(`  ❌ Total Failed: ${totalFailed}`);
        console.log(`  📈 Overall Success Rate: ${overallSuccessRate}%`);
        
        if (overallSuccessRate >= 80) {
            console.log('\n🎉 AWS Migration is ready for production!');
        } else if (overallSuccessRate >= 60) {
            console.log('\n⚠️  AWS Migration needs some fixes before production.');
        } else {
            console.log('\n❌ AWS Migration requires significant work before production.');
        }
    }
}

// Run tests if this file is executed directly
if (require.main === module) {
    const tester = new AWSCompleteTest();
    tester.runAllTests().catch(console.error);
}

module.exports = AWSCompleteTest;
