// AWS Payment Success Handler
// Handles Stripe payment success and updates user data in AWS DynamoDB

import { AWS_CONFIG, DYNAMODB_CONFIG } from './aws-config.js';

class AWSPaymentHandler {
    constructor() {
        this.dynamodb = new AWS.DynamoDB.DocumentClient();
    }

    // Update user subscription after successful payment
    async updateUserSubscription(email, planInfo) {
        try {
            console.log('🔄 Updating user subscription in AWS...', { email, planInfo });

            // First, get the user by email
            const user = await this.getUserByEmail(email);
            if (!user) {
                console.error('❌ User not found:', email);
                return { success: false, error: 'User not found' };
            }

            // Update subscription information
            const updateParams = {
                TableName: DYNAMODB_CONFIG.tables.users,
                Key: { userId: user.userId },
                UpdateExpression: 'SET subscription = :sub, subscriptionStatus = :status, lastPayment = :payment, updatedAt = :updated',
                ExpressionAttributeValues: {
                    ':sub': planInfo.accountType,
                    ':status': 'active',
                    ':payment': new Date().toISOString(),
                    ':updated': new Date().toISOString()
                },
                ReturnValues: 'ALL_NEW'
            };

            const result = await this.dynamodb.update(updateParams).promise();
            console.log('✅ User subscription updated successfully');

            return { 
                success: true, 
                user: result.Attributes,
                dashboard: planInfo.dashboard 
            };

        } catch (error) {
            console.error('❌ Error updating user subscription:', error);
            return { success: false, error: error.message };
        }
    }

    // Get user by email address
    async getUserByEmail(email) {
        try {
            const params = {
                TableName: DYNAMODB_CONFIG.tables.users,
                IndexName: 'email-index', // Assuming you have a GSI on email
                KeyConditionExpression: 'email = :email',
                ExpressionAttributeValues: {
                    ':email': email
                }
            };

            const result = await this.dynamodb.query(params).promise();
            return result.Items && result.Items.length > 0 ? result.Items[0] : null;

        } catch (error) {
            console.error('❌ Error getting user by email:', error);
            return null;
        }
    }

    // Save home profile data to AWS
    async saveHomeProfile(userId, homeData) {
        try {
            console.log('🏠 Saving home profile to AWS...', { userId, homeData });

            const params = {
                TableName: DYNAMODB_CONFIG.tables.homes,
                Item: {
                    homeId: homeData.homeId || this.generateHomeId(),
                    userId: userId,
                    address: homeData.address,
                    city: homeData.city,
                    state: homeData.state,
                    zipCode: homeData.zipCode,
                    homeType: homeData.homeType,
                    bedrooms: homeData.bedrooms,
                    bathrooms: homeData.bathrooms,
                    squareFeet: homeData.squareFeet,
                    yearBuilt: homeData.yearBuilt,
                    purchaseDate: homeData.purchaseDate,
                    purchasePrice: homeData.purchasePrice,
                    currentValue: homeData.currentValue,
                    notes: homeData.notes,
                    photos: homeData.photos || [],
                    rooms: homeData.rooms || [],
                    appliances: homeData.appliances || [],
                    maintenance: homeData.maintenance || [],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            };

            await this.dynamodb.put(params).promise();
            console.log('✅ Home profile saved successfully');

            return { success: true, homeId: params.Item.homeId };

        } catch (error) {
            console.error('❌ Error saving home profile:', error);
            return { success: false, error: error.message };
        }
    }

    // Save task data to AWS
    async saveTask(userId, taskData) {
        try {
            console.log('📝 Saving task to AWS...', { userId, taskData });

            const params = {
                TableName: DYNAMODB_CONFIG.tables.tasks,
                Item: {
                    taskId: taskData.taskId || this.generateTaskId(),
                    userId: userId,
                    title: taskData.title,
                    description: taskData.description,
                    priority: taskData.priority,
                    dueDate: taskData.dueDate,
                    category: taskData.category,
                    homeId: taskData.homeId,
                    status: taskData.status || 'pending',
                    completedAt: taskData.completedAt,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            };

            await this.dynamodb.put(params).promise();
            console.log('✅ Task saved successfully');

            return { success: true, taskId: params.Item.taskId };

        } catch (error) {
            console.error('❌ Error saving task:', error);
            return { success: false, error: error.message };
        }
    }

    // Get user's homes from AWS
    async getUserHomes(userId) {
        try {
            const params = {
                TableName: DYNAMODB_CONFIG.tables.homes,
                IndexName: 'userId-index',
                KeyConditionExpression: 'userId = :userId',
                ExpressionAttributeValues: {
                    ':userId': userId
                }
            };

            const result = await this.dynamodb.query(params).promise();
            return result.Items || [];

        } catch (error) {
            console.error('❌ Error getting user homes:', error);
            return [];
        }
    }

    // Get user's tasks from AWS
    async getUserTasks(userId) {
        try {
            const params = {
                TableName: DYNAMODB_CONFIG.tables.tasks,
                IndexName: 'userId-index',
                KeyConditionExpression: 'userId = :userId',
                ExpressionAttributeValues: {
                    ':userId': userId
                }
            };

            const result = await this.dynamodb.query(params).promise();
            return result.Items || [];

        } catch (error) {
            console.error('❌ Error getting user tasks:', error);
            return [];
        }
    }

    // Generate unique IDs
    generateHomeId() {
        return 'home_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    generateTaskId() {
        return 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Handle payment success with email identification
    async handlePaymentSuccess(email, planInfo) {
        try {
            console.log('💳 Processing payment success...', { email, planInfo });

            // Update user subscription
            const subscriptionResult = await this.updateUserSubscription(email, planInfo);
            if (!subscriptionResult.success) {
                return subscriptionResult;
            }

            // Return success with dashboard redirect
            return {
                success: true,
                user: subscriptionResult.user,
                dashboard: planInfo.dashboard,
                message: 'Payment processed successfully'
            };

        } catch (error) {
            console.error('❌ Error handling payment success:', error);
            return { success: false, error: error.message };
        }
    }
}

// Export for use in other files
window.AWSPaymentHandler = AWSPaymentHandler;
