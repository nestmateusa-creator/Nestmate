const AWS = require('aws-sdk');

// Env vars required (set in Netlify):
// NESTMATE_AWS_REGION
// NESTMATE_AWS_ACCESS_KEY_ID
// NESTMATE_AWS_SECRET_ACCESS_KEY
// NESTMATE_COGNITO_USER_POOL_ID
// NESTMATE_COGNITO_CLIENT_ID
// NESTMATE_DDB_USERS_TABLE (defaults to 'nestmate-users')

AWS.config.update({
  region: process.env.NESTMATE_AWS_REGION || 'us-east-2',
  accessKeyId: process.env.NESTMATE_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.NESTMATE_AWS_SECRET_ACCESS_KEY,
});

const cognito = new AWS.CognitoIdentityServiceProvider();
const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { email, password, name = '', phone = '' } = body;

    if (!email || !password) {
      return { statusCode: 400, body: JSON.stringify({ success: false, message: 'Email and password required' }) };
    }

    // 1) Cognito sign up (no secret on client; do it server-side)
    const signUpParams = {
      ClientId: process.env.NESTMATE_COGNITO_CLIENT_ID,
      Username: email,
      Password: password,
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'name', Value: name },
        ...(phone ? [{ Name: 'phone_number', Value: phone }] : []),
      ],
    };

    const signUpRes = await cognito.signUp(signUpParams).promise();

    // 2) Auto-confirm the user so the flow is frictionless
    try {
      await cognito
        .adminConfirmSignUp({
          UserPoolId: process.env.NESTMATE_COGNITO_USER_POOL_ID,
          Username: email,
        })
        .promise();
    } catch (e) {
      // If already confirmed or lacking permission, continue (user still exists)
      console.warn('adminConfirmSignUp warning:', e.code || e.message);
    }

    const userId = signUpRes.UserSub;

    // 3) Create user record in DynamoDB
    const tableName = process.env.NESTMATE_DDB_USERS_TABLE || 'nestmate-users';
    const now = new Date().toISOString();
    const userItem = {
      userId,
      email,
      name,
      phone,
      subscription: 'basic',
      subscriptionStatus: 'inactive', // activate after Stripe
      createdAt: now,
      lastLogin: now,
      homes: [],
      preferences: {},
    };

    await ddb
      .put({ TableName: tableName, Item: userItem, ConditionExpression: 'attribute_not_exists(userId)' })
      .promise();

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, userId, message: 'Account created' }),
    };
  } catch (error) {
    console.error('cognito-signup error:', error);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, message: error.message || 'Signup failed' }),
    };
  }
};




