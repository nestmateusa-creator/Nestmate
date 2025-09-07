const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || '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');

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

  // Only allow POST requests
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
    console.log('Received request:', event.body);
    
    const { amount, currency = 'usd', planType, userId } = JSON.parse(event.body);
    
    console.log('Parsed data:', { amount, currency, planType, userId });
    
    if (!amount) {
      console.log('Amount is missing');
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Amount is required' }),
      };
    }

    console.log('Creating payment intent with Stripe...');
    
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount is already in cents from frontend
      currency: currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        planType: planType || 'unknown',
        userId: userId || 'demo-user'
      }
    });

    console.log('Payment intent created:', paymentIntent.id);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      }),
    };
  } catch (err) {
    console.error('Error creating payment intent:', err);
    console.error('Error details:', {
      message: err.message,
      type: err.type,
      code: err.code,
      stack: err.stack
    });
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: err.message,
        type: err.type || 'unknown_error',
        code: err.code || 'unknown_code'
      }),
    };
  }
};


