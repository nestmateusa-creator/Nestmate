const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { userId } = JSON.parse(event.body);
        
        // Get user's Stripe customer ID from DynamoDB
        const AWS = require('aws-sdk');
        const dynamodb = new AWS.DynamoDB.DocumentClient();
        
        const userParams = {
            TableName: process.env.NESTMATE_DDB_USERS_TABLE,
            Key: { userId: userId }
        };
        
        const userResult = await dynamodb.get(userParams).promise();
        const user = userResult.Item;
        
        if (!user || !user.stripeCustomerId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'No Stripe customer found' })
            };
        }
        
        // Create Stripe customer portal session
        const session = await stripe.billingPortal.sessions.create({
            customer: user.stripeCustomerId,
            return_url: `${process.env.SITE_URL}/dashboard-basic-clean.html`,
        });
        
        return {
            statusCode: 200,
            body: JSON.stringify({ url: session.url })
        };
        
    } catch (error) {
        console.error('Customer portal error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to create customer portal session' })
        };
    }
};