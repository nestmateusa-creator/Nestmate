const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { customerId, email } = JSON.parse(event.body);

        if (!customerId || !email) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing required fields' })
            };
        }

        // Create or retrieve Stripe customer
        let customer;
        try {
            // Try to find existing customer by email
            const customers = await stripe.customers.list({
                email: email,
                limit: 1
            });

            if (customers.data.length > 0) {
                customer = customers.data[0];
            } else {
                // Create new customer
                customer = await stripe.customers.create({
                    email: email,
                    metadata: {
                        firebase_uid: customerId
                    }
                });
            }
        } catch (stripeError) {
            console.error('Stripe customer error:', stripeError);
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Failed to create/find customer' })
            };
        }

        // Create customer portal session
        const session = await stripe.billingPortal.sessions.create({
            customer: customer.id,
            return_url: `${process.env.URL}/profile.html`,
        });

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url: session.url
            })
        };

    } catch (error) {
        console.error('Error creating customer portal session:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};
