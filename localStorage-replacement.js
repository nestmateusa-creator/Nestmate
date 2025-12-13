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
        // Initialize AWS service if available
        initializeAWSDataService();
        
        if (awsDataService) {
            // Use AWS for data persistence - no fallback
            awsDataService.setItem(key, value).then(result => {
                if (result.success) {
                    console.log('✅ Data saved to AWS:', key);
                } else {
                    console.error('❌ Failed to save to AWS:', key, result.error);
                }
            }).catch(error => {
                console.error('❌ AWS save error:', key, error);
            });
        } else {
            // Wait and retry - no localStorage fallback
            let retries = 0;
            const maxRetries = 10;
            const retryInterval = setInterval(() => {
                initializeAWSDataService();
                if (awsDataService) {
                    clearInterval(retryInterval);
                    awsDataService.setItem(key, value).catch(error => {
                        console.error('❌ Failed to save to AWS after retry:', key, error);
                    });
                } else if (retries >= maxRetries) {
                    clearInterval(retryInterval);
                    console.error('❌ AWS Data Service not available after', maxRetries, 'retries for:', key);
                }
                retries++;
            }, 200);
        }
    };

    // Override localStorage.getItem
    localStorage.getItem = function(key) {
        // Initialize AWS service if available
        initializeAWSDataService();
        
        if (awsDataService) {
            // Try to get from AWS - no fallback
            return awsDataService.getItem(key).then(value => {
                if (value !== null) {
                    console.log('✅ Data retrieved from AWS:', key);
                    return value;
                } else {
                    return null;
                }
            }).catch(error => {
                console.error('❌ AWS get error:', key, error);
                return null;
            });
        } else {
            // Wait and retry - no localStorage fallback
            return new Promise((resolve) => {
                let retries = 0;
                const maxRetries = 10;
                const retryInterval = setInterval(() => {
                    initializeAWSDataService();
                    if (awsDataService) {
                        clearInterval(retryInterval);
                        awsDataService.getItem(key).then(value => {
                            resolve(value);
                        }).catch(error => {
                            console.error('❌ AWS get error after retry:', key, error);
                            resolve(null);
                        });
                    } else if (retries >= maxRetries) {
                        clearInterval(retryInterval);
                        console.error('❌ AWS Data Service not available after', maxRetries, 'retries for:', key);
                        resolve(null);
                    }
                    retries++;
                }, 200);
            });
        }
    };

    // Override localStorage.removeItem
    localStorage.removeItem = function(key) {
        // Initialize AWS service if available
        initializeAWSDataService();
        
        if (awsDataService) {
            // Remove from AWS - no fallback
            awsDataService.removeItem(key).then(result => {
                if (result.success) {
                    console.log('✅ Data removed from AWS:', key);
                } else {
                    console.error('❌ Failed to remove from AWS:', key, result.error);
                }
            }).catch(error => {
                console.error('❌ AWS remove error:', key, error);
            });
        } else {
            // Wait and retry - no localStorage fallback
            let retries = 0;
            const maxRetries = 10;
            const retryInterval = setInterval(() => {
                initializeAWSDataService();
                if (awsDataService) {
                    clearInterval(retryInterval);
                    awsDataService.removeItem(key).catch(error => {
                        console.error('❌ Failed to remove from AWS after retry:', key, error);
                    });
                } else if (retries >= maxRetries) {
                    clearInterval(retryInterval);
                    console.error('❌ AWS Data Service not available after', maxRetries, 'retries for:', key);
                }
                retries++;
            }, 200);
        }
    };

    // Override localStorage.clear
    localStorage.clear = function() {
        // Initialize AWS service if available
        initializeAWSDataService();
        
        if (awsDataService) {
            // Clear AWS data - no fallback
            awsDataService.clear().then(result => {
                if (result.success) {
                    console.log('✅ Data cleared from AWS');
                } else {
                    console.error('❌ Failed to clear AWS data:', result.error);
                }
            }).catch(error => {
                console.error('❌ AWS clear error:', error);
            });
        } else {
            // Wait and retry - no localStorage fallback
            let retries = 0;
            const maxRetries = 10;
            const retryInterval = setInterval(() => {
                initializeAWSDataService();
                if (awsDataService) {
                    clearInterval(retryInterval);
                    awsDataService.clear().catch(error => {
                        console.error('❌ Failed to clear AWS after retry:', error);
                    });
                } else if (retries >= maxRetries) {
                    clearInterval(retryInterval);
                    console.error('❌ AWS Data Service not available after', maxRetries, 'retries for clear');
                }
                retries++;
            }, 200);
        }
    };

    // Monitor for AWS Data Service availability
    const checkForAWSDataService = setInterval(() => {
        if (window.awsDataService && !awsDataService) {
            awsDataService = window.awsDataService;
            console.log('✅ AWS Data Service detected and connected');
            clearInterval(checkForAWSDataService);
        }
    }, 100);

    // Listen for AWS Data Service ready event
    window.addEventListener('awsDataServiceReady', () => {
        if (window.awsDataService && !awsDataService) {
            awsDataService = window.awsDataService;
            console.log('✅ AWS Data Service connected via event');
            clearInterval(checkForAWSDataService);
        }
    });

    // Clean up interval after 30 seconds
    setTimeout(() => {
        clearInterval(checkForAWSDataService);
    }, 30000);

    console.log('🔄 localStorage replacement loaded - all data will be saved to AWS DynamoDB');
})();
