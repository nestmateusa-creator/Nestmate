const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const AWS = require('aws-sdk');

AWS.config.update({
  region: process.env.NESTMATE_AWS_REGION || 'us-east-2',
  accessKeyId: process.env.NESTMATE_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.NESTMATE_AWS_SECRET_ACCESS_KEY,
});

const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const sig = event.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(event.body, sig, endpointSecret);
  } catch (err) {
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  const type = stripeEvent.type;
  const obj = stripeEvent.data.object;

  // Get user ID from customer
  async function getUserIdFromCustomer(customerId) {
    try {
      // Get customer from Stripe
      const customer = await stripe.customers.retrieve(customerId);
      const userId = customer.metadata?.userId;

      if (userId && !userId.includes('@')) {
        return userId;
      }

      // Try to find by email if userId not in metadata
      if (customer.email) {
        const queryParams = {
          TableName: process.env.NESTMATE_DDB_USERS_TABLE || 'nestmate-users',
          IndexName: 'email-index',
          KeyConditionExpression: 'email = :email',
          ExpressionAttributeValues: {
            ':email': customer.email,
          },
        };

        const result = await ddb.query(queryParams).promise();
        if (result.Items && result.Items.length > 0) {
          return result.Items[0].userId;
        }
      }

      return null;
    } catch (error) {
      console.error('Error getting userId from customer:', error);
      return null;
    }
  }

  // Update user status
  async function updateUserStatus(customerId, status, paymentFailed = false) {
    try {
      const userId = await getUserIdFromCustomer(customerId);
      if (!userId) {
        console.log('Could not find userId for customer:', customerId);
        return;
      }

      const updateExpression = paymentFailed
        ? 'SET subscriptionStatus = :status, paymentFailedAt = :failed, updatedAt = :updated'
        : 'SET subscriptionStatus = :status, paymentFailedAt = :null, isLocked = :false, lastPayment = :payment, updatedAt = :updated';

      const expressionValues = paymentFailed
        ? {
            ':status': 'inactive',
            ':failed': new Date().toISOString(),
            ':updated': new Date().toISOString(),
          }
        : {
            ':status': 'active',
            ':null': null,
            ':false': false,
            ':payment': new Date().toISOString(),
            ':updated': new Date().toISOString(),
          };

      await ddb.update({
        TableName: process.env.NESTMATE_DDB_USERS_TABLE || 'nestmate-users',
        Key: { userId },
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionValues,
      }).promise();

      console.log(`Updated user ${userId} status to ${status}`);
    } catch (error) {
      console.error('Failed to update user status:', error.message);
    }
  }

  // Handle different webhook events
  switch (type) {
    case 'invoice.payment_failed':
      await updateUserStatus(obj.customer, 'inactive', true);
      break;

    case 'customer.subscription.deleted':
    case 'customer.subscription.paused':
      await updateUserStatus(obj.customer, 'inactive', false);
      break;

    case 'invoice.payment_succeeded':
    case 'customer.subscription.resumed':
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      await updateUserStatus(obj.customer, 'active', false);
      break;

    default:
      console.log(`Unhandled event type: ${type}`);
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};


