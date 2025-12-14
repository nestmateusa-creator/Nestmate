// Dashboard Payment Lock Check
// Checks if user's dashboard should be locked due to payment failure (12 hours after failure)

class DashboardPaymentLock {
    constructor() {
        this.paymentSystem = null;
    }

    // Initialize payment system
    async initialize() {
        if (typeof StripePaymentSystem !== 'undefined') {
            this.paymentSystem = new StripePaymentSystem();
        }
    }

    // Check if dashboard should be locked
    async checkAndLockDashboard() {
        try {
            // Wait for auth to be ready
            if (!window.nestMateAuth) {
                console.log('Auth system not available, skipping payment lock check');
                return false;
            }

            await nestMateAuth.initialize();
            
            if (!nestMateAuth.currentUser) {
                // Not logged in, redirect handled by auth system
                return false;
            }

            // Get user subscription
            const userRec = await nestMateAuth.getUserRecord(nestMateAuth.currentUser.userId);
            if (!userRec.success || !userRec.user) {
                return false;
            }

            const user = userRec.user;
            const subscriptionStatus = user.subscriptionStatus || 'inactive';
            const paymentFailedAt = user.paymentFailedAt;
            const isLocked = user.isLocked || false;

            // If already locked, show lock screen
            if (isLocked) {
                this.showLockScreen(user);
                return true;
            }

            // Check if payment failed and 12 hours have passed
            if (paymentFailedAt && subscriptionStatus === 'inactive') {
                const failedTime = new Date(paymentFailedAt);
                const now = new Date();
                const hoursSinceFailure = (now - failedTime) / (1000 * 60 * 60);

                if (hoursSinceFailure >= 12) {
                    // Lock the dashboard
                    await nestMateAuth.updateUserRecord(nestMateAuth.currentUser.userId, {
                        isLocked: true,
                        lockedAt: new Date().toISOString()
                    });

                    this.showLockScreen(user);
                    return true;
                }
            }

            return false;
        } catch (error) {
            console.error('Error checking payment lock:', error);
            return false;
        }
    }

    // Show lock screen overlay
    showLockScreen(user) {
        // Remove existing lock screen if present
        const existingLock = document.getElementById('payment-lock-screen');
        if (existingLock) {
            existingLock.remove();
        }

        // Create lock screen overlay
        const lockScreen = document.createElement('div');
        lockScreen.id = 'payment-lock-screen';
        lockScreen.innerHTML = `
            <div class="payment-lock-overlay">
                <div class="payment-lock-content">
                    <div class="payment-lock-icon">🔒</div>
                    <h2>Dashboard Locked</h2>
                    <p>Your payment failed and your dashboard has been locked.</p>
                    <p class="payment-lock-details">
                        Payment failed: ${user.paymentFailedAt ? new Date(user.paymentFailedAt).toLocaleString() : 'Unknown'}
                    </p>
                    <div class="payment-lock-actions">
                        <button onclick="window.location.href='payment-management.html'" class="payment-lock-btn payment-lock-btn-primary">
                            Update Payment Method
                        </button>
                        <button onclick="window.location.href='pricing.html'" class="payment-lock-btn payment-lock-btn-secondary">
                            View Plans
                        </button>
                    </div>
                    <p class="payment-lock-help">
                        Need help? <a href="contact.html">Contact Support</a>
                    </p>
                </div>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            #payment-lock-screen {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.95);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            }

            .payment-lock-overlay {
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }

            .payment-lock-content {
                background: white;
                border-radius: 16px;
                padding: 48px;
                max-width: 500px;
                width: 100%;
                text-align: center;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            }

            .payment-lock-icon {
                font-size: 64px;
                margin-bottom: 24px;
            }

            .payment-lock-content h2 {
                color: #1e293b;
                font-size: 2rem;
                margin-bottom: 12px;
            }

            .payment-lock-content p {
                color: #64748b;
                font-size: 1.1rem;
                margin-bottom: 8px;
                line-height: 1.6;
            }

            .payment-lock-details {
                color: #ef4444;
                font-weight: 600;
                margin-top: 16px;
            }

            .payment-lock-actions {
                margin-top: 32px;
                display: flex;
                gap: 12px;
                justify-content: center;
                flex-wrap: wrap;
            }

            .payment-lock-btn {
                padding: 14px 32px;
                border: none;
                border-radius: 8px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
                text-decoration: none;
                display: inline-block;
            }

            .payment-lock-btn-primary {
                background: #667eea;
                color: white;
            }

            .payment-lock-btn-primary:hover {
                background: #5568d3;
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
            }

            .payment-lock-btn-secondary {
                background: #64748b;
                color: white;
            }

            .payment-lock-btn-secondary:hover {
                background: #475569;
            }

            .payment-lock-help {
                margin-top: 24px;
                font-size: 0.9rem;
            }

            .payment-lock-help a {
                color: #667eea;
                text-decoration: none;
            }

            .payment-lock-help a:hover {
                text-decoration: underline;
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(lockScreen);

        // Prevent interaction with dashboard content
        document.body.style.overflow = 'hidden';
    }
}

// Export for use in dashboards
window.DashboardPaymentLock = DashboardPaymentLock;

// Auto-initialize if on dashboard page
if (document.body && (window.location.pathname.includes('dashboard') || window.location.pathname.includes('Dashboard'))) {
    document.addEventListener('DOMContentLoaded', async () => {
        const lockCheck = new DashboardPaymentLock();
        await lockCheck.initialize();
        
        // Wait a bit for auth to initialize
        setTimeout(async () => {
            await lockCheck.checkAndLockDashboard();
        }, 1000);
    });
}

