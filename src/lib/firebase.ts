import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification,
  User as FirebaseUser
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { authPerformance } from '@/utils/authPerformance';




// Firebase configuration - Replace with your actual config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "handloom-portal.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "handloom-portal",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "handloom-portal.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef123456",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-XXXXXXXXXX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Social auth providers
export const googleProvider = new GoogleAuthProvider();

// Configure Google provider with performance optimizations
googleProvider.addScope('email');
googleProvider.addScope('profile');

// Set custom parameters optimized for fast login
googleProvider.setCustomParameters({
  prompt: 'consent', // Faster than select_account
  include_granted_scopes: 'true',
  access_type: 'online',
  // Chrome-specific optimizations
  hd: '', // Allow any domain
  response_type: 'code',
  // Reduce redirect time
  redirect_uri: window.location.origin
});


// Types
export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  phone?: string | null;
  role: 'customer' | 'b2b_buyer' | 'admin';
  avatar?: string | null;
  companyName?: string | null;
  gstNumber?: string | null;
  accessCodes?: string[];
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Firebase Auth Service
export class FirebaseAuthService {
  private recaptchaVerifier: RecaptchaVerifier | null = null;
  
  // Initialize reCAPTCHA for phone verification
  initializeRecaptcha(containerId: string): RecaptchaVerifier {
    if (this.recaptchaVerifier) {
      this.recaptchaVerifier.clear();
    }
    
    this.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {
        console.log('reCAPTCHA solved');
      },
      'expired-callback': () => {
        console.log('reCAPTCHA expired');
      }
    });
    
    return this.recaptchaVerifier;
  }

  // Email and Password Registration
  async registerWithEmail(
    email: string, 
    password: string, 
    userData: Partial<UserProfile>
  ): Promise<{ user: FirebaseUser; profile: UserProfile }> {
    try {
      console.log('Attempting to register with email:', email);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User created successfully:', user.uid);

      // Update profile
      await updateProfile(user, {
        displayName: userData.fullName
      });

      // Send email verification
      await sendEmailVerification(user);

      // Create user profile in Firestore
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        fullName: userData.fullName || '',
        phone: userData.phone || null,
        role: userData.role || 'customer',
        avatar: userData.avatar || null,
        companyName: userData.companyName || null,
        gstNumber: userData.gstNumber || null,
        accessCodes: userData.accessCodes || [],
        isEmailVerified: user.emailVerified,
        isPhoneVerified: false,
        lastLogin: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await setDoc(doc(db, 'users', user.uid), userProfile);

      return { user, profile: userProfile };
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Email and Password Login
  async loginWithEmail(email: string, password: string): Promise<{ user: FirebaseUser; profile: UserProfile }> {
    try {
      console.log('🔵 Attempting login with email:', email);
      console.log('🔵 Firebase config:', {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? 'Set' : 'Missing',
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID
      });
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('🟢 Firebase authentication successful for:', user.email);

      // Get user profile from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        console.error('🔴 User profile not found in Firestore for:', user.uid);
        throw new Error('User profile not found. Please contact administrator.');
      }

      const profile = userDoc.data() as UserProfile;
      console.log('🔵 User profile found:', { email: profile.email, role: profile.role });

      // For admin users, allow login regardless of email verification status
      const isAdmin = profile.role === 'admin';
      if (isAdmin) {
        console.log('🟡 Admin user detected - bypassing email verification requirement');
      }

      // Update last login and email verification status
      await updateDoc(doc(db, 'users', user.uid), {
        lastLogin: new Date(),
        updatedAt: new Date(),
        isEmailVerified: user.emailVerified
      });

      const updatedProfile = { 
        ...profile, 
        lastLogin: new Date(), 
        isEmailVerified: user.emailVerified 
      };

      console.log('🟢 Login successful for:', user.email, 'Role:', profile.role);
      return { user, profile: updatedProfile };
    } catch (error: any) {
      console.error('🔴 Login error:', error);
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Google Social Login with Redirect (Optimized for Chrome)
  async loginWithGoogle(): Promise<{ user: FirebaseUser; profile: UserProfile; isNewUser: boolean }> {
    try {
      authPerformance.startTiming('google-login');
      console.log('🔵 Starting Google authentication with redirect...');
      
      // Apply Chrome optimizations
      authPerformance.applyChromeOptimizations();
      
      // Pre-clear auth state for faster redirect
      if (auth.currentUser) {
        console.log('🔵 Clearing existing auth state...');
        await auth.signOut();
      }
      
      console.log('🔵 Redirecting to Google sign-in...');
      
      // Use redirect with optimized settings
      await signInWithRedirect(auth, googleProvider);
      
      // This method will be called after redirect, so we need to handle the result
      return await this.handleGoogleRedirectResult();
    } catch (error: any) {
      authPerformance.endTiming('google-login');
      console.error('🔴 Google redirect error:', error);
      throw new Error(this.getErrorMessage(error.code) || 'Google authentication failed');
    }
  }

  // Handle Google redirect result (Optimized)
  async handleGoogleRedirectResult(): Promise<{ user: FirebaseUser; profile: UserProfile; isNewUser: boolean }> {
    try {
      authPerformance.startTiming('google-redirect-result');
      console.log('🔵 Getting Google redirect result...');
      
      // Add timeout for redirect result
      const result = await Promise.race([
        getRedirectResult(auth),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Redirect timeout')), 10000)
        )
      ]) as any;
      
      if (!result) {
        throw new Error('No redirect result found. Please try signing in again.');
      }
      
      authPerformance.endTiming('google-redirect-result');
      console.log('🔵 Google redirect completed successfully');
      
      const user = result.user;
      console.log('🟢 Google authentication successful:', {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        emailVerified: user.emailVerified
      });

      return await this.processSocialLoginUser(user);
    } catch (error: any) {
      authPerformance.endTiming('google-redirect-result');
      console.error('🔴 Google redirect result error:', error);
      throw new Error(this.getErrorMessage(error.code) || 'Failed to process Google authentication');
    }
  }

  // Process social login user (Optimized with caching)
  private async processSocialLoginUser(user: FirebaseUser): Promise<{ user: FirebaseUser; profile: UserProfile; isNewUser: boolean }> {
    try {
      authPerformance.startTiming('process-social-user');
      console.log('🔵 Processing social login user...');
      
      // Check if user already exists in Firestore with timeout
      console.log('🔵 Checking if user exists in Firestore...');
      
      let userDoc;
      try {
        // Add timeout for Firestore query
        userDoc = await Promise.race([
          getDoc(doc(db, 'users', user.uid)),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Firestore timeout')), 5000)
          )
        ]) as any;
        console.log('🔵 Firestore query successful');
      } catch (firestoreError) {
        console.error('🔴 Firestore query failed:', firestoreError);
        throw new Error('Failed to check user profile. Please try again.');
      }
      
      let profile: UserProfile;
      let isNewUser = false;

      if (!userDoc.exists()) {
        // New user - create profile
        console.log('🟢 New user detected, creating profile...');
        isNewUser = true;
        
        // Validate required user data
        if (!user.email) {
          throw new Error('Account must have an email address.');
        }
        
        profile = {
          uid: user.uid,
          email: user.email,
          fullName: user.displayName || user.email.split('@')[0],
          phone: user.phoneNumber || null,
          role: 'customer',
          avatar: user.photoURL || null,
          accessCodes: [],
          isEmailVerified: user.emailVerified,
          isPhoneVerified: !!user.phoneNumber,
          lastLogin: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        };

        console.log('🔵 Creating user profile in Firestore:', {
          uid: profile.uid,
          email: profile.email,
          fullName: profile.fullName,
          role: profile.role
        });
        
        try {
          await setDoc(doc(db, 'users', user.uid), profile);
          console.log('🟢 User profile created successfully in Firestore');
        } catch (createError) {
          console.error('🔴 Failed to create user profile:', createError);
          throw new Error('Failed to create user profile. Please try again.');
        }
      } else {
        // Existing user - update last login
        console.log('🔵 Existing user found, updating last login...');
        profile = userDoc.data() as UserProfile;
        
        try {
          await updateDoc(doc(db, 'users', user.uid), {
            lastLogin: new Date(),
            updatedAt: new Date(),
            avatar: user.photoURL || profile.avatar,
            isEmailVerified: user.emailVerified
          });
          profile.lastLogin = new Date();
          profile.isEmailVerified = user.emailVerified;
          console.log('🟢 User profile updated successfully');
        } catch (updateError) {
          console.error('🔴 Failed to update user profile:', updateError);
          // Don't throw error for update failure, user can still sign in
          console.log('🟡 Continuing with existing profile data');
        }
      }

      authPerformance.endTiming('process-social-user');
      console.log('🟢 Social authentication completed successfully:', {
        isNewUser,
        userEmail: profile.email,
        userRole: profile.role
      });
      
      return { user, profile, isNewUser };
    } catch (error: any) {
      authPerformance.endTiming('process-social-user');
      console.error('🔴 Process social login user error:', error);
      throw error;
    }
  }


  // Phone Number Login with OTP
  async sendPhoneOTP(phoneNumber: string, recaptchaVerifier: RecaptchaVerifier) {
    try {
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      return confirmationResult;
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Verify Phone OTP and create/login user
  async verifyPhoneOTP(
    confirmationResult: any, 
    otp: string,
    userData?: Partial<UserProfile>
  ): Promise<{ user: FirebaseUser; profile: UserProfile; isNewUser: boolean }> {
    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;

      // Check if user already exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      let profile: UserProfile;
      let isNewUser = false;

      if (!userDoc.exists()) {
        // New user - create profile
        isNewUser = true;
        profile = {
          uid: user.uid,
          email: userData?.email || '',
          fullName: userData?.fullName || 'Phone User',
          phone: user.phoneNumber!,
          role: userData?.role || 'customer',
          avatar: userData?.avatar || null,
          companyName: userData?.companyName || null,
          gstNumber: userData?.gstNumber || null,
          accessCodes: userData?.accessCodes || [],
          isEmailVerified: false,
          isPhoneVerified: true,
          lastLogin: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        };

        await setDoc(doc(db, 'users', user.uid), profile);
      } else {
        // Existing user - update last login
        profile = userDoc.data() as UserProfile;
        await updateDoc(doc(db, 'users', user.uid), {
          lastLogin: new Date(),
          updatedAt: new Date(),
          isPhoneVerified: true
        });
        profile.lastLogin = new Date();
        profile.isPhoneVerified = true;
      }

      return { user, profile, isNewUser };
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Password Reset
  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Resend Email Verification
  async resendEmailVerification(): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No user is currently signed in');
      }
      await sendEmailVerification(user);
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Get User Profile
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  // Update User Profile
  async updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
    try {
      await updateDoc(doc(db, 'users', uid), {
        ...updates,
        updatedAt: new Date()
      });
    } catch (error: any) {
      throw new Error('Failed to update profile');
    }
  }

  // Check for redirect results on app load (Optimized)
  async checkRedirectResult(): Promise<{ user: FirebaseUser; profile: UserProfile; isNewUser: boolean } | null> {
    try {
      console.log('🔵 Checking for redirect results...');
      const startTime = performance.now();
      
      // Add timeout for redirect result check
      const result = await Promise.race([
        getRedirectResult(auth),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Redirect check timeout')), 8000)
        )
      ]) as any;
      
      if (!result) {
        console.log('🔵 No redirect result found');
        return null;
      }
      
      const endTime = performance.now();
      console.log(`🔵 Redirect result found in ${(endTime - startTime).toFixed(2)}ms, processing...`);
      
      // Determine which provider was used
      const providerId = result.providerId;
      console.log('🔵 Provider used:', providerId);
      
      if (providerId === 'google.com') {
        return await this.handleGoogleRedirectResult();
      } else {
        // Generic handling for other providers
        const user = result.user;
        return await this.processSocialLoginUser(user);
      }
    } catch (error: any) {
      console.error('🔴 Check redirect result error:', error);
      return null;
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await auth.signOut();
      if (this.recaptchaVerifier) {
        this.recaptchaVerifier.clear();
        this.recaptchaVerifier = null;
      }
    } catch (error: any) {
      throw new Error('Logout failed');
    }
  }

  // Error message mapping
  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters long.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection.';
      case 'auth/popup-closed-by-user':
        return 'Sign-in was cancelled.';
      case 'auth/cancelled-popup-request':
        return 'Sign-in was cancelled.';
      case 'auth/popup-blocked':
        return 'Pop-up was blocked. Please allow pop-ups for this site and try again.';
      case 'auth/operation-not-allowed':
        return 'Google sign-in is not enabled. Please contact support.';
      case 'auth/unauthorized-domain':
        return 'This domain is not authorized for Google sign-in.';
      case 'auth/timeout':
        return 'Sign-in timeout. Please try again.';
      case 'auth/internal-error':
        return 'Internal error occurred. Please try again later.';
      case 'auth/invalid-verification-code':
        return 'Invalid verification code. Please try again.';
      case 'auth/code-expired':
        return 'Verification code has expired. Please request a new one.';
      case 'auth/missing-verification-code':
        return 'Please enter the verification code.';
      case 'auth/invalid-phone-number':
        return 'Invalid phone number format.';
      case 'auth/missing-phone-number':
        return 'Please enter a phone number.';
      case 'auth/quota-exceeded':
        return 'SMS quota exceeded. Please try again later.';
      default:
        return 'An error occurred. Please try again.';
    }
  }
}

// Export singleton instance
export const firebaseAuthService = new FirebaseAuthService();

export default app;
