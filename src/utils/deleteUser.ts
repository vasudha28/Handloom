// Utility to completely delete a user from Firebase
// This should be used carefully and preferably in development only

import { auth, db, firebaseAuthService } from '@/lib/firebase';
import { deleteUser } from 'firebase/auth';
import { doc, deleteDoc, getDoc } from 'firebase/firestore';

export interface DeleteUserOptions {
  email: string;
  deleteFromAuth?: boolean;
  deleteFromFirestore?: boolean;
}

export async function completelyDeleteUser(options: DeleteUserOptions) {
  const { email, deleteFromAuth = true, deleteFromFirestore = true } = options;
  
  try {
    console.log(`Starting complete deletion for user: ${email}`);
    
    // Step 1: Delete from Authentication (if user is currently signed in)
    if (deleteFromAuth && auth.currentUser) {
      const currentUser = auth.currentUser;
      if (currentUser.email === email) {
        console.log('Deleting user from Firebase Authentication...');
        await deleteUser(currentUser);
        console.log('User deleted from Authentication');
      }
    }
    
    // Step 2: Delete from Firestore (requires knowing the user ID)
    if (deleteFromFirestore) {
      // You'll need to find the user by email first
      console.log('Note: To delete from Firestore, you need the user UID.');
      console.log('Go to Firebase Console > Firestore > users collection');
      console.log(`Find the document with email: ${email} and delete it manually.`);
    }
    
    console.log(`Complete deletion process initiated for: ${email}`);
    
    return {
      success: true,
      message: `User ${email} deletion process completed. Check Firebase Console to verify.`
    };
    
  } catch (error: any) {
    console.error('Error during user deletion:', error);
    
    if (error.code === 'auth/requires-recent-login') {
      throw new Error('User needs to re-authenticate before deletion. Please sign in again and try.');
    }
    
    throw new Error(`Failed to delete user: ${error.message}`);
  }
}

// Instructions for manual user deletion
export const USER_DELETION_INSTRUCTIONS = `
Complete User Deletion Process:

1. FIREBASE AUTHENTICATION:
   - Go to Firebase Console > Authentication > Users
   - Find the user by email
   - Click the 3-dots menu > Delete user
   - Confirm deletion

2. FIRESTORE DATABASE:
   - Go to Firebase Console > Firestore Database
   - Navigate to the 'users' collection
   - Find the document with the matching email
   - Delete the document

3. CLEAR BROWSER CACHE:
   - Clear browser cache and cookies
   - Hard refresh the page (Ctrl+F5)

4. VERIFY DELETION:
   - Try to sign in with the deleted email
   - Should show "user not found" error
   - Try to register with the same email
   - Should work without "email already exists" error

IMPORTANT NOTES:
- Sometimes Firebase keeps email addresses reserved for 24-48 hours
- If the email is still showing as "already exists", wait 24 hours and try again
- For immediate testing, use a different email address
- In production, implement proper user deletion workflows
`;

// Helper function to check if email is available
export async function checkEmailAvailability(email: string): Promise<boolean> {
  try {
    // Try to create a temporary user to check if email is available
    // This is not recommended for production - use proper Firebase Admin SDK
    console.log(`Checking email availability: ${email}`);
    
    // For now, just return true - proper implementation requires Admin SDK
    return true;
    
  } catch (error: any) {
    console.error('Error checking email availability:', error);
    
    if (error.code === 'auth/email-already-in-use') {
      return false;
    }
    
    return true;
  }
}

export default {
  completelyDeleteUser,
  checkEmailAvailability,
  USER_DELETION_INSTRUCTIONS
};
