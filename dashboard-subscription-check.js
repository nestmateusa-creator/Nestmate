// Dashboard Subscription Check
// Ensures users have an active subscription before accessing dashboards
// This script MUST run immediately to block unauthorized access

console.log('🔒🔒🔒 DASHBOARD SUBSCRIPTION CHECK SCRIPT LOADED 🔒🔒🔒');

// Block page rendering IMMEDIATELY - no delays
(function() {
    'use strict';
    console.log('🔒 BLOCKING PAGE RENDERING IMMEDIATELY...');
    
    // Add CSS to hide body immediately
    const blockerStyle = document.createElement('style');
    blockerStyle.id = 'subscription-check-blocker';
    blockerStyle.textContent = 'body { display: none !important; visibility: hidden !important; }';
    (document.head || document.documentElement).appendChild(blockerStyle);
    
    // Hide body if it exists
    if (document.body) {
        document.body.style.display = 'none';
        document.body.style.visibility = 'hidden';
    }
    
    // Show loading overlay
    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'subscription-check-overlay';
    loadingOverlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.95); z-index: 999999; display: flex; align-items: center; justify-content: center; color: white; font-family: Arial, sans-serif; font-size: 18px;';
    loadingOverlay.innerHTML = '<div style="text-align: center;"><h2>🔒 Verifying subscription...</h2><p>Please wait while we check your account...</p></div>';
    
    if (document.body) {
        document.body.appendChild(loadingOverlay);
    } else {
        // Wait for body
        const bodyObserver = new MutationObserver(function() {
            if (document.body) {
                document.body.appendChild(loadingOverlay);
                bodyObserver.disconnect();
            }
        });
        bodyObserver.observe(document.documentElement, { childList: true });
    }
    
    console.log('🔒 Page rendering blocked, overlay shown');
})();

// Run subscription check immediately
(async function() {
    'use strict';
    
    console.log('🔒🔒🔒 DASHBOARD SUBSCRIPTION CHECK STARTING...');
    console.log('🔒 Current URL:', window.location.href);
    console.log('🔒 Timestamp:', new Date().toISOString());
    
    // Wait for auth system to be available (with timeout)
    let attempts = 0;
    while (!window.nestMateAuth && attempts < 20) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
    }
    
    if (!window.nestMateAuth) {
        console.error('❌ Auth system not available after waiting');
        console.log('⚠️ Redirecting to login...');
        window.location.replace('login-aws.html');
        return;
    }
    
    console.log('✅ Auth system found, proceeding with subscription check...');
    
    try {
        // Initialize auth
        await nestMateAuth.initialize();
        
        // Check if user is authenticated
        const isAuth = await nestMateAuth.isAuthenticated();
        console.log('🔍 Authentication check:', isAuth);
        if (!isAuth) {
            console.log('⚠️ User not authenticated, redirecting to login...');
            const overlay = document.getElementById('subscription-check-overlay');
            if (overlay) overlay.remove();
            window.location.replace('login-aws.html');
            return;
        }
        
        // Get current user
        const currentUser = nestMateAuth.currentUser || await nestMateAuth.getCurrentUser();
        console.log('🔍 Current user:', currentUser);
        if (!currentUser) {
            console.log('⚠️ Could not get current user, redirecting to login...');
            const overlay = document.getElementById('subscription-check-overlay');
            if (overlay) overlay.remove();
            window.location.replace('login-aws.html');
            return;
        }
        
        // Get user record
        console.log('🔍 Getting user record for:', currentUser.userId);
        const userRec = await nestMateAuth.getUserRecord(currentUser.userId);
        console.log('📋 User record response:', userRec);
        if (!userRec || !userRec.success || !userRec.user) {
            console.log('⚠️ Could not get user record, redirecting to plan selection...');
            const overlay = document.getElementById('subscription-check-overlay');
            if (overlay) overlay.remove();
            window.location.replace('select-plan.html');
            return;
        }
        
        const user = userRec.user;
        
        // Check if user has an active subscription
        const hasStripeCustomer = user.stripeCustomerId && user.stripeCustomerId !== null && user.stripeCustomerId !== '';
        const subscriptionStatus = user.subscriptionStatus;
        const isActive = subscriptionStatus === 'active';
        const hasSubscription = user.subscription && user.subscription !== null;
        
        console.log('🔍 Dashboard subscription check:', {
            hasStripeCustomer,
            subscriptionStatus,
            isActive,
            hasSubscription,
            subscription: user.subscription,
            stripeCustomerId: user.stripeCustomerId
        });
        
        // Allow demo accounts
        const email = currentUser.email || currentUser.username || '';
        const isDemoAccount = email.includes('demo.') && email.includes('@nestmate.com');
        
        // CRITICAL: Check if user has active subscription - NO EXCEPTIONS
        if (!isDemoAccount) {
            if (!hasStripeCustomer) {
                console.log('❌❌❌ NO STRIPE CUSTOMER ID - REDIRECTING TO PLAN SELECTION ❌❌❌');
                const overlay = document.getElementById('subscription-check-overlay');
                if (overlay) overlay.remove();
                const blocker = document.getElementById('subscription-blocker-critical');
                if (blocker) blocker.remove();
                window.location.replace('select-plan.html');
                return;
            }
            
            if (!isActive) {
                console.log('❌❌❌ SUBSCRIPTION NOT ACTIVE - REDIRECTING TO PLAN SELECTION ❌❌❌');
                const overlay = document.getElementById('subscription-check-overlay');
                if (overlay) overlay.remove();
                const blocker = document.getElementById('subscription-blocker-critical');
                if (blocker) blocker.remove();
                window.location.replace('select-plan.html');
                return;
            }
            
            // Double-check: if subscription is null/undefined and no Stripe customer, redirect
            if (!hasSubscription && !hasStripeCustomer) {
                console.log('❌❌❌ NO SUBSCRIPTION FOUND - REDIRECTING TO PLAN SELECTION ❌❌❌');
                const overlay = document.getElementById('subscription-check-overlay');
                if (overlay) overlay.remove();
                const blocker = document.getElementById('subscription-blocker-critical');
                if (blocker) blocker.remove();
                window.location.replace('select-plan.html');
                return;
            }
        }
        
        console.log('✅ User has valid subscription, allowing dashboard access');
        
        // Remove loading overlay
        const overlay = document.getElementById('subscription-check-overlay');
        if (overlay) overlay.remove();
        
        // Enable dashboard rendering
        console.log('✅✅✅ ENABLING DASHBOARD RENDERING - SUBSCRIPTION VERIFIED ✅✅✅');
        
        // Clear the critical blocker
        const criticalBlocker = document.getElementById('subscription-blocker-critical');
        if (criticalBlocker) {
            criticalBlocker.remove();
            console.log('✅ Removed critical subscription blocker');
        }
        
        const blocker = document.getElementById('subscription-check-blocker');
        if (blocker) {
            blocker.remove();
            console.log('✅ Removed subscription blocker style');
        }
        
        // Set flag that check passed
        window.subscriptionCheckPassed = true;
        window.subscriptionCheckRequired = false;
        
        if (document.body) {
            document.body.style.display = '';
            document.body.style.visibility = 'visible';
            document.body.style.opacity = '1';
            console.log('✅ Body display restored');
        }
        const overlay = document.getElementById('subscription-check-overlay');
        if (overlay) {
            overlay.remove();
            console.log('✅ Removed loading overlay');
        }
        if (window.enableDashboardRendering) {
            window.enableDashboardRendering();
        }
        
    } catch (error) {
        console.error('Error checking subscription:', error);
        // On error, redirect to plan selection for safety (fail secure)
        console.log('⚠️ Error occurred during subscription check, redirecting to plan selection for safety...');
        // Remove loading overlay
        const overlay = document.getElementById('subscription-check-overlay');
        if (overlay) overlay.remove();
        window.location.replace('select-plan.html');
    }
})();

