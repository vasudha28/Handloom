// Script to help resolve "email already exists" issue after deletion
// Run this in browser console or as a one-time utility

import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, deleteUser, signOut } from 'firebase/auth';

export async function attemptEmailCleanup(email: string, knownPassword?: string) {
  console.log(`🔧 Attempting to clean up email: ${email}`);
  
  try {
    // Method 1: Try to sign in and delete if successful
    if (knownPassword) {
      console.log('🔑 Attempting sign-in with known password...');
      
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, knownPassword);
        const user = userCredential.user;
        
        console.log('✅ Sign-in successful, deleting user...');
        await deleteUser(user);
        console.log('✅ User deleted successfully from Authentication');
        
        return {
          success: true,
          method: 'auth-deletion',
          message: 'User was found and deleted from Firebase Authentication'
        };
        
      } catch (signInError: any) {
        console.log('❌ Sign-in failed:', signInError.message);
        
        if (signInError.code === 'auth/user-not-found') {
          console.log('✅ User not found in Authentication - email should be available');
          return {
            success: true,
            method: 'not-found',
            message: 'User not found in Authentication - email should be available for registration'
          };
        }
      }
    }
    
    // Method 2: Check if we're currently signed in as this user
    const currentUser = auth.currentUser;
    if (currentUser && currentUser.email === email) {
      console.log('🔑 Currently signed in as this user, deleting...');
      await deleteUser(currentUser);
      console.log('✅ Current user deleted successfully');
      
      return {
        success: true,
        method: 'current-user-deletion',
        message: 'Current user deleted from Firebase Authentication'
      };
    }
    
    // Method 3: Sign out and clear any cached auth state
    console.log('🔄 Clearing authentication state...');
    await signOut(auth);
    
    // Clear any localStorage/sessionStorage that might be caching auth state
    localStorage.clear();
    sessionStorage.clear();
    
    console.log('✅ Auth state cleared');
    
    return {
      success: true,
      method: 'state-cleared',
      message: 'Authentication state cleared. Try registering again after refreshing the page.'
    };
    
  } catch (error: any) {
    console.error('❌ Error during cleanup:', error);
    
    return {
      success: false,
      error: error.message,
      recommendations: [
        'Wait 24-48 hours for Firebase to release the email',
        'Use a different email address for testing',
        'Check Firebase Console > Authentication > Users for the email',
        'Check Firebase Console > Firestore > users collection'
      ]
    };
  }
}

// Quick fix for browser console
export function quickEmailFix(email: string) {
  console.log(`
🚀 Quick Email Fix for: ${email}

Run these commands in your browser console:

1. Clear all storage:
   localStorage.clear();
   sessionStorage.clear();

2. Sign out:
   firebase.auth().signOut();

3. Hard refresh the page:
   location.reload(true);

4. If still not working, check Firebase Console:
   - Authentication > Users (delete user if exists)
   - Firestore > users collection (delete document if exists)

5. Wait 24 hours if the issue persists.
  `);
}

// Export for console usage
if (typeof window !== 'undefined') {
  (window as any).fixEmail = attemptEmailCleanup;
  (window as any).quickEmailFix = quickEmailFix;
}

export default {
  attemptEmailCleanup,
  quickEmailFix
};
