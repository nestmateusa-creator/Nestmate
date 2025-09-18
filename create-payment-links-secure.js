const stripe = require('stripe');

// This script will create payment links securely
// You'll need to provide your fresh API key when running this

async function createPaymentLinks() {
    console.log('🔑 Please provide your fresh Stripe secret key:');
    console.log('   (This will be used locally and not exposed to the internet)');
    
    // You'll need to replace this with your fresh key
    const API_KEY = process.env.STRIPE_SECRET_KEY;
    
    if (API_KEY === 'YOUR_FRESH_STRIPE_SECRET_KEY_HERE') {
        console.log('❌ Please replace YOUR_FRESH_STRIPE_SECRET_KEY_HERE with your actual key');
        return;
    }
    
    const stripeClient = stripe(API_KEY);
    
    try {
        console.log('🚀 Creating payment links...\n');
        
        // Create Basic Plan Payment Link
        console.log('📝 Creating Basic Plan ($5/month)...');
        const basicLink = await stripeClient.paymentLinks.create({
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Basic Plan',
                        description: 'Connect up to 2 family members with basic features'
                    },
                    unit_amount: 500, // $5.00 in cents
                    recurring: {
                        interval: 'month'
                    }
                },
                quantity: 1
            }],
            after_completion: {
                type: 'redirect',
                redirect: {
                    url: 'https://www.nestmateus.com/payment-confirmation-simple.html?payment=success&plan=basic'
                }
            },
            payment_method_types: ['card'],
            billing_address_collection: 'auto',
            allow_promotion_codes: true
        });
        
        console.log('✅ Basic Plan Payment Link:');
        console.log(`   ${basicLink.url}\n`);
        
        // Create Pro Plan Payment Link
        console.log('📝 Creating Pro Plan ($10/month)...');
        const proLink = await stripeClient.paymentLinks.create({
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Pro Plan',
                        description: 'Connect up to 3 family members with advanced features'
                    },
                    unit_amount: 1000, // $10.00 in cents
                    recurring: {
                        interval: 'month'
                    }
                },
                quantity: 1
            }],
            after_completion: {
                type: 'redirect',
                redirect: {
                    url: 'https://www.nestmateus.com/payment-confirmation-simple.html?payment=success&plan=pro'
                }
            },
            payment_method_types: ['card'],
            billing_address_collection: 'auto',
            allow_promotion_codes: true
        });
        
        console.log('✅ Pro Plan Payment Link:');
        console.log(`   ${proLink.url}\n`);
        
        // Create Advanced Plan Payment Link
        console.log('📝 Creating Advanced Plan ($16/month)...');
        const advancedLink = await stripeClient.paymentLinks.create({
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Advanced Plan',
                        description: 'Connect up to 5 family members with all premium features'
                    },
                    unit_amount: 1600, // $16.00 in cents
                    recurring: {
                        interval: 'month'
                    }
                },
                quantity: 1
            }],
            after_completion: {
                type: 'redirect',
                redirect: {
                    url: 'https://www.nestmateus.com/payment-confirmation-simple.html?payment=success&plan=advanced'
                }
            },
            payment_method_types: ['card'],
            billing_address_collection: 'auto',
            allow_promotion_codes: true
        });
        
        console.log('✅ Advanced Plan Payment Link:');
        console.log(`   ${advancedLink.url}\n`);
        
        console.log('🎉 All payment links created successfully!');
        console.log('📋 Copy these URLs and send them to me to update your upgrade pages.');
        
    } catch (error) {
        console.error('❌ Error creating payment links:', error.message);
        if (error.message.includes('expired') || error.message.includes('invalid')) {
            console.log('🔑 Your API key appears to be expired or invalid.');
            console.log('   Please get a fresh key from your Stripe Dashboard.');
        }
    }
}

// Run the function
createPaymentLinks();
