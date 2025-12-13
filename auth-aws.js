// AWS Authentication System for NestMate
// This file handles all authentication using AWS Cognito

// Initialize AWS services
let cognito, dynamodb;
let awsInitialized = false;

function initAWSServices() {
    if (typeof AWS !== 'undefined' && AWS && AWS.CognitoIdentityServiceProvider && AWS.DynamoDB) {
        try {
            // AWS Configuration - Set credentials directly for browser environment
            AWS.config.update({
                region: 'us-east-2',
                accessKeyId: 'AKIAXBLPTGPR44FNAHUL',
                secretAccessKey: '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'
            });
            
            cognito = new AWS.CognitoIdentityServiceProvider();
            dynamodb = new AWS.DynamoDB.DocumentClient();
            // Make dynamodb globally accessible
            window.dynamodb = dynamodb;
            awsInitialized = true;
            console.log('AWS services initialized successfully');
            return true;
        } catch (error) {
            console.error('Error initializing AWS services:', error);
            return false;
        }
    }
    return false;
}

// Function to wait for AWS SDK to load
function waitForAWSSDK() {
    let attempts = 0;
    const maxAttempts = 100; // 10 seconds max wait
    
    function checkAWS() {
        if (initAWSServices()) {
            console.log('AWS services initialized after wait');
            // Trigger any waiting initialization
            if (window.onAWSSDKReady) {
                window.onAWSSDKReady();
            }
        } else if (attempts < maxAttempts) {
            attempts++;
            setTimeout(checkAWS, 100);
        } else {
            console.error('AWS SDK not loaded after timeout');
            // Create minimal stubs to prevent errors
            cognito = { 
                signUp: function() { return { promise: () => Promise.reject(new Error('AWS not available')) }; },
                initiateAuth: function() { return { promise: () => Promise.reject(new Error('AWS not available')) }; },
                getUser: function() { return { promise: () => Promise.reject(new Error('AWS not available')) }; },
                globalSignOut: function() { return { promise: () => Promise.reject(new Error('AWS not available')) }; },
                confirmSignUp: function() { return { promise: () => Promise.reject(new Error('AWS not available')) }; },
                resendConfirmationCode: function() { return { promise: () => Promise.reject(new Error('AWS not available')) }; }
            };
            dynamodb = { 
                get: function() { return { promise: () => Promise.reject(new Error('AWS not available')) }; },
                put: function() { return { promise: () => Promise.reject(new Error('AWS not available')) }; },
                update: function() { return { promise: () => Promise.reject(new Error('AWS not available')) }; }
            };
        }
    }
    
    // Start checking immediately
    checkAWS();
}

// Try to initialize immediately
if (!initAWSServices()) {
    // If AWS SDK not loaded yet, wait for it
    waitForAWSSDK();
    
    // Also listen for when AWS SDK loads (if it loads after this script)
    const originalOnLoad = window.onload;
    window.addEventListener('load', function() {
        if (!awsInitialized) {
            setTimeout(initAWSServices, 100);
        }
    });
}

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

    // Helper to check if AWS services are available and wait if needed
    async _ensureAWSAvailable(service, method, serviceName = 'AWS') {
        console.log(`_ensureAWSAvailable called for ${serviceName}.${method}`);
        console.log('Current cognito:', cognito);
        console.log('Current dynamodb:', dynamodb);
        console.log('AWS defined:', typeof AWS !== 'undefined');
        console.log('AWS.CognitoIdentityServiceProvider:', typeof AWS !== 'undefined' && AWS.CognitoIdentityServiceProvider);
        
        // Always check the global variables, not the parameter
        let targetService = serviceName.includes('Cognito') ? cognito : dynamodb;
        
        // If service is not available, try to initialize
        if (!targetService || typeof targetService[method] !== 'function') {
            console.log('Service not available, attempting to initialize...');
            
            // Try to initialize multiple times
            for (let i = 0; i < 50; i++) {
                if (typeof AWS !== 'undefined' && AWS.CognitoIdentityServiceProvider && AWS.DynamoDB) {
                    const initialized = initAWSServices();
                    if (initialized) {
                        console.log('AWS services initialized in _ensureAWSAvailable');
                        // Update target service reference
                        targetService = serviceName.includes('Cognito') ? cognito : dynamodb;
                        // Check if it's now available
                        if (targetService && typeof targetService[method] === 'function') {
                            console.log('Service is now available!');
                            return;
                        }
                    }
                }
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            // Final check - update references
            targetService = serviceName.includes('Cognito') ? cognito : dynamodb;
            
            if (!targetService || typeof targetService[method] !== 'function') {
                console.error(`${serviceName} service still not available after waiting`);
                console.error('Final cognito:', cognito);
                console.error('Final dynamodb:', dynamodb);
                throw new Error(`${serviceName} service not available. Please check your AWS account status and ensure AWS SDK is loaded.`);
            }
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
            await this._ensureAWSAvailable(cognito, 'signUp', 'AWS Cognito');
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
        console.log('=== SIGN IN START ===');
        console.log('Email:', email);
        console.log('Cognito object:', cognito);
        console.log('AWS initialized:', awsInitialized);
        console.log('AWS defined:', typeof AWS !== 'undefined');
        
        try {
            // Ensure AWS is ready
            await this._ensureAWSAvailable(cognito, 'initiateAuth', 'AWS Cognito');
            
            const params = {
                AuthFlow: 'USER_PASSWORD_AUTH',
                ClientId: COGNITO_CONFIG.clientId,
                AuthParameters: {
                    USERNAME: email,
                    PASSWORD: password
                }
            };
            
            console.log('Calling cognito.initiateAuth with params:', { ...params, AuthParameters: { USERNAME: email, PASSWORD: '***' } });
            const result = await cognito.initiateAuth(params).promise();
            console.log('Cognito initiateAuth result:', result);
            
            // Store tokens
            this.accessToken = result.AuthenticationResult.AccessToken;
            this.refreshToken = result.AuthenticationResult.RefreshToken;
            
            // Store in localStorage (handle both sync and async)
            const setAccessToken = localStorage.setItem('awsAccessToken', this.accessToken);
            const setRefreshToken = localStorage.setItem('awsRefreshToken', this.refreshToken);
            // If they return promises, wait for them
            if (setAccessToken instanceof Promise) await setAccessToken;
            if (setRefreshToken instanceof Promise) await setRefreshToken;
            
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
                await this._ensureAWSAvailable(cognito, 'globalSignOut', 'AWS Cognito');
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

            await this._ensureAWSAvailable(cognito, 'confirmSignUp', 'AWS Cognito');
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

            await this._ensureAWSAvailable(cognito, 'resendConfirmationCode', 'AWS Cognito');
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
                // Handle both sync and async localStorage.getItem
                const tokenValue = localStorage.getItem('awsAccessToken');
                if (tokenValue instanceof Promise) {
                    this.accessToken = await tokenValue;
                } else {
                    this.accessToken = tokenValue;
                }
                if (!this.accessToken || this.accessToken === 'null' || this.accessToken === 'undefined') {
                    return null;
                }
            }

            // Ensure accessToken is a string
            if (typeof this.accessToken !== 'string') {
                console.error('AccessToken is not a string:', typeof this.accessToken, this.accessToken);
                return null;
            }

            const params = {
                AccessToken: this.accessToken
            };

            await this._ensureAWSAvailable(cognito, 'getUser', 'AWS Cognito');
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

            await this._ensureAWSAvailable(cognito, 'initiateAuth', 'AWS Cognito');
            // Use global cognito variable after ensuring it's available
            if (!cognito || typeof cognito.initiateAuth !== 'function') {
                throw new Error('AWS Cognito service not initialized. Please refresh the page and try again.');
            }
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

            await this._ensureAWSAvailable(dynamodb, 'put', 'AWS DynamoDB');
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

            await this._ensureAWSAvailable(dynamodb, 'update', 'AWS DynamoDB');
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

            await this._ensureAWSAvailable(dynamodb, 'get', 'AWS DynamoDB');
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
