// Stripe Payment System for NestMate
// Comprehensive payment flow with subscription management, payment methods, and failure handling

class StripePaymentSystem {
    constructor() {
        this.stripe = null;
        this.currentUser = null;
        this.userSubscription = null;
        this.initializeStripe();
    }

    // Initialize Stripe with publishable key
    initializeStripe() {
        // Stripe publishable key will be loaded from environment
        // For now, we'll use the API endpoint approach
        this.apiBase = '/.netlify/functions';
    }

    // Plan configuration with Product IDs
    getPlans() {
        return {
            basic: {
                name: 'Basic',
                productIdMonthly: 'prod_TbRfG1oRFfq8yR',
                productIdYearly: 'prod_TbS2sH3LnAV3kn',
                priceMonthly: 5,
                priceYearly: 54, // $5/month * 12 * 0.9 (10% discount)
                interval: 'month',
                dashboard: 'dashboard-basic-clean.html',
                subscriptionType: 'basic',
                features: ['Single home', '10 tasks', 'Basic features', 'Cloud backup']
            },
            advanced: {
                name: 'Pro',
                productIdMonthly: 'prod_TbS8VRgS8c3jRH',
                productIdYearly: 'prod_TbSJmTsJbY6H4O',
                priceMonthly: 10,
                priceYearly: 108, // $10/month * 12 * 0.9 (10% discount)
                interval: 'month',
                dashboard: 'dashboard-advanced.html',
                subscriptionType: 'pro',
                features: ['Up to 5 homes', 'Unlimited tasks', 'Advanced analytics', 'VIP support']
            },
            'advanced-pro': {
                name: 'Advanced Pro',
                productIdMonthly: 'prod_TbSLueom3MNPWy',
                productIdYearly: 'prod_TbSOOShxfr9f9v',
                priceMonthly: 16,
                priceYearly: 172.8, // $16/month * 12 * 0.9 (10% discount)
                interval: 'month',
                dashboard: 'dashboard-advanced-pro.html',
                subscriptionType: 'advanced-pro',
                features: ['Family features', '5 family members', 'Shared tasks', 'Family analytics']
            },
            enterprise: {
                name: 'Enterprise',
                productIdMonthly: 'prod_TbSRIODmIBKT7t',
                productIdYearly: 'prod_TbSUcLvLgF6CZa',
                priceMonthly: 50,
                priceYearly: 540, // $50/month * 12 * 0.9 (10% discount)
                interval: 'month',
                dashboard: 'dashboard-enterprise.html',
                subscriptionType: 'enterprise',
                features: ['Unlimited homes', 'Client management', 'Team collaboration', 'Priority support']
            }
        };
    }

    // Get current authenticated user
    async getCurrentUser() {
        if (!window.nestMateAuth) {
            throw new Error('Authentication system not available');
        }
        
        const user = await nestMateAuth.getCurrentUser();
        if (!user) {
            throw new Error('User not authenticated');
        }
        
        this.currentUser = user;
        return user;
    }

    // Get user subscription from AWS
    async getUserSubscription() {
        try {
            if (!this.currentUser) {
                await this.getCurrentUser();
            }

            const userRec = await nestMateAuth.getUserRecord(this.currentUser.userId);
            if (!userRec.success || !userRec.user) {
                return null;
            }

            this.userSubscription = userRec.user;
            return {
                subscription: userRec.user.subscription || 'basic',
                status: userRec.user.subscriptionStatus || 'inactive',
                stripeCustomerId: userRec.user.stripeCustomerId,
                stripeSubscriptionId: userRec.user.stripeSubscriptionId,
                paymentMethodId: userRec.user.paymentMethodId,
                lastPayment: userRec.user.lastPayment,
                paymentFailedAt: userRec.user.paymentFailedAt,
                isLocked: userRec.user.isLocked || false
            };
        } catch (error) {
            console.error('Error getting user subscription:', error);
            return null;
        }
    }

    // Check if dashboard should be locked (12 hours after payment failure)
    async checkDashboardLock() {
        try {
            const subscription = await this.getUserSubscription();
            if (!subscription) return false;

            if (subscription.paymentFailedAt) {
                const failedTime = new Date(subscription.paymentFailedAt);
                const now = new Date();
                const hoursSinceFailure = (now - failedTime) / (1000 * 60 * 60);

                if (hoursSinceFailure >= 12 && subscription.status === 'inactive') {
                    // Lock the dashboard
                    await this.lockDashboard(true);
                    return true;
                }
            }

            return subscription.isLocked || false;
        } catch (error) {
            console.error('Error checking dashboard lock:', error);
            return false;
        }
    }

    // Lock or unlock dashboard
    async lockDashboard(lock) {
        try {
            if (!this.currentUser) {
                await this.getCurrentUser();
            }

            await nestMateAuth.updateUserRecord(this.currentUser.userId, {
                isLocked: lock,
                lockedAt: lock ? new Date().toISOString() : null
            });

            return { success: true };
        } catch (error) {
            console.error('Error locking dashboard:', error);
            return { success: false, error: error.message };
        }
    }

    // Create Stripe checkout session for plan selection
    async createCheckoutSession(planKey, productId = null, isYearly = false) {
        try {
            if (!this.currentUser) {
                await this.getCurrentUser();
            }

            const plans = this.getPlans();
            const plan = plans[planKey];
            
            if (!plan) {
                throw new Error('Invalid plan selected');
            }

            // Use provided productId or get from plan based on billing period
            const finalProductId = productId || (isYearly ? plan.productIdYearly : plan.productIdMonthly);

            const response = await fetch(`${this.apiBase}/create-checkout-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId: finalProductId,
                    plan: planKey,
                    isYearly: isYearly,
                    userId: this.currentUser.userId,
                    email: this.currentUser.email || this.currentUser.username
                })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to create checkout session');
            }

            // Redirect to Stripe Checkout
            if (data.url) {
                // Use the checkout URL directly from Stripe
                window.location.href = data.url;
            } else if (data.id) {
                // If only session ID is returned, construct the checkout URL
                // Stripe checkout URLs follow this pattern
                window.location.href = `https://checkout.stripe.com/c/pay/${data.id}`;
            } else {
                throw new Error('No checkout URL or session ID received');
            }

            return { success: true, sessionId: data.id };
        } catch (error) {
            console.error('Error creating checkout session:', error);
            throw error;
        }
    }

    // Handle successful payment (called from success page)
    async handlePaymentSuccess(sessionId) {
        try {
            const response = await fetch(`${this.apiBase}/payment-success`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sessionId })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to process payment');
            }

            // Update local user subscription
            await this.getUserSubscription();

            // Redirect to appropriate dashboard
            const plan = this.getPlans()[data.plan];
            if (plan && plan.dashboard) {
                window.location.href = plan.dashboard;
            } else {
                window.location.href = 'dashboard-basic-clean.html';
            }

            return { success: true, plan: data.plan };
        } catch (error) {
            console.error('Error handling payment success:', error);
            throw error;
        }
    }

    // Upgrade or downgrade subscription
    async changeSubscription(newPlanKey) {
        try {
            if (!this.currentUser) {
                await this.getCurrentUser();
            }

            const subscription = await this.getUserSubscription();
            if (!subscription || !subscription.stripeSubscriptionId) {
                // No existing subscription, create new one
                return await this.createCheckoutSession(newPlanKey);
            }

            const plans = this.getPlans();
            const newPlan = plans[newPlanKey];
            
            if (!newPlan) {
                throw new Error('Invalid plan selected');
            }

            const response = await fetch(`${this.apiBase}/change-subscription`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    subscriptionId: subscription.stripeSubscriptionId,
                    newPriceId: newPlan.priceId,
                    userId: this.currentUser.userId,
                    plan: newPlanKey
                })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to change subscription');
            }

            // Update user record
            await nestMateAuth.updateUserRecord(this.currentUser.userId, {
                subscription: newPlan.subscriptionType,
                updatedAt: new Date().toISOString()
            });

            // Redirect to new dashboard
            window.location.href = newPlan.dashboard;

            return { success: true, plan: newPlanKey };
        } catch (error) {
            console.error('Error changing subscription:', error);
            throw error;
        }
    }

    // Get payment methods
    async getPaymentMethods() {
        try {
            const subscription = await this.getUserSubscription();
            if (!subscription || !subscription.stripeCustomerId) {
                return [];
            }

            const response = await fetch(`${this.apiBase}/get-payment-methods`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customerId: subscription.stripeCustomerId
                })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to get payment methods');
            }

            return data.paymentMethods || [];
        } catch (error) {
            console.error('Error getting payment methods:', error);
            return [];
        }
    }

    // Add payment method
    async addPaymentMethod() {
        try {
            const subscription = await this.getUserSubscription();
            if (!subscription || !subscription.stripeCustomerId) {
                throw new Error('No customer found. Please subscribe to a plan first.');
            }

            const response = await fetch(`${this.apiBase}/create-setup-intent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customerId: subscription.stripeCustomerId,
                    userId: this.currentUser.userId
                })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to create setup intent');
            }

            // Use Stripe.js to collect payment method
            const stripe = Stripe(process.env.STRIPE_PUBLISHABLE_KEY);
            const { error, setupIntent } = await stripe.confirmCardSetup(data.clientSecret, {
                payment_method: {
                    card: null, // Will be collected by Stripe
                }
            });

            if (error) {
                throw new Error(error.message);
            }

            return { success: true, paymentMethodId: setupIntent.payment_method };
        } catch (error) {
            console.error('Error adding payment method:', error);
            throw error;
        }
    }

    // Update default payment method
    async setDefaultPaymentMethod(paymentMethodId) {
        try {
            const subscription = await this.getUserSubscription();
            if (!subscription || !subscription.stripeCustomerId) {
                throw new Error('No customer found');
            }

            const response = await fetch(`${this.apiBase}/set-default-payment-method`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customerId: subscription.stripeCustomerId,
                    paymentMethodId: paymentMethodId,
                    userId: this.currentUser.userId
                })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to update payment method');
            }

            // Update user record
            await nestMateAuth.updateUserRecord(this.currentUser.userId, {
                paymentMethodId: paymentMethodId,
                updatedAt: new Date().toISOString()
            });

            return { success: true };
        } catch (error) {
            console.error('Error setting default payment method:', error);
            throw error;
        }
    }

    // Delete payment method
    async deletePaymentMethod(paymentMethodId) {
        try {
            const response = await fetch(`${this.apiBase}/delete-payment-method`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    paymentMethodId: paymentMethodId,
                    userId: this.currentUser.userId
                })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to delete payment method');
            }

            return { success: true };
        } catch (error) {
            console.error('Error deleting payment method:', error);
            throw error;
        }
    }

    // Open Stripe Customer Portal for managing subscription
    async openCustomerPortal() {
        try {
            if (!this.currentUser) {
                await this.getCurrentUser();
            }

            const response = await fetch(`${this.apiBase}/create-customer-portal`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: this.currentUser.userId
                })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to create portal session');
            }

            // Redirect to Stripe Customer Portal
            window.location.href = data.url;

            return { success: true };
        } catch (error) {
            console.error('Error opening customer portal:', error);
            throw error;
        }
    }

    // Cancel subscription
    async cancelSubscription() {
        try {
            const subscription = await this.getUserSubscription();
            if (!subscription || !subscription.stripeSubscriptionId) {
                throw new Error('No active subscription found');
            }

            const response = await fetch(`${this.apiBase}/cancel-subscription`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    subscriptionId: subscription.stripeSubscriptionId,
                    userId: this.currentUser.userId
                })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to cancel subscription');
            }

            // Update user record
            await nestMateAuth.updateUserRecord(this.currentUser.userId, {
                subscriptionStatus: 'cancelled',
                subscriptionCancelledAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });

            return { success: true };
        } catch (error) {
            console.error('Error cancelling subscription:', error);
            throw error;
        }
    }

    // Retry failed payment
    async retryPayment() {
        try {
            const subscription = await this.getUserSubscription();
            if (!subscription || !subscription.stripeSubscriptionId) {
                throw new Error('No subscription found');
            }

            const response = await fetch(`${this.apiBase}/retry-payment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    subscriptionId: subscription.stripeSubscriptionId,
                    userId: this.currentUser.userId
                })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to retry payment');
            }

            // Unlock dashboard if payment succeeds
            if (data.success) {
                await this.lockDashboard(false);
                await nestMateAuth.updateUserRecord(this.currentUser.userId, {
                    paymentFailedAt: null,
                    subscriptionStatus: 'active',
                    updatedAt: new Date().toISOString()
                });
            }

            return data;
        } catch (error) {
            console.error('Error retrying payment:', error);
            throw error;
        }
    }
}

// Export for use in other files
window.StripePaymentSystem = StripePaymentSystem;

