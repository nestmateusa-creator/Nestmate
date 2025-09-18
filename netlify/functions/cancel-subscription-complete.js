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
    const { userId, email, currentPlan } = JSON.parse(event.body);

    if (!userId || !email) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Missing required fields: userId, email' }),
      };
    }

    console.log('🔄 Cancelling subscription for user:', email, 'current plan:', currentPlan);

    // Step 1: Cancel Stripe subscription
    const stripeResult = await cancelStripeSubscription(email);
    if (!stripeResult.success) {
      console.log('⚠️ Stripe cancellation failed, but continuing with Firebase update:', stripeResult.error);
      // Continue anyway - we'll still update Firebase
    }

    // Step 2: Update Firebase collections (move to Trial)
    const firebaseResult = await moveToTrialCollection(userId, email, currentPlan);
    if (!firebaseResult.success) {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Firebase update failed: ' + firebaseResult.error }),
      };
    }

    console.log('✅ Complete cancellation successful for user:', email);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        message: 'Subscription cancelled successfully and moved to Trial',
        firebaseUpdates: firebaseResult.updates,
        stripeCancelled: stripeResult.success
      }),
    };

  } catch (error) {
    console.error('❌ Error in complete cancellation:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: 'Failed to cancel subscription',
        details: error.message 
      }),
    };
  }
};

async function cancelStripeSubscription(email) {
  try {
    // Find the customer in Stripe
    const customers = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    if (customers.data.length === 0) {
      return { success: false, error: 'Customer not found in Stripe' };
    }

    const customer = customers.data[0];

    // Get active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'active',
    });

    if (subscriptions.data.length === 0) {
      return { success: false, error: 'No active subscription found' };
    }

    const subscription = subscriptions.data[0];

    // Cancel the subscription
    const cancelledSubscription = await stripe.subscriptions.update(subscription.id, {
      cancel_at_period_end: true, // Cancel at end of billing period
    });

    console.log('✅ Stripe subscription cancelled:', cancelledSubscription.id);

    return { 
      success: true, 
      subscriptionId: cancelledSubscription.id 
    };

  } catch (error) {
    console.error('❌ Stripe cancellation error:', error);
    return { success: false, error: error.message };
  }
}

async function moveToTrialCollection(userId, email, currentPlan) {
  try {
    const updates = [];
    
    // Prepare user data for Trial plan
    const userData = {
      uid: userId,
      email: email,
      accountType: 'trial',
      plan: 'trial',
      subscriptionStatus: 'cancelled',
      cancelledAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      role: 'user',
      status: 'active',
      previousPlan: currentPlan || 'unknown',
      cancellationDate: new Date().toISOString()
    };

    // Step 1: Remove user from current plan collection (if they have one)
    if (currentPlan && currentPlan !== 'trial') {
      const currentCollectionName = getCollectionName(currentPlan);
      try {
        await db.collection(currentCollectionName).doc(userId).delete();
        updates.push(`Removed from ${currentCollectionName}`);
        console.log(`✅ Removed user from ${currentCollectionName}`);
      } catch (error) {
        console.log(`⚠️ Could not remove from ${currentCollectionName}:`, error.message);
        // Continue anyway - user might not exist in current collection
      }
    }

    // Step 2: Add user to Trial collection
    await db.collection('Trial User Accounts').doc(userId).set(userData, { merge: true });
    updates.push('Added to Trial User Accounts');
    console.log('✅ Added user to Trial User Accounts');

    // Step 3: Update userProfiles collection for compatibility
    await db.collection('userProfiles').doc(userId).set(userData, { merge: true });
    updates.push('Updated userProfiles');
    console.log('✅ Updated userProfiles collection');

    return { 
      success: true, 
      updates: updates 
    };

  } catch (error) {
    console.error('❌ Firebase update error:', error);
    return { success: false, error: error.message };
  }
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
