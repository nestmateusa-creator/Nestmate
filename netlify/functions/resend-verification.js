const AWS = require('aws-sdk');

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { email } = JSON.parse(event.body);
        
        const cognito = new AWS.CognitoIdentityServiceProvider();
        
        // Resend verification email
        const params = {
            ClientId: process.env.NESTMATE_COGNITO_CLIENT_ID,
            Username: email
        };
        
        await cognito.resendConfirmationCode(params).promise();
        
        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, message: 'Verification email sent' })
        };
        
    } catch (error) {
        console.error('Resend verification error:', error);
        
        let errorMessage = 'Failed to send verification email';
        if (error.code === 'UserNotFoundException') {
            errorMessage = 'User not found';
        } else if (error.code === 'InvalidParameterException') {
            errorMessage = 'Email is already verified';
        } else if (error.code === 'LimitExceededException') {
            errorMessage = 'Too many attempts. Please try again later';
        }
        
        return {
            statusCode: 400,
            body: JSON.stringify({ error: errorMessage })
        };
    }
};
