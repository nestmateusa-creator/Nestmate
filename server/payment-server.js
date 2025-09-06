const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_51S4C0sAmpksixclY7VHwdV1oc86f76nRfWMPBA8CptvUtSmFUPzjnJswAYIbZRBMCgQcB8f6d4xCMePOmnani6FV007JlAA3SH');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:8000', 'http://127.0.0.1:8000', 'http://127.0.0.1:5500', 'http://localhost:5500', 'file://'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Stripe webhook endpoint (for production)
app.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.log(`Webhook signature verification failed.`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log('PaymentIntent was successful!', paymentIntent.id);
            // Update user subscription in your database
            break;
        case 'payment_method.attached':
            const paymentMethod = event.data.object;
            console.log('PaymentMethod was attached to a Customer!', paymentMethod.id);
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({received: true});
});

// Create payment intent
app.post('/create-payment-intent', async (req, res) => {
    try {
        console.log('Payment intent request received:', req.body);
        const { amount, currency = 'usd', planType } = req.body;
        
        if (!amount) {
            return res.status(400).json({ error: 'Amount is required' });
        }

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount, // Amount is already in cents from frontend
            currency: currency,
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                planType: planType,
                userId: req.body.userId || 'demo-user'
            }
        });

        console.log('Payment intent created successfully:', paymentIntent.id);
        res.send({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });
    } catch (err) {
        console.error('Error creating payment intent:', err);
        res.status(500).json({ 
            error: err.message,
            type: err.type || 'unknown_error'
        });
    }
});

// Create subscription
app.post('/create-subscription', async (req, res) => {
    try {
        const { customerId, priceId, paymentMethodId } = req.body;

        // Attach the payment method to the customer
        await stripe.paymentMethods.attach(paymentMethodId, {
            customer: customerId,
        });

        // Set it as the default payment method
        await stripe.customers.update(customerId, {
            invoice_settings: {
                default_payment_method: paymentMethodId,
            },
        });

        // Create the subscription
        const subscription = await stripe.subscriptions.create({
            customer: customerId,
            items: [{ price: priceId }],
            default_payment_method: paymentMethodId,
            expand: ['latest_invoice.payment_intent'],
        });

        res.send({
            subscriptionId: subscription.id,
            clientSecret: subscription.latest_invoice.payment_intent.client_secret,
        });
    } catch (err) {
        console.error('Error creating subscription:', err);
        res.status(500).send({ error: err.message });
    }
});

// Create customer
app.post('/create-customer', async (req, res) => {
    try {
        const { email, name } = req.body;

        const customer = await stripe.customers.create({
            email: email,
            name: name,
        });

        res.send({
            customerId: customer.id,
        });
    } catch (err) {
        console.error('Error creating customer:', err);
        res.status(500).send({ error: err.message });
    }
});

// Get subscription status
app.get('/subscription/:customerId', async (req, res) => {
    try {
        const { customerId } = req.params;

        const subscriptions = await stripe.subscriptions.list({
            customer: customerId,
            status: 'active',
        });

        res.send({
            hasActiveSubscription: subscriptions.data.length > 0,
            subscriptions: subscriptions.data,
        });
    } catch (err) {
        console.error('Error getting subscription:', err);
        res.status(500).send({ error: err.message });
    }
});

// Cancel subscription
app.post('/cancel-subscription', async (req, res) => {
    try {
        const { subscriptionId } = req.body;

        const subscription = await stripe.subscriptions.update(subscriptionId, {
            cancel_at_period_end: true,
        });

        res.send({
            subscription: subscription,
        });
    } catch (err) {
        console.error('Error canceling subscription:', err);
        res.status(500).send({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Payment server running on port ${PORT}`);
    console.log(`Make sure to set your STRIPE_SECRET_KEY environment variable`);
});

module.exports = app;
