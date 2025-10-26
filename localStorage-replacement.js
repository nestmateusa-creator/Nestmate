// localStorage Replacement - Routes all data to AWS DynamoDB
// This file replaces all localStorage functionality with AWS persistence

// Override localStorage methods to use AWS
(function() {
    'use strict';

    // Store reference to original localStorage methods
    const originalLocalStorage = {
        setItem: localStorage.setItem,
        getItem: localStorage.getItem,
        removeItem: localStorage.removeItem,
        clear: localStorage.clear
    };

    // AWS Data Service instance
    let awsDataService = null;

    // Initialize AWS Data Service
    function initializeAWSDataService() {
        if (!awsDataService && window.awsDataService) {
            awsDataService = window.awsDataService;
            console.log('✅ localStorage replacement initialized with AWS Data Service');
        }
    }

    // Override localStorage.setItem
    localStorage.setItem = function(key, value) {
        console.log('🔄 localStorage.setItem intercepted:', key);
        
        // Initialize AWS service if available
        initializeAWSDataService();
        
        if (awsDataService) {
            // Use AWS for data persistence
            awsDataService.setItem(key, value).then(result => {
                if (result.success) {
                    console.log('✅ Data saved to AWS:', key);
                } else {
                    console.error('❌ Failed to save to AWS:', result.error);
                    // Fallback to original localStorage
                    originalLocalStorage.setItem.call(this, key, value);
                }
            }).catch(error => {
                console.error('❌ AWS save error:', error);
                // Fallback to original localStorage
                originalLocalStorage.setItem.call(this, key, value);
            });
        } else {
            // Fallback to original localStorage if AWS not available
            console.warn('⚠️ AWS Data Service not available, using localStorage fallback');
            originalLocalStorage.setItem.call(this, key, value);
        }
    };

    // Override localStorage.getItem
    localStorage.getItem = function(key) {
        console.log('🔄 localStorage.getItem intercepted:', key);
        
        // Initialize AWS service if available
        initializeAWSDataService();
        
        if (awsDataService) {
            // Try to get from AWS first
            return awsDataService.getItem(key).then(value => {
                if (value !== null) {
                    console.log('✅ Data retrieved from AWS:', key);
                    return value;
                } else {
                    // Fallback to original localStorage
                    console.log('📦 Data not found in AWS, checking localStorage fallback');
                    return originalLocalStorage.getItem.call(this, key);
                }
            }).catch(error => {
                console.error('❌ AWS get error:', error);
                // Fallback to original localStorage
                return originalLocalStorage.getItem.call(this, key);
            });
        } else {
            // Fallback to original localStorage if AWS not available
            console.warn('⚠️ AWS Data Service not available, using localStorage fallback');
            return originalLocalStorage.getItem.call(this, key);
        }
    };

    // Override localStorage.removeItem
    localStorage.removeItem = function(key) {
        console.log('🔄 localStorage.removeItem intercepted:', key);
        
        // Initialize AWS service if available
        initializeAWSDataService();
        
        if (awsDataService) {
            // Remove from AWS
            awsDataService.removeItem(key).then(result => {
                if (result.success) {
                    console.log('✅ Data removed from AWS:', key);
                } else {
                    console.error('❌ Failed to remove from AWS:', result.error);
                    // Fallback to original localStorage
                    originalLocalStorage.removeItem.call(this, key);
                }
            }).catch(error => {
                console.error('❌ AWS remove error:', error);
                // Fallback to original localStorage
                originalLocalStorage.removeItem.call(this, key);
            });
        } else {
            // Fallback to original localStorage if AWS not available
            console.warn('⚠️ AWS Data Service not available, using localStorage fallback');
            originalLocalStorage.removeItem.call(this, key);
        }
    };

    // Override localStorage.clear
    localStorage.clear = function() {
        console.log('🔄 localStorage.clear intercepted');
        
        // Initialize AWS service if available
        initializeAWSDataService();
        
        if (awsDataService) {
            // Clear AWS data
            awsDataService.clear().then(result => {
                if (result.success) {
                    console.log('✅ Data cleared from AWS');
                } else {
                    console.error('❌ Failed to clear AWS data:', result.error);
                    // Fallback to original localStorage
                    originalLocalStorage.clear.call(this);
                }
            }).catch(error => {
                console.error('❌ AWS clear error:', error);
                // Fallback to original localStorage
                originalLocalStorage.clear.call(this);
            });
        } else {
            // Fallback to original localStorage if AWS not available
            console.warn('⚠️ AWS Data Service not available, using localStorage fallback');
            originalLocalStorage.clear.call(this);
        }
    };

    // Monitor for AWS Data Service availability
    const checkForAWSDataService = setInterval(() => {
        if (window.awsDataService && !awsDataService) {
            awsDataService = window.awsDataService;
            console.log('✅ AWS Data Service detected and connected');
            clearInterval(checkForAWSDataService);
        }
    }, 1000);

    // Clean up interval after 30 seconds
    setTimeout(() => {
        clearInterval(checkForAWSDataService);
    }, 30000);

    console.log('🔄 localStorage replacement loaded - all data will be saved to AWS DynamoDB');
})();
