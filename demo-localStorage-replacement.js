// Demo localStorage Replacement - Uses sessionStorage for demo mode
// This file replaces localStorage functionality with sessionStorage for demo dashboards

(function() {
    'use strict';

    // Store reference to original localStorage methods
    const originalLocalStorage = {
        setItem: localStorage.setItem,
        getItem: localStorage.getItem,
        removeItem: localStorage.removeItem,
        clear: localStorage.clear
    };

    // Demo Data Service instance
    let demoDataService = null;

    // Initialize Demo Data Service
    function initializeDemoDataService() {
        if (!demoDataService && window.awsDataService && window.awsDataService.constructor.name === 'DemoDataService') {
            demoDataService = window.awsDataService;
            console.log('✅ Demo localStorage replacement initialized with Demo Data Service');
        }
    }

    // Override localStorage.setItem - use sessionStorage for demo
    localStorage.setItem = function(key, value) {
        try {
            // Always use sessionStorage directly for demo mode
            const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
            sessionStorage.setItem(key, stringValue);
            console.log('✅ Demo data saved to sessionStorage:', key);
        } catch (e) {
            console.error('❌ Error saving to sessionStorage:', key, e);
        }
    };

    // Override localStorage.getItem - use sessionStorage for demo
    localStorage.getItem = function(key) {
        try {
            const value = sessionStorage.getItem(key);
            if (value === null) {
                return null;
            }
            // Try to parse as JSON, if fails return as string
            try {
                return JSON.parse(value);
            } catch {
                return value;
            }
        } catch (e) {
            console.error('❌ Error reading from sessionStorage:', key, e);
            return null;
        }
    };

    // Override localStorage.removeItem
    localStorage.removeItem = function(key) {
        try {
            sessionStorage.removeItem(key);
            console.log('✅ Demo data removed from sessionStorage:', key);
        } catch (e) {
            console.error('❌ Error removing from sessionStorage:', key, e);
        }
    };

    // Override localStorage.clear - clear sessionStorage demo data
    localStorage.clear = function() {
        try {
            // Only clear demo-related keys
            const keysToRemove = [];
            for (let i = 0; i < sessionStorage.length; i++) {
                const key = sessionStorage.key(i);
                if (key && (key.includes('nestmate') || key.includes('demo') || key.includes('currentUser') || key.includes('home'))) {
                    keysToRemove.push(key);
                }
            }
            keysToRemove.forEach(key => sessionStorage.removeItem(key));
            console.log('✅ Demo data cleared from sessionStorage');
        } catch (e) {
            console.error('❌ Error clearing sessionStorage:', e);
        }
    };

    console.log('🎭 Demo localStorage replacement loaded');
})();

