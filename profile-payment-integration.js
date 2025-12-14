// Payment Management Integration for Profile Page
// Add this script to profile.html after AWS auth initialization

let paymentSystem;
let currentSubscription = null;
let selectedPlan = null;

// Initialize payment management when profile loads
async function initPaymentManagement() {
    try {
        if (typeof StripePaymentSystem === 'undefined') {
            console.error('StripePaymentSystem not loaded');
            return;
        }

        // Wait for auth to be ready
        if (!window.nestMateAuth || !nestMateAuth.currentUser) {
            console.log('User not authenticated, skipping payment management');
            return;
        }

        paymentSystem = new StripePaymentSystem();
        await loadSubscriptionInfo();
        await loadPlans();
        await loadPaymentMethods();
        
        // Check for lock
        const isLocked = await paymentSystem.checkDashboardLock();
        if (isLocked) {
            document.getElementById('lockedWarning').style.display = 'block';
        }

        document.getElementById('paymentManagementCard').style.display = 'block';
    } catch (error) {
        console.error('Error initializing payment management:', error);
    }
}

// Load subscription info
async function loadSubscriptionInfo() {
    try {
        currentSubscription = await paymentSystem.getUserSubscription();
        
        if (!currentSubscription) {
            document.getElementById('currentPlanName').textContent = 'No subscription';
            document.getElementById('subscriptionStatusBadge').textContent = 'Inactive';
            document.getElementById('subscriptionStatusBadge').className = 'status-badge status-inactive';
            return;
        }

        const plans = paymentSystem.getPlans();
        const currentPlan = Object.values(plans).find(p => p.subscriptionType === currentSubscription.subscription);

        document.getElementById('currentPlanName').textContent = currentPlan ? currentPlan.name : currentSubscription.subscription;
        
        const statusClass = currentSubscription.isLocked ? 'status-locked' : 
                          (currentSubscription.status === 'active' ? 'status-active' : 'status-inactive');
        const statusText = currentSubscription.isLocked ? 'Locked' : 
                         (currentSubscription.status === 'active' ? 'Active' : 'Inactive');
        
        document.getElementById('subscriptionStatusBadge').textContent = statusText;
        document.getElementById('subscriptionStatusBadge').className = `status-badge ${statusClass}`;

        if (currentSubscription.lastPayment) {
            document.getElementById('lastPaymentRow').style.display = 'flex';
            document.getElementById('lastPaymentDate').textContent = new Date(currentSubscription.lastPayment).toLocaleDateString();
        }

        if (currentSubscription.paymentFailedAt) {
            document.getElementById('paymentFailedRow').style.display = 'flex';
            document.getElementById('paymentFailedDate').textContent = new Date(currentSubscription.paymentFailedAt).toLocaleDateString();
        }
    } catch (error) {
        console.error('Error loading subscription info:', error);
    }
}

// Load plans for selection
function loadPlans() {
    const plans = paymentSystem.getPlans();
    const selectorGrid = document.getElementById('planSelectorGrid');
    
    selectorGrid.innerHTML = Object.keys(plans).map(planKey => {
        const plan = plans[planKey];
        const isCurrent = currentSubscription && plan.subscriptionType === currentSubscription.subscription;
        
        return `
            <div class="plan-option ${isCurrent ? 'selected' : ''}" data-plan="${planKey}" onclick="selectPlanOption('${planKey}')" style="border: 2px solid ${isCurrent ? '#667eea' : '#e2e8f0'}; border-radius: 8px; padding: 16px; cursor: pointer; transition: all 0.2s; background: ${isCurrent ? '#eef2ff' : 'white'};">
                <div style="font-weight: 600; color: #1e293b; margin-bottom: 4px;">${plan.name}</div>
                <div style="color: #64748b; font-size: 0.875rem;">$${plan.price}/month</div>
            </div>
        `;
    }).join('');
}

// Select plan option
function selectPlanOption(planKey) {
    document.querySelectorAll('.plan-option').forEach(opt => opt.classList.remove('selected'));
    const selected = document.querySelector(`[data-plan="${planKey}"]`);
    if (selected) {
        selected.classList.add('selected');
        selected.style.borderColor = '#667eea';
        selected.style.background = '#eef2ff';
    }
    selectedPlan = planKey;
    document.getElementById('changePlanBtn').disabled = false;
}

// Handle plan change
async function handlePlanChange() {
    if (!selectedPlan) {
        alert('Please select a plan first.');
        return;
    }

    if (currentSubscription && 
        paymentSystem.getPlans()[selectedPlan].subscriptionType === currentSubscription.subscription) {
        alert('This is already your current plan.');
        return;
    }

    if (!confirm(`Are you sure you want to change to the ${paymentSystem.getPlans()[selectedPlan].name} plan?`)) {
        return;
    }

    try {
        const btn = document.getElementById('changePlanBtn');
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

        await paymentSystem.changeSubscription(selectedPlan);
        
        alert('Plan changed successfully! Redirecting...');
    } catch (error) {
        console.error('Error changing plan:', error);
        alert(error.message || 'Failed to change plan. Please try again.');
        
        const btn = document.getElementById('changePlanBtn');
        btn.disabled = false;
        btn.innerHTML = 'Change Plan';
    }
}

// Load payment methods
async function loadPaymentMethods() {
    try {
        const methods = await paymentSystem.getPaymentMethods();
        const methodsDiv = document.getElementById('paymentMethodsList');
        
        if (methods.length === 0) {
            methodsDiv.innerHTML = '<p style="color: #64748b; margin-bottom: 16px;">No payment methods on file.</p>';
            return;
        }

        methodsDiv.innerHTML = methods.map(method => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 12px; background: white;">
                <div style="flex: 1;">
                    <div style="font-weight: 600; color: #1e293b; margin-bottom: 4px;">${method.type === 'card' ? '💳 Card' : method.type}</div>
                    <div style="color: #64748b; font-size: 0.875rem;">
                        ${method.type === 'card' ? `${method.card.brand.toUpperCase()} •••• ${method.card.last4}` : method.id}
                        ${method.isDefault ? ' (Default)' : ''}
                    </div>
                </div>
                <div style="display: flex; gap: 8px;">
                    ${!method.isDefault ? `
                        <button class="btn btn-small btn-secondary" onclick="setDefaultPaymentMethod('${method.id}')" style="padding: 6px 12px; font-size: 0.875rem;">
                            Set Default
                        </button>
                    ` : ''}
                    <button class="btn btn-small btn-danger" onclick="deletePaymentMethod('${method.id}')" style="padding: 6px 12px; font-size: 0.875rem; background: #ef4444; color: white;">
                        Delete
                    </button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading payment methods:', error);
    }
}

// Add payment method
async function addPaymentMethod() {
    try {
        await paymentSystem.addPaymentMethod();
        await loadPaymentMethods();
        alert('Payment method added successfully!');
    } catch (error) {
        console.error('Error adding payment method:', error);
        alert(error.message || 'Failed to add payment method.');
    }
}

// Set default payment method
async function setDefaultPaymentMethod(paymentMethodId) {
    try {
        await paymentSystem.setDefaultPaymentMethod(paymentMethodId);
        await loadPaymentMethods();
        alert('Default payment method updated.');
    } catch (error) {
        console.error('Error setting default payment method:', error);
        alert(error.message || 'Failed to update payment method.');
    }
}

// Delete payment method
async function deletePaymentMethod(paymentMethodId) {
    if (!confirm('Are you sure you want to delete this payment method?')) {
        return;
    }

    try {
        await paymentSystem.deletePaymentMethod(paymentMethodId);
        await loadPaymentMethods();
        alert('Payment method deleted.');
    } catch (error) {
        console.error('Error deleting payment method:', error);
        alert(error.message || 'Failed to delete payment method.');
    }
}

// Retry payment
async function retryPayment() {
    try {
        const result = await paymentSystem.retryPayment();
        if (result.success) {
            alert('Payment successful! Dashboard unlocked.');
            location.reload();
        } else {
            alert(result.error || 'Payment failed. Please update your payment method.');
        }
    } catch (error) {
        console.error('Error retrying payment:', error);
        alert(error.message || 'Failed to retry payment.');
    }
}

// Open customer portal
async function openCustomerPortal() {
    try {
        await paymentSystem.openCustomerPortal();
    } catch (error) {
        console.error('Error opening customer portal:', error);
        alert(error.message || 'Failed to open customer portal.');
    }
}

// Cancel subscription
async function cancelSubscription() {
    if (!confirm('Are you sure you want to cancel your subscription? You will lose access to premium features.')) {
        return;
    }

    try {
        await paymentSystem.cancelSubscription();
        alert('Subscription cancelled successfully.');
        location.reload();
    } catch (error) {
        console.error('Error cancelling subscription:', error);
        alert(error.message || 'Failed to cancel subscription.');
    }
}

// Initialize when page loads (if using AWS auth)
if (window.nestMateAuth) {
    // Wait for auth to initialize
    setTimeout(() => {
        if (nestMateAuth.currentUser) {
            initPaymentManagement();
        }
    }, 1000);
}

