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
    const { userId, email, newPlan, currentPlan } = JSON.parse(event.body);

    if (!userId || !email || !newPlan) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Missing required fields: userId, email, newPlan' }),
      };
    }

    console.log('🔄 Upgrading subscription for user:', email, 'from', currentPlan, 'to', newPlan);

    // Step 1: Update Stripe subscription
    const stripeResult = await updateStripeSubscription(email, newPlan);
    if (!stripeResult.success) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Stripe update failed: ' + stripeResult.error }),
      };
    }

    // Step 2: Update Firebase collections
    const firebaseResult = await updateFirebaseCollections(userId, email, newPlan, currentPlan);
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

    console.log('✅ Complete upgrade successful for user:', email);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        subscriptionId: stripeResult.subscriptionId,
        newPlan: newPlan,
        message: 'Subscription upgraded successfully and Firebase collections updated',
        firebaseUpdates: firebaseResult.updates
      }),
    };

  } catch (error) {
    console.error('❌ Error in complete upgrade:', error);
    
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

async function updateStripeSubscription(email, newPlan) {
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

    // Define plan prices (in cents)
    const planPrices = {
      'basic': 500,    // $5.00
      'pro': 1000,     // $10.00
      'advanced': 1600 // $16.00
    };

    const newPrice = planPrices[newPlan];
    if (!newPrice) {
      return { success: false, error: 'Invalid plan specified' };
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
      proration_behavior: 'create_prorations',
    });

    console.log('✅ Stripe subscription upgraded:', updatedSubscription.id);

    return { 
      success: true, 
      subscriptionId: updatedSubscription.id 
    };

  } catch (error) {
    console.error('❌ Stripe update error:', error);
    return { success: false, error: error.message };
  }
}

async function updateFirebaseCollections(userId, email, newPlan, currentPlan) {
  try {
    const updates = [];
    
    // Prepare user data for the new plan
    const userData = {
      uid: userId,
      email: email,
      accountType: newPlan,
      plan: newPlan,
      subscriptionStatus: 'active',
      subscriptionDate: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      role: 'user',
      status: 'active',
      previousPlan: currentPlan || 'trial',
      upgradeDate: new Date().toISOString()
    };

    // Step 1: Remove user from old collection (if they have a current plan)
    if (currentPlan && currentPlan !== 'trial') {
      const oldCollectionName = getCollectionName(currentPlan);
      try {
        await db.collection(oldCollectionName).doc(userId).delete();
        updates.push(`Removed from ${oldCollectionName}`);
        console.log(`✅ Removed user from ${oldCollectionName}`);
      } catch (error) {
        console.log(`⚠️ Could not remove from ${oldCollectionName}:`, error.message);
        // Continue anyway - user might not exist in old collection
      }
    }

    // Step 2: Add user to new collection
    const newCollectionName = getCollectionName(newPlan);
    await db.collection(newCollectionName).doc(userId).set(userData, { merge: true });
    updates.push(`Added to ${newCollectionName}`);
    console.log(`✅ Added user to ${newCollectionName}`);

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
      return 'Basic User Accounts';
  }
}
