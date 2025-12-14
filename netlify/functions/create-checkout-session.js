const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const AWS = require('aws-sdk');

AWS.config.update({
  region: process.env.NESTMATE_AWS_REGION || 'us-east-2',
  accessKeyId: process.env.NESTMATE_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.NESTMATE_AWS_SECRET_ACCESS_KEY,
});

const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  // Handle CORS preflight requests
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
    const { productId, priceId, plan, isYearly, userId, email } = JSON.parse(event.body);

    // Get price ID from product if productId provided
    let finalPriceId = priceId;
    if (productId && !priceId) {
      // Fetch the product and get its default price
      const product = await stripe.products.retrieve(productId);
      // Get prices for this product
      const prices = await stripe.prices.list({
        product: productId,
        active: true,
      });
      
      if (prices.data.length === 0) {
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({ error: 'No active prices found for this product' }),
        };
      }
      
      // Use the first active price (or filter by recurring/monthly/yearly if needed)
      finalPriceId = prices.data[0].id;
    }

    if (!finalPriceId) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Price ID or Product ID is required' }),
      };
    }

    // Get or create Stripe customer
    let customerId = null;
    if (userId && email) {
      // Check if user already has a Stripe customer ID
      try {
        const userParams = {
          TableName: process.env.NESTMATE_DDB_USERS_TABLE || 'nestmate-users',
          Key: { userId },
        };
        const userResult = await ddb.get(userParams).promise();
        const user = userResult.Item;

        if (user && user.stripeCustomerId) {
          customerId = user.stripeCustomerId;
        } else {
          // Create new Stripe customer
          const customer = await stripe.customers.create({
            email: email,
            metadata: {
              userId: userId,
            },
          });
          customerId = customer.id;

          // Save customer ID to user record
          if (user) {
            const updateParams = {
              TableName: process.env.NESTMATE_DDB_USERS_TABLE || 'nestmate-users',
              Key: { userId },
              UpdateExpression: 'SET stripeCustomerId = :customerId, updatedAt = :updated',
              ExpressionAttributeValues: {
                ':customerId': customerId,
                ':updated': new Date().toISOString(),
              },
            };
            await ddb.update(updateParams).promise();
          }
        }
      } catch (error) {
        console.error('Error getting/creating customer:', error);
        // Continue without customer ID - Stripe will create one
      }
    }

    // Create checkout session
    const sessionConfig = {
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: finalPriceId,
          quantity: 1,
        },
      ],
      success_url: `${event.headers.origin || process.env.SITE_URL || 'https://yourdomain.com'}/payment-success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${event.headers.origin || process.env.SITE_URL || 'https://yourdomain.com'}/payment-cancel.html`,
      metadata: {
        plan: plan || 'basic',
        userId: userId || '',
      },
    };

    // Add 14-day free trial for basic plan (monthly only, not yearly)
    if (plan === 'basic' && !isYearly) {
      sessionConfig.subscription_data = {
        trial_period_days: 14,
      };
    }

    if (customerId) {
      sessionConfig.customer = customerId;
    } else if (email) {
      sessionConfig.customer_email = email;
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: session.id, url: session.url }),
    };
  } catch (error) {
    console.error('Error creating checkout session:', error);
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