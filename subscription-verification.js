// Universal Subscription Verification System
// This file provides proper subscription verification and routing

console.log('🔐 Subscription Verification System loaded');

// Prevent multiple redirects
let isRedirecting = false;

// Show loading screen
function showLoadingScreen() {
    // Create loading overlay
    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'subscription-loading';
    loadingOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        color: white;
        font-family: 'Inter', sans-serif;
    `;
    
    loadingOverlay.innerHTML = `
        <div style="text-align: center;">
            <div style="
                width: 60px;
                height: 60px;
                border: 4px solid rgba(255,255,255,0.3);
                border-top: 4px solid white;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 20px;
            "></div>
            <h2 style="margin: 0 0 10px; font-size: 24px; font-weight: 600;">Verifying Subscription</h2>
            <p style="margin: 0; opacity: 0.8; font-size: 16px;">Please wait while we verify your account...</p>
        </div>
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;
    
    document.body.appendChild(loadingOverlay);
}

// Hide loading screen
function hideLoadingScreen() {
    const loadingOverlay = document.getElementById('subscription-loading');
    if (loadingOverlay) {
        loadingOverlay.remove();
    }
}

// Subscription verification and routing
async function verifySubscriptionAndRedirect() {
    try {
        // Prevent multiple redirects
        if (isRedirecting) {
            console.log('⏳ Already redirecting, skipping...');
            return;
        }
        
        // Show loading screen
        showLoadingScreen();
        
        console.log('🔍 Verifying subscription...');
        
        // Wait for Firebase to be available
        if (typeof firebase === 'undefined') {
            console.log('⏳ Waiting for Firebase...');
            await new Promise(resolve => setTimeout(resolve, 1000));
            if (typeof firebase === 'undefined') {
                console.log('❌ Firebase not available, redirecting to trial');
                isRedirecting = true;
                await new Promise(resolve => setTimeout(resolve, 1500));
                window.location.href = 'https://nestmateus.com/dashboard-trial-new.html';
                return;
            }
        }

        const user = firebase.auth().currentUser;
        if (!user) {
            console.log('❌ No user logged in, redirecting to signin');
            isRedirecting = true;
            await new Promise(resolve => setTimeout(resolve, 1500));
            window.location.href = 'signin.html';
            return;
        }

        console.log('👤 User found:', user.email);

        // Get user's subscription data from Firestore
        const db = firebase.firestore();
        const userDoc = await db.collection('userProfiles').doc(user.uid).get();
        
        if (!userDoc.exists) {
            console.log('❌ User document not found, creating trial account');
            // Create a default trial account
            await db.collection('userProfiles').doc(user.uid).set({
                email: user.email,
                displayName: user.displayName || '',
                accountType: 'trial',
                plan: 'trial',
                subscriptionStatus: 'active',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
            console.log('✅ Trial account created, redirecting to trial dashboard');
            isRedirecting = true;
            await new Promise(resolve => setTimeout(resolve, 1500));
            window.location.href = 'https://nestmateus.com/dashboard-trial-new.html';
            return;
        }

        const userData = userDoc.data();
        const accountType = userData.accountType || 'trial';
        const plan = userData.plan || 'trial';
        const subscriptionStatus = userData.subscriptionStatus || 'active';
        
        console.log('📊 User data:', {
            accountType,
            plan,
            subscriptionStatus,
            email: user.email
        });

        // Verify subscription is active
        if (subscriptionStatus !== 'active' && subscriptionStatus !== 'trialing') {
            console.log('❌ Subscription not active, redirecting to trial');
            isRedirecting = true;
            await new Promise(resolve => setTimeout(resolve, 1500));
            window.location.href = 'https://nestmateus.com/dashboard-trial-new.html';
            return;
        }

        // Normalize account type
        let normalizedType = 'trial';
        if (accountType && accountType.toLowerCase().includes('advanced')) {
            normalizedType = 'advanced';
        } else if (accountType && accountType.toLowerCase().includes('pro')) {
            normalizedType = 'pro';
        } else if (accountType && accountType.toLowerCase().includes('basic')) {
            normalizedType = 'basic';
        }

        console.log('🎯 Normalized account type:', normalizedType);

        // Redirect based on verified subscription
        isRedirecting = true;
        
        // Add a small delay to show loading screen
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        switch (normalizedType) {
            case 'basic':
                console.log('✅ Basic subscription verified, redirecting to basic dashboard');
                window.location.href = 'https://nestmateus.com/dashboard-basic-new.html';
                break;
            case 'pro':
                console.log('✅ Pro subscription verified, redirecting to pro dashboard');
                window.location.href = 'https://nestmateus.com/dashboard-pro-new.html';
                break;
            case 'advanced':
                console.log('✅ Advanced subscription verified, redirecting to advanced dashboard');
                window.location.href = 'https://nestmateus.com/dashboard-advanced-new.html';
                break;
            default:
                console.log('✅ Trial account, redirecting to trial dashboard');
                window.location.href = 'https://nestmateus.com/dashboard-trial-new.html';
        }

    } catch (error) {
        console.error('❌ Error verifying subscription:', error);
        console.log('🔄 Fallback: redirecting to trial dashboard');
        isRedirecting = true;
        
        // Add a small delay to show loading screen
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        window.location.href = 'https://nestmateus.com/dashboard-trial-new.html';
    }
}

// Check if user should be on current dashboard
async function verifyDashboardAccess(expectedAccountType) {
    try {
        // Prevent multiple redirects
        if (isRedirecting) {
            console.log('⏳ Already redirecting, allowing access');
            return true;
        }
        
        console.log('🛡️ Verifying dashboard access for:', expectedAccountType);
        
        // Wait for Firebase to be available
        if (typeof firebase === 'undefined') {
            console.log('⏳ Waiting for Firebase...');
            await new Promise(resolve => setTimeout(resolve, 1000));
            if (typeof firebase === 'undefined') {
                console.log('❌ Firebase not available, allowing access');
                return true;
            }
        }

        const user = firebase.auth().currentUser;
        if (!user) {
            console.log('❌ No user logged in, redirecting to signin');
            window.location.href = 'signin.html';
            return false;
        }

        // Get user's subscription data from Firestore
        const db = firebase.firestore();
        const userDoc = await db.collection('userProfiles').doc(user.uid).get();
        
        if (!userDoc.exists) {
            console.log('❌ User document not found, redirecting to trial dashboard');
            window.location.href = 'https://nestmateus.com/dashboard-trial-new.html';
            return false;
        }

        const userData = userDoc.data();
        const accountType = userData.accountType || 'trial';
        const subscriptionStatus = userData.subscriptionStatus || 'active';
        
        // Check if subscription is active
        if (subscriptionStatus !== 'active' && subscriptionStatus !== 'trialing') {
            console.log('❌ Subscription not active, redirecting to trial dashboard');
            window.location.href = 'https://nestmateus.com/dashboard-trial-new.html';
            return false;
        }

        // Normalize account type
        let normalizedType = 'trial';
        if (accountType && accountType.toLowerCase().includes('advanced')) {
            normalizedType = 'advanced';
        } else if (accountType && accountType.toLowerCase().includes('pro')) {
            normalizedType = 'pro';
        } else if (accountType && accountType.toLowerCase().includes('basic')) {
            normalizedType = 'basic';
        }

        console.log('📊 User has:', normalizedType, 'Expected:', expectedAccountType);

        // Check if user has access to this dashboard
        if (normalizedType !== expectedAccountType) {
            console.log('❌ Access denied, redirecting to correct dashboard');
            await verifySubscriptionAndRedirect();
            return false;
        }

        console.log('✅ Access granted to', expectedAccountType, 'dashboard');
        return true;

    } catch (error) {
        console.error('❌ Error verifying dashboard access:', error);
        console.log('🔄 Fallback: redirecting to trial dashboard');
        window.location.href = 'https://nestmateus.com/dashboard-trial-new.html';
        return false;
    }
}

// Universal go back to dashboard function
async function goBackToDashboard() {
    console.log('🏠 Going back to dashboard...');
    await verifySubscriptionAndRedirect();
}

// Universal redirect to user dashboard function
async function redirectToUserDashboard() {
    console.log('🚀 Redirecting to user dashboard...');
    await verifySubscriptionAndRedirect();
}

// Make functions globally available
window.verifySubscriptionAndRedirect = verifySubscriptionAndRedirect;
window.verifyDashboardAccess = verifyDashboardAccess;
window.goBackToDashboard = goBackToDashboard;
window.redirectToUserDashboard = redirectToUserDashboard;

console.log('✅ Subscription Verification System ready');
