const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

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
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { userId, email, newPlan } = JSON.parse(event.body);

    if (!userId || !email || !newPlan) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    console.log('Upgrading subscription for user:', email, 'to plan:', newPlan);

    // Find the customer in Stripe
    const customers = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    if (customers.data.length === 0) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Customer not found in Stripe' }),
      };
    }

    const customer = customers.data[0];

    // Get active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'active',
    });

    if (subscriptions.data.length === 0) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'No active subscription found' }),
      };
    }

    const subscription = subscriptions.data[0];

    // Define plan prices (in cents)
    const planPrices = {
      'basic': 500,    // $5.00
      'pro': 1000,     // $10.00
      'advanced': 1600 // $16.00
    };

    const newPrice = planPrices[newPlan];
    if (!newPrice) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Invalid plan specified' }),
      };
    }

    // Create new price for the plan
    const price = await stripe.prices.create({
      unit_amount: newPrice,
      currency: 'usd',
      recurring: { interval: 'month' },
      product_data: {
        name: `NestMate ${newPlan.charAt(0).toUpperCase() + newPlan.slice(1)} Plan`,
      },
    });

    // Update the subscription to the new plan
    const updatedSubscription = await stripe.subscriptions.update(subscription.id, {
      items: [{
        id: subscription.items.data[0].id,
        price: price.id,
      }],
      proration_behavior: 'create_prorations', // This handles prorations automatically
    });

    console.log('Subscription upgraded:', updatedSubscription.id);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        subscriptionId: updatedSubscription.id,
        newPlan: newPlan,
        message: 'Subscription upgraded successfully',
      }),
    };
  } catch (error) {
    console.error('Error upgrading subscription:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: 'Failed to upgrade subscription',
        details: error.message 
      }),
    };
  }
};
