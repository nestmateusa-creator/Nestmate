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
    const { email } = JSON.parse(event.body);

    if (!email) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Email is required' }),
      };
    }

    console.log('🔍 Debugging Stripe customer for:', email);

    // Search for customers by email
    const customers = await stripe.customers.list({
      email: email,
      limit: 10,
    });

    console.log('👥 Found customers:', customers.data.length);

    let result = {
      email: email,
      customersFound: customers.data.length,
      customers: []
    };

    for (const customer of customers.data) {
      console.log('👤 Customer:', customer.id, customer.email);
      
      // Get subscriptions for this customer
      const subscriptions = await stripe.subscriptions.list({
        customer: customer.id,
        limit: 10,
      });

      console.log('💳 Subscriptions for customer:', subscriptions.data.length);

      const customerData = {
        id: customer.id,
        email: customer.email,
        created: customer.created,
        subscriptions: subscriptions.data.map(sub => ({
          id: sub.id,
          status: sub.status,
          current_period_start: sub.current_period_start,
          current_period_end: sub.current_period_end,
          items: sub.items.data.map(item => ({
            price_id: item.price.id,
            unit_amount: item.price.unit_amount,
            currency: item.price.currency
          }))
        }))
      };

      result.customers.push(customerData);
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(result),
    };

  } catch (error) {
    console.error('❌ Error debugging Stripe customer:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: 'Failed to debug Stripe customer',
        details: error.message 
      }),
    };
  }
};
