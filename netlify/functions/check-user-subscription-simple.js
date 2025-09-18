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

    console.log('🔍 Checking Stripe subscription status for:', email);

    // Check Stripe subscription status
    let stripeSubscription = null;
    let stripeAccountType = 'trial';
    
    try {
      // Find customer in Stripe
      const customers = await stripe.customers.list({
        email: email,
        limit: 1,
      });

      if (customers.data.length > 0) {
        const customer = customers.data[0];
        console.log('👤 Found customer in Stripe:', customer.id);
        
        // Get active and trialing subscriptions
        const subscriptions = await stripe.subscriptions.list({
          customer: customer.id,
          status: 'all',
        });

        // Filter for active or trialing subscriptions
        const validSubscriptions = subscriptions.data.filter(sub => 
          sub.status === 'active' || sub.status === 'trialing'
        );

        if (validSubscriptions.length > 0) {
          stripeSubscription = validSubscriptions[0];
          const price = stripeSubscription.items.data[0].price;
          
          console.log('💳 Found active subscription with price:', price.unit_amount);
          
          // Determine account type based on price
          if (price.unit_amount === 500) { // $5.00
            stripeAccountType = 'basic';
          } else if (price.unit_amount === 1000) { // $10.00
            stripeAccountType = 'pro';
          } else if (price.unit_amount === 1600) { // $16.00
            stripeAccountType = 'advanced';
          }
          
          console.log('✅ Stripe subscription found:', stripeAccountType, 'status:', stripeSubscription.status);
        } else {
          console.log('❌ No active or trialing subscriptions found');
        }
      } else {
        console.log('❌ Customer not found in Stripe');
      }
    } catch (error) {
      console.error('❌ Error checking Stripe:', error);
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          error: 'Failed to check Stripe subscription',
          details: error.message 
        }),
      };
    }

    console.log('✅ Final account type:', stripeAccountType);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        accountType: stripeAccountType,
        hasActiveSubscription: stripeAccountType !== 'trial',
        email: email,
        message: stripeAccountType !== 'trial' ? 
          `Active ${stripeAccountType} subscription found` : 
          'No active subscription found'
      }),
    };

  } catch (error) {
    console.error('❌ Error in subscription check:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: 'Failed to check subscription',
        details: error.message 
      }),
    };
  }
};
