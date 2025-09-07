// Script to fix all Firebase project IDs
const fs = require('fs');
const path = require('path');

// Files to fix
const filesToFix = [
    'upgrade-basic.html',
    'test-dashboard.html',
    'debug-dashboard.html',
    'cancel-subscription.html',
    'Sales.html',
    'firebase-setup.html',
    'cleanup-seller-user-profiles.html',
    'force-remove-cfgaidosh.html',
    'fix-all-account-separation.html',
    'SalesHomepage.html',
    'check-cfgaidosh-account.html',
    'test-dashboard-access.html',
    'working-signin-v8.html',
    'firebase-debug-test.html',
    'simple-signin-test.html',
    'test-signup-button.html',
    'test-main-pages.html',
    'diagnose-login-issue.html',
    'test-sales-dashboard.html',
    'test-account-separation.html',
    'debug-login.html',
    'create-test-user.html',
    'nestmate-sales-login-register.html',
    'auto-firebase-setup.html',
    'admin-login.html',
    'clear-auth-cache.html',
    'import-export-files.html',
    'emergency-contacts.html',
    'energy-audit.html',
    'document-manager.html',
    'maintenance-guide.html',
    'home-value-tracker.html',
    'home-shop.html',
    'insurance-claims.html',
    'expert-services.html',
    'signout.html'
];

function fixFirebaseConfig(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Replace project ID
        content = content.replace(/projectId: "nestmate-167ed"/g, 'projectId: "data-41fa8"');
        
        // Replace auth domain
        content = content.replace(/authDomain: "nestmate-167ed\.firebaseapp\.com"/g, 'authDomain: "data-41fa8.firebaseapp.com"');
        
        // Replace storage bucket
        content = content.replace(/storageBucket: "nestmate-167ed\.firebasestorage\.app"/g, 'storageBucket: "data-41fa8.firebasestorage.app"');
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed: ${filePath}`);
    } catch (error) {
        console.error(`Error fixing ${filePath}:`, error.message);
    }
}

// Fix all files
filesToFix.forEach(file => {
    if (fs.existsSync(file)) {
        fixFirebaseConfig(file);
    } else {
        console.log(`File not found: ${file}`);
    }
});

console.log('Firebase project ID fixes complete!');
