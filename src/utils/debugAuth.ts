// Debug utilities for authentication issues
// Use these in browser console to troubleshoot auth problems

import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';

// Global debug functions for browser console
export const authDebug = {
  // Check current authentication state
  async checkAuthState() {
    console.log('🔍 Current Auth State Check:');
    console.log('Current user:', auth.currentUser);
    console.log('User email:', auth.currentUser?.email);
    console.log('User UID:', auth.currentUser?.uid);
    console.log('Email verified:', auth.currentUser?.emailVerified);
    
    if (auth.currentUser) {
      try {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        console.log('Firestore profile exists:', userDoc.exists());
        if (userDoc.exists()) {
          console.log('Firestore profile data:', userDoc.data());
        }
      } catch (error) {
        console.error('Error fetching Firestore profile:', error);
      }
    }
  },

  // Listen to auth state changes
  watchAuthState() {
    console.log('👂 Listening to auth state changes...');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('✅ User signed in:', {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          emailVerified: user.emailVerified
        });
      } else {
        console.log('❌ User signed out');
      }
    });
    
    // Stop listening after 30 seconds
    setTimeout(() => {
      unsubscribe();
      console.log('🛑 Stopped listening to auth state changes');
    }, 30000);
    
    return unsubscribe;
  },

  // Check Firestore connection
  async checkFirestore() {
    console.log('🔍 Checking Firestore connection...');
    try {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      console.log('✅ Firestore connected successfully');
      console.log(`📊 Found ${snapshot.size} users in Firestore`);
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        console.log(`User: ${data.email} (${data.role})`);
      });
    } catch (error) {
      console.error('❌ Firestore connection error:', error);
    }
  },

  // Test Google authentication
  async testGoogleAuth() {
    console.log('🧪 Testing Google Authentication...');
    try {
      const { firebaseAuthService } = await import('@/lib/firebase');
      const result = await firebaseAuthService.loginWithGoogle();
      console.log('✅ Google auth successful:', result);
    } catch (error) {
      console.error('❌ Google auth failed:', error);
    }
  },

  // Clear all auth data
  async clearAuth() {
    console.log('🧹 Clearing all authentication data...');
    try {
      await auth.signOut();
      localStorage.clear();
      sessionStorage.clear();
      console.log('✅ Auth data cleared');
      console.log('🔄 Please refresh the page');
    } catch (error) {
      console.error('❌ Error clearing auth:', error);
    }
  },

  // Check environment variables
  checkEnvVars() {
    console.log('🔍 Checking environment variables...');
    const requiredVars = [
      'VITE_FIREBASE_API_KEY',
      'VITE_FIREBASE_AUTH_DOMAIN',
      'VITE_FIREBASE_PROJECT_ID',
      'VITE_FIREBASE_STORAGE_BUCKET',
      'VITE_FIREBASE_MESSAGING_SENDER_ID',
      'VITE_FIREBASE_APP_ID'
    ];

    const missing = [];
    const present = [];

    requiredVars.forEach(varName => {
      const value = import.meta.env[varName];
      if (value) {
        present.push(varName);
        console.log(`✅ ${varName}: ${value.substring(0, 10)}...`);
      } else {
        missing.push(varName);
        console.log(`❌ ${varName}: NOT SET`);
      }
    });

    if (missing.length > 0) {
      console.error('❌ Missing environment variables:', missing);
      console.log('💡 Create a .env.local file with these variables');
    } else {
      console.log('✅ All environment variables are set');
    }
  },

  // Full diagnostic
  async runFullDiagnostic() {
    console.log('🏥 Running full authentication diagnostic...');
    console.log('================================================');
    
    // Check env vars
    this.checkEnvVars();
    console.log('');
    
    // Check auth state
    await this.checkAuthState();
    console.log('');
    
    // Check Firestore
    await this.checkFirestore();
    console.log('');
    
    console.log('✅ Diagnostic complete!');
    console.log('If you found issues, check the Firebase setup guide:');
    console.log('📖 See FIREBASE_SETUP.md for detailed instructions');
  }
};

// Make debug functions available globally in development
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  (window as any).authDebug = authDebug;
  console.log('🔧 Auth debug tools loaded! Use authDebug.runFullDiagnostic() to start');
}

export default authDebug;
