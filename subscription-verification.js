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
                window.location.href = 'https://nestmateus.com/dashboard-basic-new.html';
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

        // Skip Stripe check - go directly to Firebase collections
        // Since payment links are used, users should already be in correct collections
        console.log('🔍 Checking Firebase collections directly (no Stripe check needed)...');
        console.log('👤 User details:', { uid: user.uid, email: user.email });
        const db = firebase.firestore();

        // Check specific subscription collections first (Pro, Advanced Pro, then Basic)
        // Check by email since payment links add users by email, not UID
        console.log('🔍 Checking specific subscription collections by email...');
        console.log('👤 Checking for user email:', user.email);
        
        // Check Advanced Pro User Accounts first
        console.log('🔍 Checking Advanced Pro User Accounts collection by email...');
        const advancedProQuery = await db.collection('Advanced Pro User Accounts')
            .where('email', '==', user.email)
            .limit(1)
            .get();
        console.log('📊 Advanced Pro query results:', advancedProQuery.size);
        if (!advancedProQuery.empty) {
            console.log('✅ User found in Advanced Pro User Accounts');
            const currentPage = window.location.pathname;
            if (!currentPage.includes('dashboard-advanced-pro-new.html')) {
                console.log('🔄 Redirecting to Advanced Pro dashboard...');
                window.location.href = 'dashboard-advanced-pro-new.html';
            }
            return;
        }
        
        // Check Pro User Accounts
        console.log('🔍 Checking Pro User Accounts collection by email...');
        const proQuery = await db.collection('Pro User Accounts')
            .where('email', '==', user.email)
            .limit(1)
            .get();
        console.log('📊 Pro query results:', proQuery.size);
        if (!proQuery.empty) {
            console.log('✅ User found in Pro User Accounts');
            const currentPage = window.location.pathname;
            if (!currentPage.includes('dashboard-pro-new.html')) {
                console.log('🔄 Redirecting to Pro dashboard...');
                window.location.href = 'dashboard-pro-new.html';
            }
            return;
        }
        
        // Check Basic User Accounts
        console.log('🔍 Checking Basic User Accounts collection by email...');
        const basicQuery = await db.collection('Basic User Accounts')
            .where('email', '==', user.email)
            .limit(1)
            .get();
        console.log('📊 Basic query results:', basicQuery.size);
        if (!basicQuery.empty) {
            console.log('✅ User found in Basic User Accounts');
            const currentPage = window.location.pathname;
            if (!currentPage.includes('dashboard-basic-new.html')) {
                console.log('🔄 Redirecting to Basic dashboard...');
                window.location.href = 'dashboard-basic-new.html';
            }
            return;
        }
        
        // Fallback: Check userProfiles collection
        console.log('🔍 Checking userProfiles collection as fallback...');
        const userProfilesDoc = await db.collection('userProfiles').doc(user.uid).get();
        
        if (userProfilesDoc.exists) {
            const userData = userProfilesDoc.data();
            const accountType = userData.accountType || 'trial';
            const plan = userData.plan || 'trial';
            
            console.log('📊 Found user in userProfiles:', { accountType, plan });
            
            // Check if we're already on the correct dashboard
            const currentPage = window.location.pathname;
            const isCorrectDashboard = (currentPage.includes('dashboard-basic-new.html') && (accountType === 'basic' || accountType === 'Basic')) ||
                                     (currentPage.includes('dashboard-pro-new.html') && (accountType === 'pro' || accountType === 'Pro')) ||
                                     (currentPage.includes('dashboard-advanced-pro-new.html') && (accountType === 'advanced' || accountType === 'Advanced' || accountType === 'Advanced Pro')) ||
                                     (currentPage.includes('dashboard-basic-new.html') && (accountType === 'basic' || accountType === 'Basic'));
            
            if (isCorrectDashboard) {
                console.log('✅ User is on correct dashboard');
                return;
            } else {
                console.log('🔄 Redirecting to correct dashboard based on account type...');
                
                // Redirect to the correct dashboard based on account type
                if (accountType === 'basic' || accountType === 'Basic') {
                    window.location.href = 'dashboard-basic-new.html';
                } else if (accountType === 'pro' || accountType === 'Pro') {
                    window.location.href = 'dashboard-pro-new.html';
                } else if (accountType === 'advanced' || accountType === 'Advanced' || accountType === 'Advanced Pro') {
                    window.location.href = 'dashboard-advanced-pro-new.html';
                } else {
                    window.location.href = 'dashboard-basic-new.html';
                }
                return;
            }
        }
        
        // If not found in userProfiles, check specific collections based on current page
        const currentPage = window.location.pathname;
        let collectionName = 'Basic User Accounts'; // default
        
        if (currentPage.includes('dashboard-basic-new.html')) {
            collectionName = 'Basic User Accounts';
        } else if (currentPage.includes('dashboard-pro-new.html')) {
            collectionName = 'Pro User Accounts';
        } else if (currentPage.includes('dashboard-advanced-pro-new.html')) {
            collectionName = 'Advanced Pro User Accounts';
        } else if (currentPage.includes('dashboard-basic-new.html')) {
            collectionName = 'Basic User Accounts';
        }
        
        console.log('🔍 User not found in userProfiles, checking', collectionName, 'collection...');
        let userDoc = await db.collection(collectionName).doc(user.uid).get();
        
        if (!userDoc.exists) {
            console.log('❌ User not found in any collection, redirecting to signup confirmation');
            isRedirecting = true;
            await new Promise(resolve => setTimeout(resolve, 1500));
            window.location.href = `signup-confirmation.html?email=${encodeURIComponent(user.email)}`;
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
        console.log('🔄 Fallback: redirecting to signup confirmation');
        isRedirecting = true;
        
        // Add a small delay to show loading screen
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Get user email for redirect
        const user = firebase.auth().currentUser;
        if (user && user.email) {
            window.location.href = `signup-confirmation.html?email=${encodeURIComponent(user.email)}`;
        } else {
            window.location.href = 'signup-confirmation.html';
        }
    }
}

// Check collections after sync
async function checkCollectionsAfterSync(user, accountType) {
    console.log('🔍 Checking collections after sync for account type:', accountType);
    const db = firebase.firestore();
    
    // Check the appropriate collection based on account type
    let collectionName = 'Basic User Accounts';
    let dashboardUrl = 'dashboard-basic-new.html';
    
    if (accountType === 'pro' || accountType === 'Pro') {
        collectionName = 'Pro User Accounts';
        dashboardUrl = 'dashboard-pro-new.html';
    } else if (accountType === 'advanced' || accountType === 'Advanced' || accountType === 'Advanced Pro') {
        collectionName = 'Advanced Pro User Accounts';
        dashboardUrl = 'dashboard-advanced-pro-new.html';
    }
    
    console.log('🔍 Checking collection:', collectionName);
    const doc = await db.collection(collectionName).doc(user.uid).get();
    
    if (doc.exists) {
        console.log('✅ User found in correct collection after sync, redirecting to:', dashboardUrl);
        window.location.href = dashboardUrl;
    } else {
        console.log('❌ User still not found in collection after sync');
        // Fall through to normal collection checking
    }
}

// Check collections after manual sync
async function checkCollectionsAfterManualSync(user) {
    console.log('🔍 Checking collections after manual sync for user:', user.email);
    const db = firebase.firestore();
    
    // Check all collections to see where the user ended up
    const collections = [
        { name: 'Advanced Pro User Accounts', url: 'dashboard-advanced-pro-new.html' },
        { name: 'Pro User Accounts', url: 'dashboard-pro-new.html' },
        { name: 'Basic User Accounts', url: 'dashboard-basic-new.html' }
    ];
    
    for (const collection of collections) {
        console.log('🔍 Checking collection:', collection.name);
        const doc = await db.collection(collection.name).doc(user.uid).get();
        
        if (doc.exists) {
            console.log('✅ User found in collection after manual sync:', collection.name);
            console.log('🔄 Redirecting to:', collection.url);
            window.location.href = collection.url;
            return;
        }
    }
    
    console.log('❌ User not found in any collection after manual sync');
    // Fall through to normal collection checking
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
        let collectionName = 'Basic User Accounts'; // default
        
        if (expectedAccountType === 'basic') {
            collectionName = 'Basic User Accounts';
        } else if (expectedAccountType === 'pro') {
            collectionName = 'Pro User Accounts';
        } else if (expectedAccountType === 'advanced') {
            collectionName = 'Advanced Pro User Accounts';
        } else if (expectedAccountType === 'trial') {
            collectionName = 'Basic User Accounts';
        }
        
        console.log('🔍 Checking', collectionName, 'for', expectedAccountType, 'access');
        
        // Get user's subscription data from the correct collection
        const userDoc = await db.collection(collectionName).doc(user.uid).get();
        
        if (!userDoc.exists) {
            console.log('❌ User not found in', collectionName, 'collection');
            console.log('❌ Access denied, redirecting to trial dashboard');
                window.location.href = 'https://nestmateus.com/dashboard-basic-new.html';
            return false;
        }

        console.log('✅ User found in', collectionName, 'collection');
        console.log('✅ Access granted to', expectedAccountType, 'dashboard');
        return true;

    } catch (error) {
        console.error('❌ Error verifying dashboard access:', error);
        console.log('🔄 Fallback: redirecting to trial dashboard');
                window.location.href = 'https://nestmateus.com/dashboard-basic-new.html';
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
