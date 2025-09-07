// Test Stripe connection
const stripe = require('stripe')('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');

async function testStripe() {
    try {
        console.log('Testing Stripe connection...');
        
        // Test 1: Get account info
        const account = await stripe.accounts.retrieve();
        console.log('✅ Stripe account connected:', account.id);
        
        // Test 2: Create a test checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Test Product',
                    },
                    unit_amount: 500,
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: 'https://www.nestmateus.com/success',
            cancel_url: 'https://www.nestmateus.com/cancel',
        });
        
        console.log('✅ Checkout session created:', session.id);
        console.log('✅ Session URL:', session.url);
        
    } catch (error) {
        console.error('❌ Stripe error:', error.message);
        console.error('Error type:', error.type);
        console.error('Error code:', error.code);
    }
}

testStripe();
