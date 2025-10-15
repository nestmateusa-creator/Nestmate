const AWS = require('aws-sdk');

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { userId, name, phone } = JSON.parse(event.body);
        
        const cognito = new AWS.CognitoIdentityServiceProvider();
        const dynamodb = new AWS.DynamoDB.DocumentClient();
        
        // Update Cognito user attributes
        const cognitoParams = {
            UserPoolId: process.env.NESTMATE_COGNITO_USER_POOL_ID,
            Username: userId,
            UserAttributes: [
                { Name: 'name', Value: name },
                { Name: 'phone_number', Value: phone }
            ]
        };
        
        await cognito.adminUpdateUserAttributes(cognitoParams).promise();
        
        // Update DynamoDB user record
        const dynamoParams = {
            TableName: process.env.NESTMATE_DDB_USERS_TABLE,
            Key: { userId: userId },
            UpdateExpression: 'SET #name = :name, phone = :phone, lastUpdated = :timestamp',
            ExpressionAttributeNames: {
                '#name': 'name'
            },
            ExpressionAttributeValues: {
                ':name': name,
                ':phone': phone,
                ':timestamp': new Date().toISOString()
            },
            ReturnValues: 'UPDATED_NEW'
        };
        
        await dynamodb.update(dynamoParams).promise();
        
        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, message: 'Profile updated successfully' })
        };
        
    } catch (error) {
        console.error('Profile update error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to update profile' })
        };
    }
};
