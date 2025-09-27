// DASHBOARD PROTECTION - Prevents users from accessing wrong dashboards
// This script will redirect users to their correct dashboard if they try to access the wrong one

console.log('🛡️ Dashboard Protection loaded');

// Function to check if user should be on this dashboard
async function checkDashboardAccess(expectedAccountType) {
    try {
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

        // User will be handled by the subscription verification system

        // Get user's account type from Firestore
        const db = firebase.firestore();
        const userDoc = await db.collection('userProfiles').doc(user.uid).get();
        
        if (!userDoc.exists) {
            console.log('❌ User document not found, redirecting to trial dashboard');
            window.location.href = 'dashboard-basic-new.html';
            return false;
        }

        const userData = userDoc.data();
        const accountType = userData.accountType || 'trial';
        
        // Normalize account type
        let normalizedType = 'trial';
        if (accountType && accountType.toLowerCase().includes('advanced')) {
            normalizedType = 'advanced';
        } else if (accountType && accountType.toLowerCase().includes('pro')) {
            normalizedType = 'pro';
        } else if (accountType && accountType.toLowerCase().includes('basic')) {
            normalizedType = 'basic';
        }

        console.log(`📊 User account type: ${accountType} -> normalized: ${normalizedType}`);
        console.log(`🎯 Expected dashboard: ${expectedAccountType}`);

        // Check if user should be on this dashboard
        if (normalizedType !== expectedAccountType) {
            console.log(`❌ Wrong dashboard! User is ${normalizedType} but trying to access ${expectedAccountType}`);
            
            // Redirect to correct dashboard
            switch (normalizedType) {
                case 'basic':
                    window.location.href = 'dashboard-basic-new.html';
                    break;
                case 'pro':
                    window.location.href = 'dashboard-pro-new.html';
                    break;
                case 'advanced':
                    window.location.href = 'dashboard-advanced-pro-new.html';
                    break;
                default:
                    window.location.href = 'dashboard-basic-new.html';
            }
            return false;
        }

        console.log('✅ User is on correct dashboard');
        return true;
    } catch (error) {
        console.error('❌ Dashboard protection error:', error);
        // On error, allow access to prevent blocking
        return true;
    }
}

// Function to protect a specific dashboard
function protectDashboard(accountType) {
    console.log(`🛡️ Protecting ${accountType} dashboard`);
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            checkDashboardAccess(accountType);
        });
    } else {
        checkDashboardAccess(accountType);
    }
}

// Export functions for use in other scripts
window.checkDashboardAccess = checkDashboardAccess;
window.protectDashboard = protectDashboard;
