# Firebase Authentication Setup Guide

## 🚀 Overview

The Handloom Portal now uses Firebase for authentication, providing robust social login and phone verification capabilities. This guide will walk you through setting up Firebase for your project.

## 📋 Prerequisites

- A Google account
- Basic knowledge of Firebase console
- Node.js and npm installed

## 🔧 Firebase Project Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `handloom-portal` (or your preferred name)
4. Enable Google Analytics (optional but recommended)
5. Click "Create project"

### Step 2: Enable Authentication

1. In your Firebase project, click **"Authentication"** in the sidebar
2. Click **"Get started"**
3. Go to the **"Sign-in method"** tab
4. Enable the following providers:

#### Email/Password
- Click on "Email/Password"
- Enable "Email/Password"
- Enable "Email link (passwordless sign-in)" if desired
- Save

#### Google
- Click on "Google"
- Enable Google sign-in
- Select your project support email
- Download the config file (not needed for web, but good to have)
- Save

#### Facebook
- Click on "Facebook"
- Enable Facebook sign-in
- You'll need to:
  - Create a Facebook App at [Facebook Developers](https://developers.facebook.com/)
  - Get App ID and App Secret
  - Add Firebase OAuth redirect URI to Facebook app
- Save

#### Phone
- Click on "Phone"
- Enable phone authentication
- Add test phone numbers if needed (for development)
- Save

### Step 3: Enable Firestore Database

1. Click **"Firestore Database"** in the sidebar
2. Click **"Create database"**
3. Choose "Start in test mode" (for development)
4. Select a location for your database
5. Click "Done"

### Step 4: Set up Firestore Security Rules

Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Admin can read all user data
    match /users/{userId} {
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### Step 5: Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click **"Add app"** → **Web app** (</> icon)
4. Register your app with a nickname
5. Copy the Firebase configuration object

## 🔑 Environment Variables Setup

Create a `.env.local` file in your project root:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

Replace the placeholder values with your actual Firebase config values.

## 📱 Phone Authentication Setup

### Enable Phone Authentication in Firebase

1. In Firebase Console → Authentication → Sign-in method
2. Click "Phone" and enable it
3. Add test phone numbers for development (optional)

### reCAPTCHA Configuration

Phone authentication requires reCAPTCHA verification. The app automatically handles this with an invisible reCAPTCHA.

For production, you may want to:
1. Get your own reCAPTCHA v3 site key from [Google reCAPTCHA](https://www.google.com/recaptcha/)
2. Configure it in Firebase Console → Authentication → Settings → App verification

## 🌐 Social Login Setup

### Google Sign-In

Google sign-in works out of the box with Firebase. No additional setup required.

### Facebook Sign-In

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add "Facebook Login" product
4. In Facebook app settings:
   - Add your domain to "App Domains"
   - Add Firebase OAuth redirect URI: `https://your-project-id.firebaseapp.com/__/auth/handler`
5. Copy App ID and App Secret to Firebase Console

## 🔒 Security Configuration

### Authentication Settings

In Firebase Console → Authentication → Settings:

1. **Authorized domains**: Add your production domain
2. **User actions**: Configure email templates
3. **Email templates**: Customize verification emails

### Firestore Security Rules

Update your Firestore rules to match your data structure:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null;
    }
    
    // Allow admins to read all profiles
    match /users/{document=**} {
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## 🧪 Testing the Integration

### Test Accounts

Create test accounts with different roles:

```javascript
// Customer Account
{
  email: "customer@test.com",
  password: "Test@123",
  role: "customer"
}

// B2B Buyer Account
{
  email: "b2b@test.com", 
  password: "Test@123",
  role: "b2b_buyer",
  companyName: "Test Company"
}

// Admin Account  
{
  email: "admin@test.com",
  password: "Test@123", 
  role: "admin"
}
```

### Phone Testing

Use test phone numbers in Firebase Console for development:
- Phone: +1 650-555-3434
- Verification code: 654321

## 🚀 Deployment Considerations

### Production Environment Variables

For production deployment, ensure environment variables are set:

```bash
# Vercel
vercel env add VITE_FIREBASE_API_KEY

# Netlify  
netlify env:set VITE_FIREBASE_API_KEY your_api_key

# Custom server
export VITE_FIREBASE_API_KEY=your_api_key
```

### Security Best Practices

1. **Enable App Check** (for production)
2. **Configure CORS** properly
3. **Use HTTPS** for all domains
4. **Monitor authentication events**
5. **Set up billing alerts**

## 🔧 Troubleshooting

### Common Issues

1. **"Firebase: Error (auth/configuration-not-found)"**
   - Check environment variables are set correctly
   - Verify Firebase config in console

2. **"Firebase: Error (auth/popup-blocked)"**
   - Browser is blocking popups
   - User needs to allow popups for your domain

3. **"Firebase: Error (auth/unauthorized-domain)"**
   - Add your domain to authorized domains in Firebase Console

4. **Phone verification not working**
   - Check if phone authentication is enabled
   - Verify reCAPTCHA is working
   - Check phone number format (+country_code)

5. **Firestore permission denied**
   - Check security rules
   - Verify user authentication state

### Debug Mode

Enable Firebase debug mode:

```javascript
// In development only
if (import.meta.env.DEV) {
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(db, 'localhost', 8080);
}
```

## 📊 Features Implemented

✅ **Email/Password Authentication**
- User registration with email verification
- Secure password reset
- Strong password requirements

✅ **Social Login**
- Google Sign-In with profile import
- Facebook Login with profile import
- Automatic account linking

✅ **Phone Verification**
- OTP-based phone authentication
- reCAPTCHA integration
- International phone number support

✅ **User Management**
- Role-based access (customer, B2B, admin)
- Profile management in Firestore
- Real-time auth state management

✅ **Security Features**
- Account lockout protection
- Session management
- Secure token handling

## 🔄 Migration from Mock Auth

The app has been fully migrated from mock authentication to Firebase. All features remain the same:

- Floating authentication modal
- Role-based access control
- Auto-logout functionality
- Session management
- Security features

## 📞 Support

For Firebase-specific issues:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Community](https://firebase.google.com/community)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/firebase)

For project-specific issues:
- Check the console for detailed error messages
- Verify environment variables
- Test with Firebase emulators for local development

---

**🎉 Your Firebase authentication is now ready for production!**

Test all authentication flows and verify everything works as expected before deploying to production.




// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyACbFlMDqN9E19eRzo_iq2JfMFW1WBYDP4",
  authDomain: "handloom-portal-3297e.firebaseapp.com",
  projectId: "handloom-portal-3297e",
  storageBucket: "handloom-portal-3297e.firebasestorage.app",
  messagingSenderId: "773913965948",
  appId: "1:773913965948:web:aac158d53d6207444020f9",
  measurementId: "G-RT6VFMY2YW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);