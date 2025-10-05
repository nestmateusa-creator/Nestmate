// AWS NestMate Services - Complete Firebase Replacement
// This file provides all the services needed to replace Firebase functionality

const AWS = require('aws-sdk');
const { AWS_CONFIG, DYNAMODB_CONFIG, COGNITO_CONFIG, S3_CONFIG } = require('./aws-config');

// Configure AWS SDK with credentials
AWS.config.update({
    region: 'us-east-2',
    accessKeyId: 'AKIAXBLPTGPR44FNAHUL',
    secretAccessKey: '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'
});

// Initialize AWS services
const dynamodb = new AWS.DynamoDB.DocumentClient();
const cognito = new AWS.CognitoIdentityServiceProvider();
const s3 = new AWS.S3();

class NestMateAWSServices {
    constructor() {
        this.region = AWS_CONFIG.region;
        this.userPoolId = COGNITO_CONFIG.userPoolId;
        this.clientId = COGNITO_CONFIG.clientId;
        this.clientSecret = COGNITO_CONFIG.clientSecret;
    }

    // ==================== AUTHENTICATION SERVICES ====================
    
    async signUp(email, password, userData = {}) {
        try {
            const params = {
                ClientId: this.clientId,
                Username: email,
                Password: password,
                UserAttributes: [
                    { Name: 'email', Value: email },
                    { Name: 'name', Value: userData.name || '' },
                    { Name: 'phone_number', Value: userData.phone || '' }
                ]
            };

            const result = await cognito.signUp(params).promise();
            
            // Create user record in DynamoDB
            await this.createUser({
                userId: result.UserSub,
                email: email,
                name: userData.name || '',
                phone: userData.phone || '',
                subscription: 'basic',
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            });

            return {
                success: true,
                userSub: result.UserSub,
                needsConfirmation: !result.UserConfirmed
            };
        } catch (error) {
            console.error('Sign up error:', error);
            return { success: false, error: error.message };
        }
    }

    async signIn(email, password) {
        try {
            const params = {
                AuthFlow: 'USER_PASSWORD_AUTH',
                ClientId: this.clientId,
                AuthParameters: {
                    USERNAME: email,
                    PASSWORD: password
                }
            };

            const result = await cognito.initiateAuth(params).promise();
            
            // Update last login
            const user = await this.getUserByEmail(email);
            if (user) {
                await this.updateUser(user.userId, { lastLogin: new Date().toISOString() });
            }

            return {
                success: true,
                accessToken: result.AuthenticationResult.AccessToken,
                refreshToken: result.AuthenticationResult.RefreshToken,
                idToken: result.AuthenticationResult.IdToken,
                expiresIn: result.AuthenticationResult.ExpiresIn
            };
        } catch (error) {
            console.error('Sign in error:', error);
            return { success: false, error: error.message };
        }
    }

    async signOut(accessToken) {
        try {
            await cognito.globalSignOut({ AccessToken: accessToken }).promise();
            return { success: true };
        } catch (error) {
            console.error('Sign out error:', error);
            return { success: false, error: error.message };
        }
    }

    async confirmSignUp(email, confirmationCode) {
        try {
            const params = {
                ClientId: this.clientId,
                Username: email,
                ConfirmationCode: confirmationCode
            };

            await cognito.confirmSignUp(params).promise();
            return { success: true };
        } catch (error) {
            console.error('Confirm sign up error:', error);
            return { success: false, error: error.message };
        }
    }

    // ==================== USER MANAGEMENT ====================

    async createUser(userData) {
        try {
            const params = {
                TableName: DYNAMODB_CONFIG.tables.users,
                Item: {
                    userId: userData.userId,
                    email: userData.email,
                    name: userData.name || '',
                    phone: userData.phone || '',
                    subscription: userData.subscription || 'basic',
                    subscriptionStatus: 'active',
                    createdAt: userData.createdAt || new Date().toISOString(),
                    lastLogin: userData.lastLogin || new Date().toISOString(),
                    homes: userData.homes || [],
                    preferences: userData.preferences || {}
                }
            };

            await dynamodb.put(params).promise();
            return { success: true, user: params.Item };
        } catch (error) {
            console.error('Create user error:', error);
            return { success: false, error: error.message };
        }
    }

    async getUser(userId) {
        try {
            const params = {
                TableName: DYNAMODB_CONFIG.tables.users,
                Key: { userId: userId }
            };

            const result = await dynamodb.get(params).promise();
            return { success: true, user: result.Item };
        } catch (error) {
            console.error('Get user error:', error);
            return { success: false, error: error.message };
        }
    }

    async getUserByEmail(email) {
        try {
            const params = {
                TableName: DYNAMODB_CONFIG.tables.users,
                FilterExpression: 'email = :email',
                ExpressionAttributeValues: {
                    ':email': email
                }
            };

            const result = await dynamodb.scan(params).promise();
            return { success: true, user: result.Items[0] };
        } catch (error) {
            console.error('Get user by email error:', error);
            return { success: false, error: error.message };
        }
    }

    async updateUser(userId, updateData) {
        try {
            const updateExpression = [];
            const expressionAttributeValues = {};
            const expressionAttributeNames = {};

            Object.keys(updateData).forEach((key, index) => {
                updateExpression.push(`#${key} = :val${index}`);
                expressionAttributeNames[`#${key}`] = key;
                expressionAttributeValues[`:val${index}`] = updateData[key];
            });

            const params = {
                TableName: DYNAMODB_CONFIG.tables.users,
                Key: { userId: userId },
                UpdateExpression: `SET ${updateExpression.join(', ')}`,
                ExpressionAttributeNames: expressionAttributeNames,
                ExpressionAttributeValues: expressionAttributeValues,
                ReturnValues: 'ALL_NEW'
            };

            const result = await dynamodb.update(params).promise();
            return { success: true, user: result.Attributes };
        } catch (error) {
            console.error('Update user error:', error);
            return { success: false, error: error.message };
        }
    }

    // ==================== HOME MANAGEMENT ====================

    async createHome(userId, homeData) {
        try {
            const homeId = `home_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            
            const params = {
                TableName: DYNAMODB_CONFIG.tables.homes,
                Item: {
                    homeId: homeId,
                    userId: userId,
                    name: homeData.name || 'My Home',
                    address: homeData.address || '',
                    type: homeData.type || 'house',
                    bedrooms: homeData.bedrooms || 0,
                    bathrooms: homeData.bathrooms || 0,
                    squareFeet: homeData.squareFeet || 0,
                    yearBuilt: homeData.yearBuilt || '',
                    purchasePrice: homeData.purchasePrice || 0,
                    currentValue: homeData.currentValue || 0,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    tasks: [],
                    serviceRecords: [],
                    photos: []
                }
            };

            await dynamodb.put(params).promise();
            
            // Add home to user's homes list
            const user = await this.getUser(userId);
            if (user.success) {
                const updatedHomes = [...(user.user.homes || []), homeId];
                await this.updateUser(userId, { homes: updatedHomes });
            }

            return { success: true, home: params.Item };
        } catch (error) {
            console.error('Create home error:', error);
            return { success: false, error: error.message };
        }
    }

    async getHome(homeId) {
        try {
            const params = {
                TableName: DYNAMODB_CONFIG.tables.homes,
                Key: { homeId: homeId }
            };

            const result = await dynamodb.get(params).promise();
            return { success: true, home: result.Item };
        } catch (error) {
            console.error('Get home error:', error);
            return { success: false, error: error.message };
        }
    }

    async getUserHomes(userId) {
        try {
            const params = {
                TableName: DYNAMODB_CONFIG.tables.homes,
                FilterExpression: 'userId = :userId',
                ExpressionAttributeValues: {
                    ':userId': userId
                }
            };

            const result = await dynamodb.scan(params).promise();
            return { success: true, homes: result.Items };
        } catch (error) {
            console.error('Get user homes error:', error);
            return { success: false, error: error.message };
        }
    }

    async updateHome(homeId, updateData) {
        try {
            const updateExpression = [];
            const expressionAttributeValues = {};
            const expressionAttributeNames = {};

            Object.keys(updateData).forEach((key, index) => {
                updateExpression.push(`#${key} = :val${index}`);
                expressionAttributeNames[`#${key}`] = key;
                expressionAttributeValues[`:val${index}`] = updateData[key];
            });

            updateExpression.push('#updatedAt = :updatedAt');
            expressionAttributeNames['#updatedAt'] = 'updatedAt';
            expressionAttributeValues[':updatedAt'] = new Date().toISOString();

            const params = {
                TableName: DYNAMODB_CONFIG.tables.homes,
                Key: { homeId: homeId },
                UpdateExpression: `SET ${updateExpression.join(', ')}`,
                ExpressionAttributeNames: expressionAttributeNames,
                ExpressionAttributeValues: expressionAttributeValues,
                ReturnValues: 'ALL_NEW'
            };

            const result = await dynamodb.update(params).promise();
            return { success: true, home: result.Attributes };
        } catch (error) {
            console.error('Update home error:', error);
            return { success: false, error: error.message };
        }
    }

    async deleteHome(homeId) {
        try {
            const params = {
                TableName: DYNAMODB_CONFIG.tables.homes,
                Key: { homeId: homeId }
            };

            await dynamodb.delete(params).promise();
            return { success: true };
        } catch (error) {
            console.error('Delete home error:', error);
            return { success: false, error: error.message };
        }
    }

    // ==================== TASK MANAGEMENT ====================

    async createTask(homeId, taskData) {
        try {
            const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            
            const params = {
                TableName: DYNAMODB_CONFIG.tables.tasks,
                Item: {
                    taskId: taskId,
                    homeId: homeId,
                    title: taskData.title || '',
                    description: taskData.description || '',
                    category: taskData.category || 'maintenance',
                    priority: taskData.priority || 'medium',
                    status: taskData.status || 'pending',
                    dueDate: taskData.dueDate || '',
                    assignedTo: taskData.assignedTo || '',
                    estimatedCost: taskData.estimatedCost || 0,
                    actualCost: taskData.actualCost || 0,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    completedAt: taskData.completedAt || null,
                    notes: taskData.notes || []
                }
            };

            await dynamodb.put(params).promise();
            
            // Add task to home's tasks list
            const home = await this.getHome(homeId);
            if (home.success && home.home) {
                const updatedTasks = [...(home.home.tasks || []), taskId];
                await this.updateHome(homeId, { tasks: updatedTasks });
            }

            return { success: true, task: params.Item };
        } catch (error) {
            console.error('Create task error:', error);
            return { success: false, error: error.message };
        }
    }

    async getTask(taskId) {
        try {
            const params = {
                TableName: DYNAMODB_CONFIG.tables.tasks,
                Key: { taskId: taskId }
            };

            const result = await dynamodb.get(params).promise();
            return { success: true, task: result.Item };
        } catch (error) {
            console.error('Get task error:', error);
            return { success: false, error: error.message };
        }
    }

    async getHomeTasks(homeId) {
        try {
            const params = {
                TableName: DYNAMODB_CONFIG.tables.tasks,
                FilterExpression: 'homeId = :homeId',
                ExpressionAttributeValues: {
                    ':homeId': homeId
                }
            };

            const result = await dynamodb.scan(params).promise();
            return { success: true, tasks: result.Items };
        } catch (error) {
            console.error('Get home tasks error:', error);
            return { success: false, error: error.message };
        }
    }

    async updateTask(taskId, updateData) {
        try {
            const updateExpression = [];
            const expressionAttributeValues = {};
            const expressionAttributeNames = {};

            Object.keys(updateData).forEach((key, index) => {
                updateExpression.push(`#${key} = :val${index}`);
                expressionAttributeNames[`#${key}`] = key;
                expressionAttributeValues[`:val${index}`] = updateData[key];
            });

            updateExpression.push('#updatedAt = :updatedAt');
            expressionAttributeNames['#updatedAt'] = 'updatedAt';
            expressionAttributeValues[':updatedAt'] = new Date().toISOString();

            const params = {
                TableName: DYNAMODB_CONFIG.tables.tasks,
                Key: { taskId: taskId },
                UpdateExpression: `SET ${updateExpression.join(', ')}`,
                ExpressionAttributeNames: expressionAttributeNames,
                ExpressionAttributeValues: expressionAttributeValues,
                ReturnValues: 'ALL_NEW'
            };

            const result = await dynamodb.update(params).promise();
            return { success: true, task: result.Attributes };
        } catch (error) {
            console.error('Update task error:', error);
            return { success: false, error: error.message };
        }
    }

    async deleteTask(taskId) {
        try {
            const params = {
                TableName: DYNAMODB_CONFIG.tables.tasks,
                Key: { taskId: taskId }
            };

            await dynamodb.delete(params).promise();
            return { success: true };
        } catch (error) {
            console.error('Delete task error:', error);
            return { success: false, error: error.message };
        }
    }

    // ==================== SUBSCRIPTION MANAGEMENT ====================

    async createSubscription(userId, subscriptionData) {
        try {
            const subscriptionId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            
            const params = {
                TableName: DYNAMODB_CONFIG.tables.subscriptions,
                Item: {
                    subscriptionId: subscriptionId,
                    userId: userId,
                    plan: subscriptionData.plan || 'basic',
                    status: subscriptionData.status || 'active',
                    startDate: subscriptionData.startDate || new Date().toISOString(),
                    endDate: subscriptionData.endDate || '',
                    billingCycle: subscriptionData.billingCycle || 'monthly',
                    amount: subscriptionData.amount || 0,
                    stripeCustomerId: subscriptionData.stripeCustomerId || '',
                    stripeSubscriptionId: subscriptionData.stripeSubscriptionId || '',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            };

            await dynamodb.put(params).promise();
            
            // Update user subscription
            await this.updateUser(userId, { 
                subscription: subscriptionData.plan,
                subscriptionStatus: subscriptionData.status 
            });

            return { success: true, subscription: params.Item };
        } catch (error) {
            console.error('Create subscription error:', error);
            return { success: false, error: error.message };
        }
    }

    async getSubscription(subscriptionId) {
        try {
            const params = {
                TableName: DYNAMODB_CONFIG.tables.subscriptions,
                Key: { subscriptionId: subscriptionId }
            };

            const result = await dynamodb.get(params).promise();
            return { success: true, subscription: result.Item };
        } catch (error) {
            console.error('Get subscription error:', error);
            return { success: false, error: error.message };
        }
    }

    async getUserSubscription(userId) {
        try {
            const params = {
                TableName: DYNAMODB_CONFIG.tables.subscriptions,
                FilterExpression: 'userId = :userId',
                ExpressionAttributeValues: {
                    ':userId': userId
                }
            };

            const result = await dynamodb.scan(params).promise();
            return { success: true, subscription: result.Items[0] };
        } catch (error) {
            console.error('Get user subscription error:', error);
            return { success: false, error: error.message };
        }
    }

    // ==================== FILE STORAGE (S3) ====================

    async uploadFile(fileName, fileData, contentType = 'application/octet-stream') {
        try {
            const key = `uploads/${Date.now()}_${fileName}`;
            
            const params = {
                Bucket: S3_CONFIG.buckets.userData,
                Key: key,
                Body: fileData,
                ContentType: contentType,
                ACL: 'private'
            };

            const result = await s3.upload(params).promise();
            return { success: true, url: result.Location, key: key };
        } catch (error) {
            console.error('Upload file error:', error);
            return { success: false, error: error.message };
        }
    }

    async getPresignedUrl(key, expiresIn = 3600) {
        try {
            const params = {
                Bucket: S3_CONFIG.buckets.userData,
                Key: key,
                Expires: expiresIn
            };

            const url = await s3.getSignedUrlPromise('getObject', params);
            return { success: true, url: url };
        } catch (error) {
            console.error('Get presigned URL error:', error);
            return { success: false, error: error.message };
        }
    }

    async deleteFile(key) {
        try {
            const params = {
                Bucket: S3_CONFIG.buckets.userData,
                Key: key
            };

            await s3.deleteObject(params).promise();
            return { success: true };
        } catch (error) {
            console.error('Delete file error:', error);
            return { success: false, error: error.message };
        }
    }

    // ==================== UTILITY METHODS ====================

    async validateToken(accessToken) {
        try {
            const params = {
                AccessToken: accessToken
            };

            const result = await cognito.getUser(params).promise();
            return { success: true, user: result };
        } catch (error) {
            console.error('Validate token error:', error);
            return { success: false, error: error.message };
        }
    }

    async refreshToken(refreshToken) {
        try {
            const params = {
                AuthFlow: 'REFRESH_TOKEN_AUTH',
                ClientId: this.clientId,
                AuthParameters: {
                    REFRESH_TOKEN: refreshToken
                }
            };

            const result = await cognito.initiateAuth(params).promise();
            return {
                success: true,
                accessToken: result.AuthenticationResult.AccessToken,
                idToken: result.AuthenticationResult.IdToken,
                expiresIn: result.AuthenticationResult.ExpiresIn
            };
        } catch (error) {
            console.error('Refresh token error:', error);
            return { success: false, error: error.message };
        }
    }
}

// Export the service class
module.exports = NestMateAWSServices;
