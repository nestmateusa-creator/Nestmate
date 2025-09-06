import { auth, db } from "./firebaseconfig.js";
import { EmailAuthProvider, reauthenticateWithCredential, deleteUser } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { doc, deleteDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

window.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('deleteAccountForm');
  if (!form) return;
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const password = document.getElementById('deletePassword').value.trim();
    const errorDiv = document.getElementById('deleteAccountError');
    const successDiv = document.getElementById('deleteAccountSuccess');
    errorDiv.textContent = '';
    successDiv.textContent = '';
    if (!password) {
      errorDiv.textContent = 'Please enter your password to confirm.';
      return;
    }
    const user = auth.currentUser;
    if (!user || !user.email) {
      errorDiv.textContent = 'No authenticated user found. Please sign in again.';
      return;
    }
    const credential = EmailAuthProvider.credential(user.email, password);
    try {
      await reauthenticateWithCredential(user, credential);

      // Delete all user dashboard data from Firestore
      const userDocRef = doc(db, 'users', user.uid);
      // Delete subcollections under users/{uid}/dashboard
      const dashboardCollections = [
        'dashboard/general',
        'dashboard/builder',
        'dashboard/bedrooms',
        'dashboard/bathrooms',
        'dashboard/roofs',
        'dashboard/crawlspace',
        'dashboard/appliances',
        // Add more if needed
      ];
      for (const path of dashboardCollections) {
        const ref = doc(db, `users/${user.uid}/${path}`);
        try { await deleteDoc(ref); } catch (e) { /* ignore if not found */ }
      }
      // Optionally, delete the user root doc
      try { await deleteDoc(userDocRef); } catch (e) { /* ignore if not found */ }

      await deleteUser(user);
      localStorage.removeItem('userProfile');
      successDiv.textContent = 'Your account and all dashboard data have been deleted.';
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
    } catch (err) {
      if (err.code === 'auth/wrong-password') {
        errorDiv.textContent = 'Incorrect password. Please try again.';
      } else if (err.code === 'auth/requires-recent-login') {
        errorDiv.textContent = 'Please sign in again to delete your account.';
      } else {
        errorDiv.textContent = err.message || 'Failed to delete account.';
      }
    }
  });
});
