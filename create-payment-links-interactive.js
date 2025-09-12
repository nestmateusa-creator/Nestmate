const stripe = require('stripe');
const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}

async function createPaymentLinks() {
    console.log('🔑 Stripe Payment Link Creator');
    console.log('================================\n');
    
    // Ask for the API key
    const API_KEY = await askQuestion('Enter your fresh Stripe secret key (starts with sk_live_): ');
    
    if (!API_KEY.startsWith('sk_live_')) {
        console.log('❌ Invalid key format. Please enter a live secret key starting with sk_live_');
        rl.close();
        return;
    }
    
    const stripeClient = stripe(API_KEY);
    
    try {
        console.log('\n🚀 Creating payment links...\n');
        
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
            success_url: 'https://www.nestmateus.com/payment-confirmation-simple.html?payment=success&plan=basic',
            cancel_url: 'https://www.nestmateus.com/upgrade-basic.html?payment=cancelled',
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
            success_url: 'https://www.nestmateus.com/payment-confirmation-simple.html?payment=success&plan=pro',
            cancel_url: 'https://www.nestmateus.com/upgrade-pro.html?payment=cancelled',
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
            success_url: 'https://www.nestmateus.com/payment-confirmation-simple.html?payment=success&plan=advanced',
            cancel_url: 'https://www.nestmateus.com/upgrade-advanced.html?payment=cancelled',
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
    } finally {
        rl.close();
    }
}

// Run the function
createPaymentLinks();
