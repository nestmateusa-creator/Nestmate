const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const AWS = require('aws-sdk');

AWS.config.update({
  region: process.env.NESTMATE_AWS_REGION || 'us-east-2',
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

  async function setStatusByCustomer(customerId, status) {
    try {
      // We store Cognito sub (userId) in metadata.userId on subscription/customer when possible.
      const userId = obj?.metadata?.userId || obj?.customer_email || null;
      if (!userId) return;
      // If metadata.userId is an email, we can not key by it. This is a simplified fallback.
      // For now, only handle real userId values (UUID from Cognito) set via success page or future server flows.
      if (userId.includes('@')) return;
      await ddb.update({
        TableName: 'nestmate-users',
        Key: { userId },
        UpdateExpression: 'SET subscriptionStatus = :st',
        ExpressionAttributeValues: { ':st': status },
      }).promise();
    } catch (e) {
      console.error('Failed to update subscriptionStatus', e.message);
    }
  }

  switch (type) {
    case 'invoice.payment_failed':
    case 'customer.subscription.deleted':
    case 'customer.subscription.paused':
      await setStatusByCustomer(obj.customer, 'inactive');
      break;
    case 'invoice.payment_succeeded':
    case 'customer.subscription.resumed':
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      await setStatusByCustomer(obj.customer, 'active');
      break;
    default:
      break;
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};


