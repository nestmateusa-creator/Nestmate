// VERSION 2.0 - Force redeploy with correct live key
const API_KEY = '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';
console.log('VERSION 2.0 - Using LIVE API Key:', API_KEY.substring(0, 20) + '...' + API_KEY.substring(API_KEY.length - 10));
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
    console.log('Environment variables check:');
    console.log('STRIPE_SECRET_KEY exists:', !!process.env.STRIPE_SECRET_KEY);
    console.log('STRIPE_SECRET_KEY length:', process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY.length : 0);
    
    const { planType, successUrl, cancelUrl, currency = 'usd' } = JSON.parse(event.body);
    
    // Set amount based on plan type
    let amount;
    switch(planType) {
      case 'basic':
        amount = 500; // $5.00 in cents
        break;
      case 'pro':
        amount = 1000; // $10.00 in cents
        break;
      case 'advanced':
        amount = 1600; // $16.00 in cents
        break;
      default:
        throw new Error('Invalid plan type');
    }
    
    console.log('Creating payment link for:', { planType, amount, currency });
    
    // Create a payment link
    const paymentLink = await stripe.paymentLinks.create({
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
      after_completion: {
        type: 'redirect',
        redirect: {
          url: `${event.headers.origin || 'https://www.nestmateus.com'}/payment-confirmation.html?payment=success&plan=${planType}`,
        },
      },
    });

    console.log('Payment link created:', paymentLink.id);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: paymentLink.url
      }),
    };
  } catch (err) {
    console.error('Error creating payment link:', err);
    
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
