const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const AWS = require('aws-sdk');

AWS.config.update({
  region: process.env.NESTMATE_AWS_REGION || 'us-east-2',
  accessKeyId: process.env.NESTMATE_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.NESTMATE_AWS_SECRET_ACCESS_KEY,
});

const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
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
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const { userId } = JSON.parse(event.body);
    
    if (!userId) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'User ID is required' }),
      };
    }
    
    // Get user's Stripe customer ID from DynamoDB
    const userParams = {
      TableName: process.env.NESTMATE_DDB_USERS_TABLE || 'nestmate-users',
      Key: { userId: userId }
    };
    
    const userResult = await dynamodb.get(userParams).promise();
    const user = userResult.Item;
    
    if (!user || !user.stripeCustomerId) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'No Stripe customer found' })
      };
    }
    
    // Create Stripe customer portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${event.headers.origin || process.env.SITE_URL || 'https://yourdomain.com'}/payment-management.html`,
    });
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: session.url })
    };
    
  } catch (error) {
    console.error('Customer portal error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Failed to create customer portal session' })
    };
  }
};