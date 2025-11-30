// AWS Authentication System for NestMate
// This file handles all authentication using AWS Cognito

// Wait for AWS SDK to load, with fallback
(function() {
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds max wait
    
    function initAWS() {
        if (typeof AWS !== 'undefined' && AWS.config) {
            try {
                // AWS Configuration - Set credentials directly for browser environment
                AWS.config.update({
                    region: 'us-east-2',
                    accessKeyId: 'AKIAXBLPTGPR44FNAHUL',
                    secretAccessKey: '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'
                });
                
                window.awsCognito = new AWS.CognitoIdentityServiceProvider();
                window.awsDynamoDB = new AWS.DynamoDB.DocumentClient();
                console.log('AWS services initialized successfully');
            } catch (error) {
                console.error('Error initializing AWS services:', error);
                // Create stub objects to prevent errors
                window.awsCognito = { signUp: function() {}, signIn: function() {} };
                window.awsDynamoDB = { get: function() {}, put: function() {} };
            }
        } else if (attempts < maxAttempts) {
            attempts++;
            setTimeout(initAWS, 100);
        } else {
            console.warn('AWS SDK not loaded after timeout, using fallback stubs');
            window.awsCognito = { signUp: function() {}, signIn: function() {} };
            window.awsDynamoDB = { get: function() {}, put: function() {} };
        }
    }
    
    // Start initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAWS);
    } else {
        initAWS();
    }
})();

// Use window objects for compatibility
const cognito = window.awsCognito || {};
const dynamodb = window.awsDynamoDB || {};

// Cognito Configuration
const COGNITO_CONFIG = {
    userPoolId: 'us-east-2_2aUT3c65F',
    clientId: '3a603s7kgoc0e47cjjtj1nugfe',
    clientSecret: ''
};

class NestMateAuth {
    constructor() {
        this.currentUser = null;
        this.accessToken = null;
        this.refreshToken = null;
    }

    // Helper to check if AWS services are available
    _checkAWSAvailable(service, method) {
        if (!service || typeof service[method] !== 'function') {
            throw new Error(`AWS ${service === cognito ? 'Cognito' : 'DynamoDB'} service not available. Please check your AWS account status.`);
        }
    }

    // Sign up a new user
    async signUp(email, password, userData = {}) {
        console.log('=== SIGNUP START ===');
        console.log('Email:', email);
        console.log('UserData:', userData);
        
        try {
            console.log('Step 1: Preparing Cognito signup parameters...');
            const attrs = [
                { Name: 'email', Value: email },
                { Name: 'name', Value: userData.name || '' }
            ];
            if (userData.phone) {
                attrs.push({ Name: 'phone_number', Value: userData.phone });
            }

            const params = {
                ClientId: COGNITO_CONFIG.clientId,
                Username: email,
                Password: password,
                UserAttributes: attrs
            };
            console.log('Cognito params:', params);

            console.log('Step 2: Calling Cognito signUp...');
            if (!cognito || !cognito.signUp || typeof cognito.signUp !== 'function') {
                throw new Error('AWS Cognito service not available. Please check your AWS account status.');
            }
            const result = await cognito.signUp(params).promise();
            console.log('Cognito result:', result);
            
            console.log('Step 3: Creating DynamoDB user record...');
            try {
                await this.createUserRecord({
                    userId: result.UserSub,
                    email: email,
                    name: userData.name || '',
                    phone: userData.phone || '',
                    subscription: 'basic',
                    subscriptionStatus: 'active',
                    createdAt: new Date().toISOString(),
                    lastLogin: new Date().toISOString()
                });
                console.log('✅ DynamoDB record created successfully');
            } catch (dbError) {
                console.error('❌ DynamoDB error:', dbError);
                // Continue anyway - the Cognito user was created
            }

            console.log('Step 4: Signup completed successfully');
            return {
                success: true,
                userSub: result.UserSub,
                needsConfirmation: false,
                message: 'Account created successfully!'
            };
        } catch (error) {
            console.error('❌ SIGNUP ERROR:', error);
            console.error('Error code:', error.code);
            console.error('Error message:', error.message);
            return { 
                success: false, 
                errorCode: error.code,
                error: this.getErrorMessage(error),
                message: this.getErrorMessage(error)
            };
        }
    }

    // Sign in an existing user
    async signIn(email, password) {
        try {
            const params = {
                AuthFlow: 'USER_PASSWORD_AUTH',
                ClientId: COGNITO_CONFIG.clientId,
                AuthParameters: {
                    USERNAME: email,
                    PASSWORD: password
                }
            };

            this._checkAWSAvailable(cognito, 'initiateAuth');
            const result = await cognito.initiateAuth(params).promise();
            
            // Store tokens
            this.accessToken = result.AuthenticationResult.AccessToken;
            this.refreshToken = result.AuthenticationResult.RefreshToken;
            
            // Store in localStorage
            localStorage.setItem('awsAccessToken', this.accessToken);
            localStorage.setItem('awsRefreshToken', this.refreshToken);
            
            // Get user info
            await this.getCurrentUser();
            
            // Update last login
            if (this.currentUser) {
                await this.updateUserRecord(this.currentUser.userId, { 
                    lastLogin: new Date().toISOString() 
                });
            }

            return {
                success: true,
                message: 'Signed in successfully!',
                user: this.currentUser,
                userId: this.currentUser?.userId
            };
        } catch (error) {
            console.error('Sign in error:', error);
            return { 
                success: false, 
                error: this.getErrorMessage(error),
                message: 'Invalid email or password. Please try again.'
            };
        }
    }

    // Sign out the current user
    async signOut() {
        try {
            if (this.accessToken) {
                this._checkAWSAvailable(cognito, 'globalSignOut');
                await cognito.globalSignOut({ AccessToken: this.accessToken }).promise();
            }
            
            // Clear stored data
            this.currentUser = null;
            this.accessToken = null;
            this.refreshToken = null;
            
            localStorage.removeItem('awsAccessToken');
            localStorage.removeItem('awsRefreshToken');
            localStorage.removeItem('currentUser');
            
            return { success: true, message: 'Signed out successfully!' };
        } catch (error) {
            console.error('Sign out error:', error);
            // Even if sign out fails, clear local data
            this.currentUser = null;
            this.accessToken = null;
            this.refreshToken = null;
            
            localStorage.removeItem('awsAccessToken');
            localStorage.removeItem('awsRefreshToken');
            localStorage.removeItem('currentUser');
            
            return { success: true, message: 'Signed out successfully!' };
        }
    }

    // Confirm email with verification code
    async confirmSignUp(email, confirmationCode) {
        try {
            const params = {
                ClientId: COGNITO_CONFIG.clientId,
                Username: email,
                ConfirmationCode: confirmationCode
            };

            this._checkAWSAvailable(cognito, 'confirmSignUp');
            await cognito.confirmSignUp(params).promise();
            return { 
                success: true, 
                message: 'Email confirmed successfully! You can now sign in.' 
            };
        } catch (error) {
            console.error('Confirm sign up error:', error);
            return { 
                success: false, 
                error: this.getErrorMessage(error),
                message: 'Invalid confirmation code. Please try again.'
            };
        }
    }

    // Resend confirmation code
    async resendConfirmationCode(email) {
        try {
            const params = {
                ClientId: COGNITO_CONFIG.clientId,
                Username: email
            };

            this._checkAWSAvailable(cognito, 'resendConfirmationCode');
            await cognito.resendConfirmationCode(params).promise();
            return { 
                success: true, 
                message: 'Confirmation code sent to your email.' 
            };
        } catch (error) {
            console.error('Resend confirmation error:', error);
            return { 
                success: false, 
                error: this.getErrorMessage(error),
                message: 'Failed to resend confirmation code.'
            };
        }
    }

    // Get current user information
    async getCurrentUser() {
        try {
            if (!this.accessToken) {
                this.accessToken = localStorage.getItem('awsAccessToken');
                if (!this.accessToken) {
                    return null;
                }
            }

            const params = {
                AccessToken: this.accessToken
            };

            this._checkAWSAvailable(cognito, 'getUser');
            const result = await cognito.getUser(params).promise();
            
            this.currentUser = {
                userId: result.Username,
                email: result.UserAttributes.find(attr => attr.Name === 'email')?.Value,
                name: result.UserAttributes.find(attr => attr.Name === 'name')?.Value || 'User',
                phone: result.UserAttributes.find(attr => attr.Name === 'phone_number')?.Value || '',
                emailVerified: result.UserAttributes.find(attr => attr.Name === 'email_verified')?.Value === 'true'
            };

            // Store in localStorage
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            
            return this.currentUser;
        } catch (error) {
            console.error('Get current user error:', error);
            // Token might be expired, try to refresh
            if (error.code === 'NotAuthorizedException') {
                await this.refreshAccessToken();
                return await this.getCurrentUser();
            }
            return null;
        }
    }

    // Refresh access token
    async refreshAccessToken() {
        try {
            if (!this.refreshToken) {
                this.refreshToken = localStorage.getItem('awsRefreshToken');
                if (!this.refreshToken) {
                    throw new Error('No refresh token available');
                }
            }

            const params = {
                AuthFlow: 'REFRESH_TOKEN_AUTH',
                ClientId: COGNITO_CONFIG.clientId,
                AuthParameters: {
                    REFRESH_TOKEN: this.refreshToken
                }
            };

            this._checkAWSAvailable(cognito, 'initiateAuth');
            const result = await cognito.initiateAuth(params).promise();
            
            this.accessToken = result.AuthenticationResult.AccessToken;
            localStorage.setItem('awsAccessToken', this.accessToken);
            
            return { success: true };
        } catch (error) {
            console.error('Refresh token error:', error);
            // Refresh failed, user needs to sign in again
            await this.signOut();
            return { success: false, error: 'Session expired. Please sign in again.' };
        }
    }

    // Check if user is authenticated
    async isAuthenticated() {
        try {
            const user = await this.getCurrentUser();
            return user !== null;
        } catch (error) {
            console.error('Authentication check error:', error);
            return false;
        }
    }

    // Create user record in DynamoDB
    async createUserRecord(userData) {
        try {
            const params = {
                TableName: 'nestmate-users',
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

            this._checkAWSAvailable(dynamodb, 'put');
            await dynamodb.put(params).promise();
            return { success: true };
        } catch (error) {
            console.error('Create user record error:', error);
            return { success: false, error: error.message };
        }
    }

    // Update user record in DynamoDB
    async updateUserRecord(userId, updateData) {
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
                TableName: 'nestmate-users',
                Key: { userId: userId },
                UpdateExpression: `SET ${updateExpression.join(', ')}`,
                ExpressionAttributeNames: expressionAttributeNames,
                ExpressionAttributeValues: expressionAttributeValues,
                ReturnValues: 'ALL_NEW'
            };

            this._checkAWSAvailable(dynamodb, 'update');
            const result = await dynamodb.update(params).promise();
            return { success: true, user: result.Attributes };
        } catch (error) {
            console.error('Update user record error:', error);
            return { success: false, error: error.message };
        }
    }

    // Get user record from DynamoDB
    async getUserRecord(userId) {
        try {
            const params = {
                TableName: 'nestmate-users',
                Key: { userId: userId }
            };

            this._checkAWSAvailable(dynamodb, 'get');
            const result = await dynamodb.get(params).promise();
            return { success: true, user: result.Item };
        } catch (error) {
            console.error('Get user record error:', error);
            return { success: false, error: error.message };
        }
    }

    // Get user-friendly error messages
    getErrorMessage(error) {
        switch (error.code) {
            case 'UsernameExistsException':
                return 'An account with this email already exists.';
            case 'InvalidPasswordException':
                return 'Password must be at least 8 characters with uppercase, lowercase, numbers, and symbols.';
            case 'InvalidParameterException':
                return 'Invalid email address format.';
            case 'NotAuthorizedException':
                return 'Invalid email or password.';
            case 'UserNotFoundException':
                return 'No account found with this email address.';
            case 'CodeMismatchException':
                return 'Invalid confirmation code.';
            case 'ExpiredCodeException':
                return 'Confirmation code has expired.';
            case 'LimitExceededException':
                return 'Too many attempts. Please try again later.';
            default:
                return error.message || 'An unexpected error occurred.';
        }
    }

    // Initialize authentication on page load
    async initialize() {
        try {
            // Check if user is already authenticated
            const isAuth = await this.isAuthenticated();
            if (isAuth) {
                console.log('User is authenticated:', this.currentUser);
                return this.currentUser;
            }
            return null;
        } catch (error) {
            console.error('Auth initialization error:', error);
            return null;
        }
    }
}

// Create global instance
const nestMateAuth = new NestMateAuth();

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    nestMateAuth.initialize();
});

// Export for use in other files
window.nestMateAuth = nestMateAuth;
