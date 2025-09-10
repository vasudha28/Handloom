// Google Authentication Testing Utility
// Use this to debug Google sign-up issues specifically

import { auth, db, firebaseAuthService } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export interface GoogleAuthTestResult {
  step: string;
  success: boolean;
  details: any;
  error?: string;
}

export class GoogleAuthTester {
  private results: GoogleAuthTestResult[] = [];

  // Run complete Google authentication test
  async runGoogleAuthTest(): Promise<GoogleAuthTestResult[]> {
    console.log('🧪 Starting Google Authentication Test...');
    this.results = [];
    
    try {
      // Step 1: Check Firebase configuration
      await this.testFirebaseConfig();
      
      // Step 2: Check Google provider setup
      await this.testGoogleProvider();
      
      // Step 3: Check Firestore connection
      await this.testFirestoreConnection();
      
      // Step 4: Test Google authentication flow
      await this.testGoogleAuthFlow();
      
    } catch (error) {
      console.error('🔴 Google auth test failed:', error);
    }
    
    this.printResults();
    return this.results;
  }

  private addResult(step: string, success: boolean, details: any, error?: string) {
    this.results.push({ step, success, details, error });
    
    const emoji = success ? '✅' : '❌';
    console.log(`${emoji} ${step}:`, details);
    if (error) console.error(`   Error: ${error}`);
  }

  private async testFirebaseConfig() {
    try {
      const config = {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID
      };
      
      const hasRequiredConfig = config.apiKey && config.authDomain && config.projectId;
      
      this.addResult(
        'Firebase Configuration',
        hasRequiredConfig,
        {
          apiKey: config.apiKey ? 'Set' : 'Missing',
          authDomain: config.authDomain || 'Missing',
          projectId: config.projectId || 'Missing'
        },
        hasRequiredConfig ? undefined : 'Missing required Firebase configuration'
      );
    } catch (error: any) {
      this.addResult('Firebase Configuration', false, {}, error.message);
    }
  }

  private async testGoogleProvider() {
    try {
      const { googleProvider } = await import('@/lib/firebase');
      
      this.addResult(
        'Google Provider Setup',
        true,
        {
          providerConfigured: !!googleProvider,
          providerId: 'google.com'
        }
      );
    } catch (error: any) {
      this.addResult('Google Provider Setup', false, {}, error.message);
    }
  }

  private async testFirestoreConnection() {
    try {
      // Try to read from Firestore
      const testDoc = await getDoc(doc(db, 'test', 'connection'));
      
      this.addResult(
        'Firestore Connection',
        true,
        {
          connected: true,
          testDocExists: testDoc.exists()
        }
      );
    } catch (error: any) {
      this.addResult(
        'Firestore Connection',
        false,
        { connected: false },
        error.message
      );
    }
  }

  private async testGoogleAuthFlow() {
    try {
      console.log('🔵 Testing Google authentication flow...');
      console.log('🔵 This will open a Google sign-in popup');
      
      const result = await firebaseAuthService.loginWithGoogle();
      
      this.addResult(
        'Google Authentication Flow',
        true,
        {
          userUID: result.user.uid,
          userEmail: result.profile.email,
          isNewUser: result.isNewUser,
          profileCreated: !!result.profile
        }
      );
      
      // Test profile retrieval
      const retrievedProfile = await firebaseAuthService.getUserProfile(result.user.uid);
      
      this.addResult(
        'Profile Retrieval',
        !!retrievedProfile,
        {
          profileFound: !!retrievedProfile,
          profileData: retrievedProfile ? {
            email: retrievedProfile.email,
            role: retrievedProfile.role,
            isEmailVerified: retrievedProfile.isEmailVerified
          } : null
        },
        retrievedProfile ? undefined : 'Profile not found in Firestore'
      );
      
    } catch (error: any) {
      this.addResult(
        'Google Authentication Flow',
        false,
        { attempted: true },
        error.message
      );
    }
  }

  private printResults() {
    console.log('\n📊 Google Authentication Test Results:');
    console.log('=' .repeat(50));
    
    const passed = this.results.filter(r => r.success).length;
    const total = this.results.length;
    
    this.results.forEach((result, index) => {
      const emoji = result.success ? '✅' : '❌';
      console.log(`${index + 1}. ${emoji} ${result.step}`);
      if (result.error) {
        console.log(`   ❌ Error: ${result.error}`);
      }
    });
    
    console.log('=' .repeat(50));
    console.log(`📈 Results: ${passed}/${total} tests passed`);
    
    if (passed === total) {
      console.log('🎉 All Google authentication tests passed!');
    } else {
      console.log('🔧 Some tests failed. Check the errors above.');
      this.printTroubleshootingTips();
    }
  }

  private printTroubleshootingTips() {
    console.log('\n🔧 Troubleshooting Tips:');
    
    const failedTests = this.results.filter(r => !r.success);
    
    failedTests.forEach(test => {
      switch (test.step) {
        case 'Firebase Configuration':
          console.log('• Check your .env.local file for Firebase config values');
          console.log('• Verify values match your Firebase project settings');
          break;
        case 'Google Provider Setup':
          console.log('• Check if Google authentication is enabled in Firebase Console');
          console.log('• Verify Google provider configuration');
          break;
        case 'Firestore Connection':
          console.log('• Check Firestore database is created and accessible');
          console.log('• Verify Firestore security rules allow access');
          break;
        case 'Google Authentication Flow':
          console.log('• Try in incognito mode to bypass extensions');
          console.log('• Check popup blocker settings');
          console.log('• Verify domain is in Firebase authorized domains');
          break;
      }
    });
  }

  // Quick test for current auth state
  async quickAuthCheck() {
    console.log('🔍 Quick Google Auth Check:');
    
    const currentUser = auth.currentUser;
    if (currentUser) {
      console.log('✅ User is signed in:', {
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName
      });
      
      // Check Firestore profile
      const profile = await firebaseAuthService.getUserProfile(currentUser.uid);
      if (profile) {
        console.log('✅ Firestore profile found:', {
          email: profile.email,
          role: profile.role,
          fullName: profile.fullName
        });
      } else {
        console.log('❌ Firestore profile not found');
      }
    } else {
      console.log('❌ No user is currently signed in');
    }
  }
}

// Make available globally for testing
if (typeof window !== 'undefined') {
  const tester = new GoogleAuthTester();
  (window as any).testGoogleAuth = () => tester.runGoogleAuthTest();
  (window as any).quickAuthCheck = () => tester.quickAuthCheck();
  
  console.log('🧪 Google Auth Testing available:');
  console.log('   - testGoogleAuth() - Full authentication test');
  console.log('   - quickAuthCheck() - Check current auth state');
}

export default GoogleAuthTester;
