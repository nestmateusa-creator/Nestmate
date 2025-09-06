// Account Manager - Simple and Clean Account Management
// This file handles account deletion and management without complex detection logic

class AccountManager {
    constructor(firebaseAuth, firebaseDB, firebaseServices) {
        this.auth = firebaseAuth;
        this.db = firebaseDB;
        this.services = firebaseServices;
    }

    // Simple account deletion - only deletes data for the current user's UID
    async deleteCurrentUserAccount(password) {
        try {
            const user = this.auth.currentUser;
            if (!user) {
                throw new Error('No authenticated user found');
            }

            console.log('Starting account deletion for user:', user.uid);

            // Re-authenticate user with password
            const credential = this.services.EmailAuthProvider.credential(user.email, password);
            await this.services.reauthenticateWithCredential(user, credential);
            console.log('User re-authenticated successfully');

            // Delete all data associated with this user's UID only
            await this.deleteUserDataByUID(user.uid);

            // Sign out and redirect
            await this.services.signOut(this.auth);
            console.log('User signed out');

            return {
                success: true,
                message: 'Your profile and all associated data have been permanently deleted.'
            };

        } catch (error) {
            console.error('Error deleting account:', error);
            return {
                success: false,
                error: this.getErrorMessage(error)
            };
        }
    }

    // Delete all user data by UID (simple and safe)
    async deleteUserDataByUID(uid) {
        console.log('Deleting all data for UID:', uid);

        const collections = [
            'userProfiles',
            'salesReps',
            'homes',
            'tasks',
            'reminders',
            'files',
            'warranties',
            'homeDetails'
        ];

        for (const collectionName of collections) {
            await this.deleteFromCollection(collectionName, uid);
        }

        // Delete calendar settings
        try {
            const calendarSettingsRef = this.services.doc(this.db, 'calendarSettings', uid);
            await this.services.deleteDoc(calendarSettingsRef);
            console.log('Calendar settings deleted');
        } catch (error) {
            console.log('Calendar settings not found or already deleted');
        }
    }

    // Delete documents from a collection by user ID
    async deleteFromCollection(collectionName, uid) {
        try {
            if (collectionName === 'userProfiles' || collectionName === 'salesReps') {
                // For profile collections, try to delete by document ID first
                try {
                    const docRef = this.services.doc(this.db, collectionName, uid);
                    await this.services.deleteDoc(docRef);
                    console.log(`${collectionName} document deleted`);
                } catch (error) {
                    console.log(`${collectionName} document not found or already deleted`);
                }
            } else {
                // For other collections, query by userId field
                const collectionRef = this.services.collection(this.db, collectionName);
                const query = this.services.query(collectionRef, this.services.where('userId', '==', uid));
                const snapshot = await this.services.getDocs(query);
                
                if (!snapshot.empty) {
                    const deletePromises = snapshot.docs.map(doc => 
                        this.services.deleteDoc(doc.ref)
                    );
                    await Promise.all(deletePromises);
                    console.log(`${collectionName} documents deleted:`, snapshot.docs.length);
                } else {
                    console.log(`No ${collectionName} documents found for user`);
                }
            }
        } catch (error) {
            console.log(`Error deleting from ${collectionName}:`, error);
        }
    }

    // Get user-friendly error message
    getErrorMessage(error) {
        if (error.code === 'auth/wrong-password') {
            return 'Incorrect password. Please try again.';
        } else if (error.code === 'auth/requires-recent-login') {
            return 'For security reasons, please sign out and sign in again before deleting your profile.';
        } else if (error.code === 'auth/user-not-found') {
            return 'User account not found. It may have already been deleted.';
        } else {
            return error.message || 'An error occurred while deleting your account.';
        }
    }

    // Check if user has multiple accounts with same email
    async checkMultipleAccounts(email) {
        try {
            const userProfilesRef = this.services.collection(this.db, 'userProfiles');
            const userProfilesQuery = this.services.query(userProfilesRef, this.services.where('email', '==', email));
            const userProfilesSnapshot = await this.services.getDocs(userProfilesQuery);

            const salesRepsRef = this.services.collection(this.db, 'salesReps');
            const salesRepsQuery = this.services.query(salesRepsRef, this.services.where('email', '==', email));
            const salesRepsSnapshot = await this.services.getDocs(salesRepsQuery);

            const totalAccounts = userProfilesSnapshot.size + salesRepsSnapshot.size;
            
            return {
                hasMultiple: totalAccounts > 1,
                totalAccounts: totalAccounts,
                userProfiles: userProfilesSnapshot.size,
                salesReps: salesRepsSnapshot.size
            };
        } catch (error) {
            console.error('Error checking multiple accounts:', error);
            return { hasMultiple: false, totalAccounts: 0 };
        }
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AccountManager;
} else {
    window.AccountManager = AccountManager;
}


