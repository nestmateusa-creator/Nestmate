const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const AWS = require('aws-sdk');

AWS.config.update({
  region: process.env.NESTMATE_AWS_REGION || 'us-east-2',
  accessKeyId: process.env.NESTMATE_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.NESTMATE_AWS_SECRET_ACCESS_KEY,
});

const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  // Handle CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { sessionId } = JSON.parse(event.body);

    if (!sessionId) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Session ID is required' }),
      };
    }

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription', 'customer'],
    });

    if (!session || session.payment_status !== 'paid') {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Payment not completed' }),
      };
    }

    // Get subscription details
    const subscription = await stripe.subscriptions.retrieve(session.subscription, {
      expand: ['default_payment_method'],
    });

    const customerId = session.customer;
    const subscriptionId = session.subscription;
    const plan = session.metadata?.plan || 'basic';

    // Map plan to subscription type
    const planMap = {
      basic: 'basic',
      advanced: 'pro',
      'advanced-pro': 'advanced-pro',
      enterprise: 'enterprise',
    };

    const subscriptionType = planMap[plan] || 'basic';

    // Get user ID from metadata or customer email
    let userId = session.metadata?.userId;
    
    if (!userId) {
      // Try to find user by email
      const customer = await stripe.customers.retrieve(customerId);
      const email = customer.email;
      
      // Query DynamoDB by email (assuming you have an email-index GSI)
      const queryParams = {
        TableName: process.env.NESTMATE_DDB_USERS_TABLE || 'nestmate-users',
        IndexName: 'email-index',
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: {
          ':email': email,
        },
      };

      try {
        const result = await ddb.query(queryParams).promise();
        if (result.Items && result.Items.length > 0) {
          userId = result.Items[0].userId;
        }
      } catch (error) {
        console.error('Error querying by email:', error);
      }
    }

    if (!userId) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'User not found' }),
      };
    }

    // Update user record in DynamoDB
    const updateParams = {
      TableName: process.env.NESTMATE_DDB_USERS_TABLE || 'nestmate-users',
      Key: { userId },
      UpdateExpression: 'SET subscription = :sub, subscriptionStatus = :status, stripeCustomerId = :customerId, stripeSubscriptionId = :subscriptionId, lastPayment = :payment, paymentFailedAt = :null, isLocked = :false, updatedAt = :updated',
      ExpressionAttributeValues: {
        ':sub': subscriptionType,
        ':status': 'active',
        ':customerId': customerId,
        ':subscriptionId': subscriptionId,
        ':payment': new Date().toISOString(),
        ':null': null,
        ':false': false,
        ':updated': new Date().toISOString(),
      },
      ReturnValues: 'ALL_NEW',
    };

    await ddb.update(updateParams).promise();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        plan: subscriptionType,
        subscriptionId,
        customerId,
      }),
    };
  } catch (error) {
    console.error('Payment success error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
};

