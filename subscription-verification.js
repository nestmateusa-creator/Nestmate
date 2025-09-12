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

        // All users will be handled dynamically based on their Firestore data
        console.log('✅ Processing user subscription verification for:', user.email);
        console.log('🔍 Current URL:', window.location.href);
        console.log('🔍 URL parameters:', new URLSearchParams(window.location.search).toString());

        // Determine which collection to check based on current dashboard
        const db = firebase.firestore();
        const currentPage = window.location.pathname;
        let collectionName = 'Trial User Accounts'; // default
        
        if (currentPage.includes('dashboard-basic-new.html')) {
            collectionName = 'Basic User Accounts';
        } else if (currentPage.includes('dashboard-pro-new.html')) {
            collectionName = 'Pro User Accounts';
        } else if (currentPage.includes('dashboard-advanced-new.html')) {
            collectionName = 'Advanced Pro User Accounts';
        } else if (currentPage.includes('dashboard-trial-new.html')) {
            collectionName = 'Trial User Accounts';
        }
        
        console.log('🔍 Checking collection:', collectionName, 'for current page:', currentPage);
        
        // Get user's subscription data from the correct collection
        let userDoc = await db.collection(collectionName).doc(user.uid).get();
        
        if (!userDoc.exists) {
            console.log('❌ User not found in', collectionName, 'collection');
            console.log('🔄 Checking userProfiles collection as fallback...');
            
            // Fallback: check userProfiles collection
            const fallbackDoc = await db.collection('userProfiles').doc(user.uid).get();
            if (fallbackDoc.exists) {
                const fallbackData = fallbackDoc.data();
                const accountType = fallbackData.accountType || 'trial';
                const plan = fallbackData.plan || 'trial';
                
                console.log('📊 Found user in userProfiles:', { accountType, plan });
                
                // Check if the account type matches the current dashboard
                const currentPage = window.location.pathname;
                const isCorrectDashboard = (currentPage.includes('dashboard-basic-new.html') && (accountType === 'basic' || accountType === 'Basic')) ||
                                         (currentPage.includes('dashboard-pro-new.html') && (accountType === 'pro' || accountType === 'Pro')) ||
                                         (currentPage.includes('dashboard-advanced-new.html') && (accountType === 'advanced' || accountType === 'Advanced' || accountType === 'Advanced Pro')) ||
                                         (currentPage.includes('dashboard-trial-new.html') && (accountType === 'trial' || accountType === 'Trial'));
                
                if (isCorrectDashboard) {
                    console.log('✅ User authorized via fallback userProfiles check');
                    return;
                } else {
                    console.log('❌ User account type does not match current dashboard');
                    console.log('🔄 Redirecting to correct dashboard based on account type...');
                    
                    // Redirect to the correct dashboard based on account type
                    if (accountType === 'basic' || accountType === 'Basic') {
                        window.location.href = 'dashboard-basic-new.html';
                    } else if (accountType === 'pro' || accountType === 'Pro') {
                        window.location.href = 'dashboard-pro-new.html';
                    } else if (accountType === 'advanced' || accountType === 'Advanced' || accountType === 'Advanced Pro') {
                        window.location.href = 'dashboard-advanced-new.html';
                    } else {
                        window.location.href = 'dashboard-trial-new.html';
                    }
                    return;
                }
            }
            
            // If user is not in the expected collection or fallback, redirect to trial dashboard
            console.log('🔄 User not authorized for this dashboard, redirecting to trial');
            isRedirecting = true;
            await new Promise(resolve => setTimeout(resolve, 1500));
            window.location.href = 'https://nestmateus.com/dashboard-trial-new.html';
            return;
        }

        const userData = userDoc.data();
        
        console.log('📊 User found in', collectionName, 'collection:', {
            email: user.email,
            userData: userData,
            documentExists: userDoc.exists,
            documentId: userDoc.id
        });

        // If user is in the correct collection, they have access to this dashboard
        console.log('✅ User authorized for', collectionName, 'dashboard');
        console.log('✅ No redirect needed - user is in correct collection');

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

        // Determine which collection to check based on expected account type
        const db = firebase.firestore();
        let collectionName = 'Trial User Accounts'; // default
        
        if (expectedAccountType === 'basic') {
            collectionName = 'Basic User Accounts';
        } else if (expectedAccountType === 'pro') {
            collectionName = 'Pro User Accounts';
        } else if (expectedAccountType === 'advanced') {
            collectionName = 'Advanced Pro User Accounts';
        } else if (expectedAccountType === 'trial') {
            collectionName = 'Trial User Accounts';
        }
        
        console.log('🔍 Checking', collectionName, 'for', expectedAccountType, 'access');
        
        // Get user's subscription data from the correct collection
        const userDoc = await db.collection(collectionName).doc(user.uid).get();
        
        if (!userDoc.exists) {
            console.log('❌ User not found in', collectionName, 'collection');
            console.log('❌ Access denied, redirecting to trial dashboard');
            window.location.href = 'https://nestmateus.com/dashboard-trial-new.html';
            return false;
        }

        console.log('✅ User found in', collectionName, 'collection');
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
