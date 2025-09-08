// NUCLEAR OPTION - Universal Dashboard Router
// This file will override ALL dashboard routing across the entire site

// Override the goBackToDashboard function globally
window.goBackToDashboard = function() {
    console.log('🚀 Universal goBackToDashboard called');
    
    // Get current user from Firebase
    if (typeof firebase !== 'undefined' && firebase.auth) {
        const user = firebase.auth().currentUser;
        if (user && user.email === 'jillmullins09@gmail.com') {
            console.log('✅ jillmullins09@gmail.com detected - going to advanced dashboard');
            window.location.href = 'https://nestmateus.com/dashboard-advanced-new.html';
            return;
        }
    }
    
    // For all other users, go to trial dashboard
    console.log('📊 Other user - going to trial dashboard');
        window.location.href = 'https://nestmateus.com/dashboard-trial-new.html';
};

// Override redirectToUserDashboard function globally
window.redirectToUserDashboard = function() {
    console.log('🚀 Universal redirectToUserDashboard called');
    
    // Get current user from Firebase
    if (typeof firebase !== 'undefined' && firebase.auth) {
        const user = firebase.auth().currentUser;
        if (user && user.email === 'jillmullins09@gmail.com') {
            console.log('✅ jillmullins09@gmail.com detected - going to advanced dashboard');
            window.location.href = 'https://nestmateus.com/dashboard-advanced-new.html';
            return;
        }
    }
    
    // For all other users, go to trial dashboard
    console.log('📊 Other user - going to trial dashboard');
        window.location.href = 'https://nestmateus.com/dashboard-trial-new.html';
};

console.log('🎯 Universal Dashboard Router loaded - jillmullins09@gmail.com will ALWAYS go to advanced dashboard');
