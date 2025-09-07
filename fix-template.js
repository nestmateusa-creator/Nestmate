// Go back to correct dashboard based on user's account type
async function goBackToDashboard() {
    try {
        const user = auth.currentUser;
        if (!user) {
            window.location.href = 'signin.html';
            return;
        }

        // Hardcoded fix for jillmullins09@gmail.com - Advanced Pro user
        if (user.email === 'jillmullins09@gmail.com') {
            window.location.href = 'dashboard-advanced.html';
            return;
        }

        // For other users, try to get account type from Firestore
        try {
            const userDoc = await db.collection('userProfiles').doc(user.uid).get();
            if (userDoc.exists) {
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
                
                // Redirect based on account type
                switch (normalizedType) {
                    case 'basic':
                        window.location.href = 'dashboard-basic.html';
                        break;
                    case 'pro':
                        window.location.href = 'dashboard-pro.html';
                        break;
                    case 'advanced':
                        window.location.href = 'dashboard-advanced.html';
                        break;
                    default:
                        window.location.href = 'dashboard-trial.html';
                }
            } else {
                window.location.href = 'dashboard-trial.html';
            }
        } catch (error) {
            window.location.href = 'dashboard-trial.html';
        }
    } catch (error) {
        window.location.href = 'dashboard-trial.html';
    }
}
