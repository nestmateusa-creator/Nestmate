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
    const { subscriptionId, userId } = JSON.parse(event.body);

    if (!subscriptionId) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Subscription ID is required' }),
      };
    }

    // Get subscription
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    // Get the latest invoice
    const invoices = await stripe.invoices.list({
      subscription: subscriptionId,
      limit: 1,
    });

    if (invoices.data.length === 0) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'No invoice found' }),
      };
    }

    const latestInvoice = invoices.data[0];

    // Pay the invoice
    try {
      const paidInvoice = await stripe.invoices.pay(latestInvoice.id);

      if (paidInvoice.status === 'paid') {
        // Update user record
        if (userId) {
          const updateParams = {
            TableName: process.env.NESTMATE_DDB_USERS_TABLE || 'nestmate-users',
            Key: { userId },
            UpdateExpression: 'SET subscriptionStatus = :status, paymentFailedAt = :null, isLocked = :false, lastPayment = :payment, updatedAt = :updated',
            ExpressionAttributeValues: {
              ':status': 'active',
              ':null': null,
              ':false': false,
              ':payment': new Date().toISOString(),
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
            message: 'Payment successful',
          }),
        };
      } else {
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({
            success: false,
            error: 'Payment failed. Please update your payment method.',
          }),
        };
      }
    } catch (payError) {
      // Payment failed - update failure timestamp
      if (userId) {
        const updateParams = {
          TableName: process.env.NESTMATE_DDB_USERS_TABLE || 'nestmate-users',
          Key: { userId },
          UpdateExpression: 'SET paymentFailedAt = :failed, updatedAt = :updated',
          ExpressionAttributeValues: {
            ':failed': new Date().toISOString(),
            ':updated': new Date().toISOString(),
          },
        };

        await ddb.update(updateParams).promise();
      }

      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          success: false,
          error: payError.message || 'Payment failed. Please update your payment method.',
        }),
      };
    }
  } catch (error) {
    console.error('Retry payment error:', error);
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

