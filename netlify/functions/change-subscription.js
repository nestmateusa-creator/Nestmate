const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const AWS = require('aws-sdk');

AWS.config.update({
  region: process.env.NESTMATE_AWS_REGION || 'us-east-2',
  accessKeyId: process.env.NESTMATE_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.NESTMATE_AWS_SECRET_ACCESS_KEY,
});

const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
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
    const { subscriptionId, newPriceId, userId, plan } = JSON.parse(event.body);

    if (!subscriptionId || !newPriceId) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Subscription ID and new price ID are required' }),
      };
    }

    // Get current subscription
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    // Update subscription with new price
    const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
      items: [{
        id: subscription.items.data[0].id,
        price: newPriceId,
      }],
      proration_behavior: 'always_invoice', // Prorate the change
    });

    // Map plan to subscription type
    const planMap = {
      basic: 'basic',
      advanced: 'pro',
      'advanced-pro': 'advanced-pro',
      enterprise: 'enterprise',
    };

    const subscriptionType = planMap[plan] || 'basic';

    // Update user record in DynamoDB
    if (userId) {
      const updateParams = {
        TableName: process.env.NESTMATE_DDB_USERS_TABLE || 'nestmate-users',
        Key: { userId },
        UpdateExpression: 'SET subscription = :sub, updatedAt = :updated',
        ExpressionAttributeValues: {
          ':sub': subscriptionType,
          ':updated': new Date().toISOString(),
        },
      };

      await ddb.update(updateParams).promise();
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        subscriptionId: updatedSubscription.id,
        plan: subscriptionType,
      }),
    };
  } catch (error) {
    console.error('Change subscription error:', error);
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

