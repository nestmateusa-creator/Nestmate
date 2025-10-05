// AWS Services for NestMate
// This file contains all AWS service integrations

const AWS = require('aws-sdk');
const { DYNAMODB_CONFIG, COGNITO_CONFIG, S3_CONFIG } = require('./aws-config');

// Configure AWS SDK
AWS.config.update({
    region: DYNAMODB_CONFIG.region
});

// Initialize AWS Services
const dynamodb = new AWS.DynamoDB.DocumentClient();
const cognito = new AWS.CognitoIdentityServiceProvider();
const s3 = new AWS.S3();

// DynamoDB Service Class
class DynamoDBService {
    constructor() {
        this.tables = DYNAMODB_CONFIG.tables;
    }

    // Generic CRUD operations
    async create(tableName, item) {
        const params = {
            TableName: this.tables[tableName],
            Item: {
                ...item,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        };

        try {
            await dynamodb.put(params).promise();
            return { success: true, data: item };
        } catch (error) {
            console.error('DynamoDB Create Error:', error);
            return { success: false, error: error.message };
        }
    }

    async read(tableName, key) {
        const params = {
            TableName: this.tables[tableName],
            Key: key
        };

        try {
            const result = await dynamodb.get(params).promise();
            return { success: true, data: result.Item };
        } catch (error) {
            console.error('DynamoDB Read Error:', error);
            return { success: false, error: error.message };
        }
    }

    async update(tableName, key, updates) {
        const updateExpression = [];
        const expressionAttributeNames = {};
        const expressionAttributeValues = {};

        // Build update expression
        Object.keys(updates).forEach((attr, index) => {
            updateExpression.push(`#attr${index} = :val${index}`);
            expressionAttributeNames[`#attr${index}`] = attr;
            expressionAttributeValues[`:val${index}`] = updates[attr];
        });

        updateExpression.push('#updatedAt = :updatedAt');
        expressionAttributeNames['#updatedAt'] = 'updatedAt';
        expressionAttributeValues[':updatedAt'] = new Date().toISOString();

        const params = {
            TableName: this.tables[tableName],
            Key: key,
            UpdateExpression: `SET ${updateExpression.join(', ')}`,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: 'ALL_NEW'
        };

        try {
            const result = await dynamodb.update(params).promise();
            return { success: true, data: result.Attributes };
        } catch (error) {
            console.error('DynamoDB Update Error:', error);
            return { success: false, error: error.message };
        }
    }

    async delete(tableName, key) {
        const params = {
            TableName: this.tables[tableName],
            Key: key
        };

        try {
            await dynamodb.delete(params).promise();
            return { success: true };
        } catch (error) {
            console.error('DynamoDB Delete Error:', error);
            return { success: false, error: error.message };
        }
    }

    async query(tableName, indexName, keyCondition, filterExpression = null) {
        const params = {
            TableName: this.tables[tableName],
            IndexName: indexName,
            KeyConditionExpression: keyCondition.expression,
            ExpressionAttributeNames: keyCondition.names,
            ExpressionAttributeValues: keyCondition.values
        };

        if (filterExpression) {
            params.FilterExpression = filterExpression.expression;
            params.ExpressionAttributeNames = {
                ...params.ExpressionAttributeNames,
                ...filterExpression.names
            };
            params.ExpressionAttributeValues = {
                ...params.ExpressionAttributeValues,
                ...filterExpression.values
            };
        }

        try {
            const result = await dynamodb.query(params).promise();
            return { success: true, data: result.Items };
        } catch (error) {
            console.error('DynamoDB Query Error:', error);
            return { success: false, error: error.message };
        }
    }

    // User-specific methods
    async createUser(userData) {
        return await this.create('users', {
            userId: userData.userId,
            email: userData.email,
            name: userData.name,
            plan: userData.plan || 'basic',
            stripeCustomerId: userData.stripeCustomerId,
            ...userData
        });
    }

    async getUser(userId) {
        return await this.read('users', { userId });
    }

    async updateUser(userId, updates) {
        return await this.update('users', { userId }, updates);
    }

    // Home-specific methods
    async createHome(homeData) {
        return await this.create('homes', {
            homeId: homeData.homeId,
            userId: homeData.userId,
            address: homeData.address,
            squareFootage: homeData.squareFootage,
            yearBuilt: homeData.yearBuilt,
            ...homeData
        });
    }

    async getHomesByUser(userId) {
        return await this.query('homes', 'UserIdIndex', {
            expression: 'userId = :userId',
            names: {},
            values: { ':userId': userId }
        });
    }

    // Task-specific methods
    async createTask(taskData) {
        return await this.create('tasks', {
            taskId: taskData.taskId,
            userId: taskData.userId,
            title: taskData.title,
            description: taskData.description,
            dueDate: taskData.dueDate,
            completed: taskData.completed || false,
            ...taskData
        });
    }

    async getTasksByUser(userId) {
        return await this.query('tasks', 'UserIdIndex', {
            expression: 'userId = :userId',
            names: {},
            values: { ':userId': userId }
        });
    }

    // Service Record methods
    async createServiceRecord(recordData) {
        return await this.create('serviceRecords', {
            recordId: recordData.recordId,
            userId: recordData.userId,
            serviceType: recordData.serviceType,
            description: recordData.description,
            date: recordData.date,
            cost: recordData.cost,
            ...recordData
        });
    }

    async getServiceRecordsByUser(userId) {
        return await this.query('serviceRecords', 'UserIdIndex', {
            expression: 'userId = :userId',
            names: {},
            values: { ':userId': userId }
        });
    }
}

// Cognito Service Class
class CognitoService {
    constructor() {
        this.userPoolId = COGNITO_CONFIG.userPoolId;
        this.clientId = COGNITO_CONFIG.clientId;
    }

    async signUp(email, password, userAttributes = {}) {
        const params = {
            ClientId: this.clientId,
            Username: email,
            Password: password,
            UserAttributes: [
                { Name: 'email', Value: email },
                ...Object.keys(userAttributes).map(key => ({
                    Name: key,
                    Value: userAttributes[key]
                }))
            ]
        };

        try {
            const result = await cognito.signUp(params).promise();
            return { success: true, data: result };
        } catch (error) {
            console.error('Cognito SignUp Error:', error);
            return { success: false, error: error.message };
        }
    }

    async confirmSignUp(email, confirmationCode) {
        const params = {
            ClientId: this.clientId,
            Username: email,
            ConfirmationCode: confirmationCode
        };

        try {
            const result = await cognito.confirmSignUp(params).promise();
            return { success: true, data: result };
        } catch (error) {
            console.error('Cognito ConfirmSignUp Error:', error);
            return { success: false, error: error.message };
        }
    }

    async signIn(email, password) {
        const params = {
            ClientId: this.clientId,
            AuthFlow: 'USER_PASSWORD_AUTH',
            AuthParameters: {
                USERNAME: email,
                PASSWORD: password
            }
        };

        try {
            const result = await cognito.initiateAuth(params).promise();
            return { success: true, data: result };
        } catch (error) {
            console.error('Cognito SignIn Error:', error);
            return { success: false, error: error.message };
        }
    }

    async signOut(accessToken) {
        const params = {
            AccessToken: accessToken
        };

        try {
            await cognito.globalSignOut(params).promise();
            return { success: true };
        } catch (error) {
            console.error('Cognito SignOut Error:', error);
            return { success: false, error: error.message };
        }
    }

    async getUser(accessToken) {
        const params = {
            AccessToken: accessToken
        };

        try {
            const result = await cognito.getUser(params).promise();
            return { success: true, data: result };
        } catch (error) {
            console.error('Cognito GetUser Error:', error);
            return { success: false, error: error.message };
        }
    }
}

// S3 Service Class
class S3Service {
    constructor() {
        this.buckets = S3_CONFIG.buckets;
    }

    async uploadFile(bucketName, key, file, contentType) {
        const params = {
            Bucket: this.buckets[bucketName],
            Key: key,
            Body: file,
            ContentType: contentType,
            ACL: 'private' // Make files private by default
        };

        try {
            const result = await s3.upload(params).promise();
            return { success: true, data: result };
        } catch (error) {
            console.error('S3 Upload Error:', error);
            return { success: false, error: error.message };
        }
    }

    async downloadFile(bucketName, key) {
        const params = {
            Bucket: this.buckets[bucketName],
            Key: key
        };

        try {
            const result = await s3.getObject(params).promise();
            return { success: true, data: result };
        } catch (error) {
            console.error('S3 Download Error:', error);
            return { success: false, error: error.message };
        }
    }

    async deleteFile(bucketName, key) {
        const params = {
            Bucket: this.buckets[bucketName],
            Key: key
        };

        try {
            await s3.deleteObject(params).promise();
            return { success: true };
        } catch (error) {
            console.error('S3 Delete Error:', error);
            return { success: false, error: error.message };
        }
    }

    async generatePresignedUrl(bucketName, key, operation = 'getObject', expiresIn = 3600) {
        const params = {
            Bucket: this.buckets[bucketName],
            Key: key,
            Expires: expiresIn
        };

        try {
            const url = await s3.getSignedUrlPromise(operation, params);
            return { success: true, data: { url } };
        } catch (error) {
            console.error('S3 Presigned URL Error:', error);
            return { success: false, error: error.message };
        }
    }

    // User photo methods
    async uploadUserPhoto(userId, photoId, file, contentType) {
        const key = `users/${userId}/photos/${photoId}`;
        return await this.uploadFile('userData', key, file, contentType);
    }

    async getUserPhotoUrl(userId, photoId) {
        const key = `users/${userId}/photos/${photoId}`;
        return await this.generatePresignedUrl('userData', key);
    }
}

// Export service instances
module.exports = {
    DynamoDBService,
    CognitoService,
    S3Service,
    // Pre-instantiated services
    db: new DynamoDBService(),
    auth: new CognitoService(),
    storage: new S3Service()
};
