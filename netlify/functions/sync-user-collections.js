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

    console.log('🔄 Syncing Firebase collections for:', email);

    // Step 1: Find user in Firebase by email
    const userProfilesQuery = await db.collection('userProfiles')
      .where('email', '==', email)
      .limit(1)
      .get();
    
    if (userProfilesQuery.empty) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'User not found in Firebase' }),
      };
    }

    const userDoc = userProfilesQuery.docs[0];
    const userId = userDoc.id;
    const currentUserData = userDoc.data();
    const currentAccountType = currentUserData.accountType || 'trial';

    console.log('👤 Found user in Firebase:', userId, 'current type:', currentAccountType);

    // Step 2: Check Stripe for active/trialing subscriptions
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
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'all',
    });

    // Filter for active or trialing subscriptions
    const validSubscriptions = subscriptions.data.filter(sub => 
      sub.status === 'active' || sub.status === 'trialing'
    );

    if (validSubscriptions.length === 0) {
      // No active subscription - move to trial
      await moveToTrialCollection(userId, currentUserData, currentAccountType);
      
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success: true,
          action: 'moved_to_trial',
          message: 'No active subscription found, moved to trial'
        }),
      };
    }

    // Get the most recent subscription
    const latestSubscription = validSubscriptions.sort((a, b) => b.created - a.created)[0];
    const price = latestSubscription.items.data[0].price;
    
    // Determine account type based on price
    let newAccountType = 'trial';
    if (price.unit_amount === 500) { // $5.00
      newAccountType = 'basic';
    } else if (price.unit_amount === 1000) { // $10.00
      newAccountType = 'pro';
    } else if (price.unit_amount === 1600) { // $16.00
      newAccountType = 'advanced';
    }

    console.log('💳 Latest subscription:', newAccountType, 'status:', latestSubscription.status);

    // Step 3: Move user to correct collection if needed
    if (newAccountType !== currentAccountType) {
      await moveToCorrectCollection(userId, currentUserData, currentAccountType, newAccountType, latestSubscription);
      
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success: true,
          action: 'moved_collections',
          from: currentAccountType,
          to: newAccountType,
          message: `Moved from ${currentAccountType} to ${newAccountType} collection`
        }),
      };
    } else {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success: true,
          action: 'no_change_needed',
          accountType: newAccountType,
          message: 'User is already in correct collection'
        }),
      };
    }

  } catch (error) {
    console.error('❌ Error syncing collections:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: 'Failed to sync collections',
        details: error.message 
      }),
    };
  }
};

async function moveToTrialCollection(userId, userData, currentAccountType) {
  console.log('🔄 Moving user to trial collection...');
  
  // Remove from current collection
  if (currentAccountType !== 'trial') {
    const currentCollectionName = getCollectionName(currentAccountType);
    await db.collection(currentCollectionName).doc(userId).delete();
    console.log('✅ Removed from', currentCollectionName);
  }
  
  // Add to trial collection
  const trialData = {
    ...userData,
    accountType: 'trial',
    plan: 'trial',
    subscriptionStatus: 'cancelled',
    cancelledAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  await db.collection('Trial User Accounts').doc(userId).set(trialData, { merge: true });
  await db.collection('userProfiles').doc(userId).set(trialData, { merge: true });
  
  console.log('✅ Added to Trial User Accounts');
}

async function moveToCorrectCollection(userId, userData, fromAccountType, toAccountType, subscription) {
  console.log(`🔄 Moving user from ${fromAccountType} to ${toAccountType}...`);
  
  // Remove from old collection
  if (fromAccountType !== 'trial') {
    const oldCollectionName = getCollectionName(fromAccountType);
    await db.collection(oldCollectionName).doc(userId).delete();
    console.log('✅ Removed from', oldCollectionName);
  }
  
  // Add to new collection
  const newData = {
    ...userData,
    accountType: toAccountType,
    plan: toAccountType,
    subscriptionStatus: subscription.status,
    subscriptionDate: new Date(subscription.created * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    stripeCustomerId: subscription.customer,
    stripeSubscriptionId: subscription.id
  };
  
  const newCollectionName = getCollectionName(toAccountType);
  await db.collection(newCollectionName).doc(userId).set(newData, { merge: true });
  await db.collection('userProfiles').doc(userId).set(newData, { merge: true });
  
  console.log('✅ Added to', newCollectionName);
}

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
