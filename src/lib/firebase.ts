import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  FacebookAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification,
  User as FirebaseUser
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

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
export const facebookProvider = new FacebookAuthProvider();

// Configure Google provider
googleProvider.addScope('email');
googleProvider.addScope('profile');

// Configure Facebook provider
facebookProvider.addScope('email');
facebookProvider.addScope('public_profile');

// Types
export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  phone?: string;
  role: 'customer' | 'b2b_buyer' | 'admin';
  avatar?: string;
  companyName?: string;
  gstNumber?: string;
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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

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
        phone: userData.phone,
        role: userData.role || 'customer',
        avatar: userData.avatar,
        companyName: userData.companyName,
        gstNumber: userData.gstNumber,
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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get user profile from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        throw new Error('User profile not found');
      }

      const profile = userDoc.data() as UserProfile;

      // Update last login
      await updateDoc(doc(db, 'users', user.uid), {
        lastLogin: new Date(),
        updatedAt: new Date()
      });

      return { user, profile: { ...profile, lastLogin: new Date() } };
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Google Social Login
  async loginWithGoogle(): Promise<{ user: FirebaseUser; profile: UserProfile; isNewUser: boolean }> {
    try {
      const result = await signInWithPopup(auth, googleProvider);
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
          email: user.email!,
          fullName: user.displayName || '',
          phone: user.phoneNumber || undefined,
          role: 'customer',
          avatar: user.photoURL || undefined,
          accessCodes: [],
          isEmailVerified: user.emailVerified,
          isPhoneVerified: !!user.phoneNumber,
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
          avatar: user.photoURL || profile.avatar // Update avatar if changed
        });
        profile.lastLogin = new Date();
      }

      return { user, profile, isNewUser };
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Facebook Social Login
  async loginWithFacebook(): Promise<{ user: FirebaseUser; profile: UserProfile; isNewUser: boolean }> {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
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
          email: user.email!,
          fullName: user.displayName || '',
          phone: user.phoneNumber || undefined,
          role: 'customer',
          avatar: user.photoURL || undefined,
          accessCodes: [],
          isEmailVerified: user.emailVerified,
          isPhoneVerified: !!user.phoneNumber,
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
          avatar: user.photoURL || profile.avatar
        });
        profile.lastLogin = new Date();
      }

      return { user, profile, isNewUser };
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
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
          avatar: userData?.avatar,
          companyName: userData?.companyName,
          gstNumber: userData?.gstNumber,
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
        return 'Pop-up was blocked. Please allow pop-ups for this site.';
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
