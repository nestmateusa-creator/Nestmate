const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const admin = require('firebase-admin');

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: 'nestmate-167ed'
  });
}

const db = admin.firestore();

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

    console.log('🔍 Checking subscription status for:', email);

    // Step 1: Check Firebase userProfiles first
    let firebaseAccountType = 'trial';
    let firebaseUser = null;
    
    try {
      // Find user by email in userProfiles
      const userProfilesQuery = await db.collection('userProfiles')
        .where('email', '==', email)
        .limit(1)
        .get();
      
      if (!userProfilesQuery.empty) {
        firebaseUser = userProfilesQuery.docs[0];
        const userData = firebaseUser.data();
        firebaseAccountType = userData.accountType || 'trial';
        console.log('📊 Firebase account type:', firebaseAccountType);
      }
    } catch (error) {
      console.log('⚠️ Error checking Firebase:', error.message);
    }

    // Step 2: Check Stripe subscription status
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
        
        // Get active subscriptions
        const subscriptions = await stripe.subscriptions.list({
          customer: customer.id,
          status: 'active',
        });

        if (subscriptions.data.length > 0) {
          stripeSubscription = subscriptions.data[0];
          const price = stripeSubscription.items.data[0].price;
          
          // Determine account type based on price
          if (price.unit_amount === 500) { // $5.00
            stripeAccountType = 'basic';
          } else if (price.unit_amount === 1000) { // $10.00
            stripeAccountType = 'pro';
          } else if (price.unit_amount === 1600) { // $16.00
            stripeAccountType = 'advanced';
          }
          
          console.log('💳 Stripe subscription found:', stripeAccountType);
        }
      }
    } catch (error) {
      console.log('⚠️ Error checking Stripe:', error.message);
    }

    // Step 3: Determine the correct account type
    // If Stripe has an active subscription, use that
    // Otherwise, use Firebase data
    let finalAccountType = stripeAccountType !== 'trial' ? stripeAccountType : firebaseAccountType;
    
    // Step 4: If Stripe has a subscription but Firebase doesn't match, update Firebase
    if (stripeAccountType !== 'trial' && firebaseAccountType !== stripeAccountType) {
      console.log('🔄 Syncing Firebase with Stripe subscription...');
      
      if (firebaseUser) {
        const updateData = {
          accountType: stripeAccountType,
          plan: stripeAccountType,
          subscriptionStatus: 'active',
          subscriptionDate: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          stripeCustomerId: customers.data[0].id,
          stripeSubscriptionId: stripeSubscription.id
        };
        
        // Update userProfiles
        await db.collection('userProfiles').doc(firebaseUser.id).set(updateData, { merge: true });
        
        // Update specific collection
        const collectionName = getCollectionName(stripeAccountType);
        await db.collection(collectionName).doc(firebaseUser.id).set(updateData, { merge: true });
        
        finalAccountType = stripeAccountType;
        console.log('✅ Firebase synced with Stripe');
      }
    }

    console.log('✅ Final account type:', finalAccountType);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        accountType: finalAccountType,
        hasActiveSubscription: stripeAccountType !== 'trial',
        firebaseAccountType: firebaseAccountType,
        stripeAccountType: stripeAccountType,
        synced: stripeAccountType !== 'trial' && firebaseAccountType !== stripeAccountType
      }),
    };

  } catch (error) {
    console.error('❌ Error checking subscription:', error);
    
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

function getCollectionName(plan) {
  switch (plan.toLowerCase()) {
    case 'basic':
      return 'Basic User Accounts';
    case 'pro':
      return 'Pro User Accounts';
    case 'advanced':
      return 'Advanced Pro User Accounts';
    default:
      return 'Trial User Accounts';
  }
}
