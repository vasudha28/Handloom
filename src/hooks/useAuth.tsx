import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth, firebaseAuthService, UserProfile } from '@/lib/firebase';

// Types - Use Firebase UserProfile
interface User extends UserProfile {
  id: string; // Map uid to id for compatibility
}

interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

interface RegisterData {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
  role: 'customer' | 'b2b_buyer' | 'admin';
  companyName?: string;
  gstNumber?: string;
  accessCode?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<{ user: any; profile: UserProfile }>;
  register: (data: RegisterData) => Promise<void>;
  loginWithGoogle: () => Promise<{ user: any; profile: UserProfile; isNewUser: boolean }>;
  loginWithFacebook: () => Promise<{ user: any; profile: UserProfile; isNewUser: boolean }>;
  loginWithPhone: (phone: string) => Promise<any>; // Returns confirmation result
  verifyPhoneOTP: (confirmationResult: any, otp: string, userData?: Partial<UserProfile>) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resendEmailVerification: () => Promise<void>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
  initializeRecaptcha: (containerId: string) => any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to convert Firebase UserProfile to User
const mapFirebaseUserToUser = (profile: UserProfile): User => ({
  ...profile,
  id: profile.uid
});

// Auth Provider Component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Firebase auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      try {
        if (firebaseUser) {
          // User is signed in
          const profile = await firebaseAuthService.getUserProfile(firebaseUser.uid);
          if (profile) {
            setUser(mapFirebaseUserToUser(profile));
          } else {
            // Profile not found, sign out
            await firebaseAuthService.logout();
            setUser(null);
          }
        } else {
          // User is signed out
          setUser(null);
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { user: firebaseUser, profile } = await firebaseAuthService.loginWithEmail(email, password);
      setUser(mapFirebaseUserToUser(profile));
      
      toast({
        title: "Welcome back!",
        description: `Signed in as ${profile.fullName}`,
      });
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    try {
      const { user: firebaseUser, profile } = await firebaseAuthService.loginWithEmail(email, password);
      setUser(mapFirebaseUserToUser(profile));
      return { user: firebaseUser, profile };
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const userData: Partial<UserProfile> = {
        fullName: data.fullName,
        phone: data.phone,
        role: data.role,
        companyName: data.companyName,
        gstNumber: data.gstNumber,
        accessCodes: data.accessCode ? [data.accessCode] : []
      };

      const { user: firebaseUser, profile } = await firebaseAuthService.registerWithEmail(
        data.email, 
        data.password, 
        userData
      );
      
      setUser(mapFirebaseUserToUser(profile));
      
      toast({
        title: "Account created successfully!",
        description: "Please check your email to verify your account.",
      });
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  };

  const loginWithGoogle = async () => {
    try {
      const { user: firebaseUser, profile, isNewUser } = await firebaseAuthService.loginWithGoogle();
      setUser(mapFirebaseUserToUser(profile));
      
      // Return the result so the UI can handle signup vs signin
      return { user: firebaseUser, profile, isNewUser };
    } catch (error: any) {
      throw new Error(error.message || 'Google login failed');
    }
  };

  const loginWithFacebook = async () => {
    try {
      const { user: firebaseUser, profile, isNewUser } = await firebaseAuthService.loginWithFacebook();
      setUser(mapFirebaseUserToUser(profile));
      
      // Return the result so the UI can handle signup vs signin
      return { user: firebaseUser, profile, isNewUser };
    } catch (error: any) {
      throw new Error(error.message || 'Facebook login failed');
    }
  };

  const initializeRecaptcha = (containerId: string) => {
    return firebaseAuthService.initializeRecaptcha(containerId);
  };

  const loginWithPhone = async (phone: string) => {
    try {
      const recaptchaVerifier = firebaseAuthService.initializeRecaptcha('recaptcha-container');
      const confirmationResult = await firebaseAuthService.sendPhoneOTP(phone, recaptchaVerifier);
      return confirmationResult;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to send OTP');
    }
  };

  const verifyPhoneOTP = async (confirmationResult: any, otp: string, userData?: Partial<UserProfile>) => {
    try {
      const { user: firebaseUser, profile, isNewUser } = await firebaseAuthService.verifyPhoneOTP(
        confirmationResult, 
        otp, 
        userData
      );
      
      setUser(mapFirebaseUserToUser(profile));
      
      toast({
        title: "Phone verified!",
        description: isNewUser ? "Welcome to Handloom Portal!" : "Welcome back!",
      });
    } catch (error: any) {
      throw new Error(error.message || 'OTP verification failed');
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await firebaseAuthService.resetPassword(email);
      toast({
        title: "Reset email sent!",
        description: "Check your email for password reset instructions.",
      });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to send reset email');
    }
  };

  const resendEmailVerification = async () => {
    try {
      await firebaseAuthService.resendEmailVerification();
      toast({
        title: "Verification email sent!",
        description: "Check your email for the verification link.",
      });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to send verification email');
    }
  };

  const signOut = async () => {
    try {
      await firebaseAuthService.logout();
      setUser(null);
      
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw new Error(error.message || 'Logout failed');
    }
  };

  const logout = signOut; // Alias for admin components

  const value: AuthContextType = {
    user,
    loading,
    login,
    loginWithEmail,
    register,
    loginWithGoogle,
    loginWithFacebook,
    loginWithPhone,
    verifyPhoneOTP,
    forgotPassword,
    resendEmailVerification,
    signOut,
    logout,
    initializeRecaptcha,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}