// Handle subscription cancellation webhook from Stripe
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const admin = require('firebase-admin');

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
    const serviceAccount = require('../../data-41fa8-firebase-adminsdk-fbsvc-892ea58cdd.json');
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
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
                'Access-Control-Allow-Headers': 'Content-Type, stripe-signature',
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
        const sig = event.headers['stripe-signature'];
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

        let stripeEvent;

        try {
            stripeEvent = stripe.webhooks.constructEvent(event.body, sig, endpointSecret);
        } catch (err) {
            console.error('Webhook signature verification failed:', err.message);
            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({ error: `Webhook Error: ${err.message}` }),
            };
        }

        // Handle the event
        switch (stripeEvent.type) {
            case 'customer.subscription.deleted':
                await handleSubscriptionDeleted(stripeEvent.data.object);
                break;
            case 'customer.subscription.updated':
                await handleSubscriptionUpdated(stripeEvent.data.object);
                break;
            default:
                console.log(`Unhandled event type ${stripeEvent.type}`);
        }

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ received: true }),
        };
    } catch (error) {
        console.error('Error processing webhook:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ error: 'Internal server error' }),
        };
    }
};

async function handleSubscriptionDeleted(subscription) {
    try {
        console.log('Processing subscription deletion:', subscription.id);
        
        // Find user by customer ID
        const customerId = subscription.customer;
        
        // Search for user with this Stripe customer ID
        const usersSnapshot = await db.collection('userProfiles')
            .where('stripeCustomerId', '==', customerId)
            .get();

        if (usersSnapshot.empty) {
            console.log('No user found with customer ID:', customerId);
            return;
        }

        // Update all matching users to trial status
        const batch = db.batch();
        
        usersSnapshot.forEach(doc => {
            const userRef = db.collection('userProfiles').doc(doc.id);
            const accountRef = db.collection('accounts').doc(doc.id);
            
            batch.update(userRef, {
                accountType: 'trial',
                plan: 'trial',
                subscriptionStatus: 'cancelled',
                subscriptionEndDate: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
            
            batch.update(accountRef, {
                accountType: 'trial',
                plan: 'trial',
                subscriptionStatus: 'cancelled',
                subscriptionEndDate: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
        });

        await batch.commit();
        console.log('Successfully updated users to trial status');
        
    } catch (error) {
        console.error('Error handling subscription deletion:', error);
        throw error;
    }
}

async function handleSubscriptionUpdated(subscription) {
    try {
        console.log('Processing subscription update:', subscription.id);
        
        // If subscription is cancelled or past due, update to trial
        if (subscription.status === 'canceled' || subscription.status === 'past_due') {
            await handleSubscriptionDeleted(subscription);
        }
        
    } catch (error) {
        console.error('Error handling subscription update:', error);
        throw error;
    }
}
