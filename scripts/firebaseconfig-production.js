// Firebase configuration for Production - www.nestmateus.com
// IMPORTANT: Replace these placeholder values with your actual Firebase project configuration

const firebaseConfig = {
    // Replace with your actual Firebase project API key
    apiKey: "YOUR_ACTUAL_FIREBASE_API_KEY",
    
    // Replace with your actual Firebase project auth domain
    authDomain: "your-project-id.firebaseapp.com",
    
    // Replace with your actual Firebase project ID
    projectId: "your-actual-project-id",
    
    // Replace with your actual Firebase storage bucket
    storageBucket: "your-project-id.appspot.com",
    
    // Replace with your actual Firebase messaging sender ID
    messagingSenderId: "YOUR_ACTUAL_SENDER_ID",
    
    // Replace with your actual Firebase app ID
    appId: "YOUR_ACTUAL_APP_ID",
    
    // Replace with your actual Firebase measurement ID (if using Analytics)
    measurementId: "G-YOUR_ACTUAL_MEASUREMENT_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Analytics (optional)
// firebase.analytics();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = firebaseConfig;
}


