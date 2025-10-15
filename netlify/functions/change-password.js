const AWS = require('aws-sdk');

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { userId, newPassword } = JSON.parse(event.body);
        
        console.log('Password change request for userId:', userId);
        
        // Configure AWS with environment variables
        AWS.config.update({
            accessKeyId: process.env.NESTMATE_AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.NESTMATE_AWS_SECRET_ACCESS_KEY,
            region: process.env.NESTMATE_AWS_REGION
        });
        
        const cognito = new AWS.CognitoIdentityServiceProvider();
        
        // Use adminSetUserPassword with proper error handling
        const params = {
            UserPoolId: process.env.NESTMATE_COGNITO_USER_POOL_ID,
            Username: userId,
            Password: newPassword,
            Permanent: true
        };
        
        console.log('Attempting password change with params:', {
            UserPoolId: params.UserPoolId,
            Username: params.Username,
            Permanent: params.Permanent
        });
        
        const result = await cognito.adminSetUserPassword(params).promise();
        console.log('Password change successful:', result);
        
        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, message: 'Password changed successfully' })
        };
        
    } catch (error) {
        console.error('Password change error:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        
        let errorMessage = 'Failed to change password';
        if (error.code === 'InvalidPasswordException') {
            errorMessage = 'New password does not meet requirements (must be at least 8 characters with uppercase, lowercase, numbers, and special characters)';
        } else if (error.code === 'LimitExceededException') {
            errorMessage = 'Too many attempts. Please try again later';
        } else if (error.code === 'UserNotFoundException') {
            errorMessage = 'User not found';
        } else if (error.code === 'NotAuthorizedException') {
            errorMessage = 'Insufficient permissions to change password';
        } else if (error.code === 'InvalidParameterException') {
            errorMessage = 'Invalid parameters provided';
        }
        
        return {
            statusCode: 400,
            body: JSON.stringify({ 
                error: errorMessage,
                code: error.code,
                details: error.message 
            })
        };
    }
};
