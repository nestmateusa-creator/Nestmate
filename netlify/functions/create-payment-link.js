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
    const { planType, amount, currency = 'usd' } = JSON.parse(event.body);
    
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
          url: `${event.headers.origin || 'https://www.nestmateus.com'}/dashboard-${planType}.html?payment=success`,
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
        paymentLink: paymentLink.url
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
