// NUCLEAR OVERRIDE - This will completely override ALL dashboard routing
// This script runs on EVERY page and overrides ALL dashboard functions

console.log('💥 NUCLEAR OVERRIDE LOADED - ALL DASHBOARD ROUTING OVERRIDDEN');

// Override ALL dashboard routing functions
window.goBackToDashboard = function() {
    console.log('🚀 NUCLEAR: goBackToDashboard called');
    
    // Get current user
    let user = null;
    if (typeof firebase !== 'undefined' && firebase.auth) {
        user = firebase.auth().currentUser;
    }
    
    if (user && user.email === 'jillmullins09@gmail.com') {
        console.log('✅ NUCLEAR: jillmullins09@gmail.com -> dashboard-advanced.html');
        window.location.href = 'dashboard-advanced.html';
        return;
    }
    
    console.log('📊 NUCLEAR: Other user -> dashboard-trial.html');
    window.location.href = 'dashboard-trial.html';
};

window.redirectToUserDashboard = function() {
    console.log('🚀 NUCLEAR: redirectToUserDashboard called');
    
    // Get current user
    let user = null;
    if (typeof firebase !== 'undefined' && firebase.auth) {
        user = firebase.auth().currentUser;
    }
    
    if (user && user.email === 'jillmullins09@gmail.com') {
        console.log('✅ NUCLEAR: jillmullins09@gmail.com -> dashboard-advanced.html');
        window.location.href = 'dashboard-advanced.html';
        return;
    }
    
    console.log('📊 NUCLEAR: Other user -> dashboard-trial.html');
    window.location.href = 'dashboard-trial.html';
};

// Override ALL dashboard links
document.addEventListener('DOMContentLoaded', function() {
    console.log('💥 NUCLEAR: DOM loaded, overriding all dashboard links');
    
    // Override all "Back to Dashboard" links
    const dashboardLinks = document.querySelectorAll('a[href*="dashboard"], button[onclick*="dashboard"]');
    dashboardLinks.forEach(link => {
        if (link.href && link.href.includes('dashboard')) {
            link.href = 'javascript:goBackToDashboard()';
        }
        if (link.onclick && link.onclick.includes('dashboard')) {
            link.onclick = 'goBackToDashboard()';
        }
    });
    
    // Override all dashboard redirects
    const dashboardButtons = document.querySelectorAll('button, a');
    dashboardButtons.forEach(button => {
        if (button.textContent && button.textContent.toLowerCase().includes('dashboard')) {
            button.onclick = function(e) {
                e.preventDefault();
                goBackToDashboard();
            };
        }
    });
    
    console.log('💥 NUCLEAR: All dashboard links overridden');
});

// Override window.location.href assignments
const originalLocationHref = Object.getOwnPropertyDescriptor(window.location, 'href') || 
                            Object.getOwnPropertyDescriptor(Location.prototype, 'href');

Object.defineProperty(window.location, 'href', {
    get: function() {
        return originalLocationHref.get.call(this);
    },
    set: function(value) {
        console.log('🚀 NUCLEAR: Location href being set to:', value);
        
        if (value && value.includes('dashboard')) {
            // Get current user
            let user = null;
            if (typeof firebase !== 'undefined' && firebase.auth) {
                user = firebase.auth().currentUser;
            }
            
            if (user && user.email === 'jillmullins09@gmail.com') {
                console.log('✅ NUCLEAR: Overriding dashboard redirect for jillmullins09@gmail.com');
                value = 'dashboard-advanced.html';
            } else {
                console.log('📊 NUCLEAR: Overriding dashboard redirect for other user');
                value = 'dashboard-trial.html';
            }
        }
        
        originalLocationHref.set.call(this, value);
    }
});

console.log('💥 NUCLEAR OVERRIDE COMPLETE - ALL DASHBOARD ROUTING CONTROLLED');
