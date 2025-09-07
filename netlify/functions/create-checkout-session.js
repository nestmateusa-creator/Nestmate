// VERSION 3.0 - COMPLETELY NEW APPROACH
const API_KEY = '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';
console.log('VERSION 3.0 - CHECKOUT SESSION - Using LIVE API Key:', API_KEY.substring(0, 20) + '...' + API_KEY.substring(API_KEY.length - 10));
const stripe = require('stripe')(API_KEY);

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
    console.log('Event body:', event.body);
    console.log('Event headers:', event.headers);
    
    const { planType, amount, currency = 'usd', customerEmail } = JSON.parse(event.body);
    
    console.log('Creating checkout session for:', { planType, amount, currency });
    
    // Validate required fields
    if (!planType || !amount) {
      throw new Error('Missing required fields: planType and amount are required');
    }
    
    // Create a checkout session
    const sessionConfig = {
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: `NestMate ${planType.charAt(0).toUpperCase() + planType.slice(1)} Plan`,
              description: `Monthly subscription to NestMate ${planType} plan`,
            },
            unit_amount: amount, // Amount in cents
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${event.headers.origin || 'https://www.nestmateus.com'}/payment-confirmation.html?payment=success&plan=${planType}`,
      cancel_url: `${event.headers.origin || 'https://www.nestmateus.com'}/upgrade-${planType}.html?payment=cancelled`,
      metadata: {
        planType: planType,
        customerEmail: customerEmail || 'unknown'
      }
    };

    // Add customer email if provided
    if (customerEmail) {
      sessionConfig.customer_email = customerEmail;
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    console.log('Checkout session created:', session.id);
    console.log('Session URL:', session.url);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId: session.id,
        url: session.url
      }),
    };
  } catch (err) {
    console.error('Error creating checkout session:', err);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: err.message,
        type: err.type || 'unknown_error'
      }),
    };
  }
};
