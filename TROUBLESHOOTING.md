# Firebase Authentication Troubleshooting Guide

## 🚨 Common Issues and Solutions

### Issue 1: "The message port closed before a response was received"

This error typically occurs due to Chrome extensions interfering with Firebase authentication popups.

#### **Root Cause:**
- Chrome extensions (AdBlock, React DevTools, Firebase DevTools, etc.)
- Extension message ports closing before Firebase can respond
- **Usually harmless** - authentication often still works

#### **Applied Fixes:**

1. **Automatic Extension Detection**
   - App now detects Chrome extensions automatically
   - Filters out harmless extension errors from console
   - Provides user-friendly messages about extension interference

2. **Improved Error Handling**
   ```javascript
   // Better popup error handling
   try {
     result = await signInWithPopup(auth, googleProvider);
   } catch (popupError) {
     if (popupError.code === 'auth/popup-closed-by-user') {
       // Handle gracefully - don't show error
     }
     // Other specific error handling...
   }
   ```

3. **Smart Error Filtering**
   - Cancellation by user: No error shown
   - Extension errors: Logged as info, not error
   - Real errors: Shown with helpful messages

#### **Quick Fixes for Users:**

1. **If authentication works despite the error:**
   - ✅ **Ignore the console message** - it's harmless
   - The app handles it automatically

2. **If authentication fails:**
   - Try in **Incognito mode** (disables extensions)
   - Allow popups for your domain
   - Temporarily disable browser extensions

3. **For developers:**
   ```bash
   # Test extension interference
   ChromeExtensionHelper.testFirebaseWithExtensions()
   ```

### Issue 2: "Email Already Exists" After User Deletion

Firebase sometimes reserves deleted email addresses for 24-48 hours.

#### **Immediate Solutions:**

1. **Complete Manual Deletion**
   ```bash
   # Steps to completely delete a user:
   
   1. Firebase Console > Authentication > Users
      - Find user by email
      - Delete user account
   
   2. Firebase Console > Firestore Database > users
      - Find document by email
      - Delete document
   
   3. Clear browser cache
      - Hard refresh (Ctrl+F5)
      - Clear localStorage/sessionStorage
   ```

2. **Use Browser Console Helper**
   ```javascript
   // In browser console, run:
   fixEmail('vasudhadonthamsetti@gmail.com');
   ```

3. **Wait Period**
   - Firebase may hold emails for 24-48 hours
   - Use a different email for immediate testing
   - Try again tomorrow

#### **Alternative Solutions:**

1. **Use Different Email Format**
   ```
   Original: vasudhadonthamsetti@gmail.com
   Alternative: vasudhadonthamsetti+test@gmail.com
   Alternative: vasudhadonthamsetti.test@gmail.com
   ```

2. **Temporary Email Services**
   - Use temporary email services for testing
   - Create test accounts with unique emails

### Issue 3: Firebase Configuration Errors

#### **Environment Variables Check:**

Create `.env.local` file with your actual Firebase config:

```env
VITE_FIREBASE_API_KEY=AIzaSyACbFlMDqN9E19eRzo_iq2JfMFW1WBYDP4
VITE_FIREBASE_AUTH_DOMAIN=handloom-portal-3297e.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=handloom-portal-3297e
VITE_FIREBASE_STORAGE_BUCKET=handloom-portal-3297e.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=773913965948
VITE_FIREBASE_APP_ID=1:773913965948:web:aac158d53d6207444020f9
VITE_FIREBASE_MEASUREMENT_ID=G-RT6VFMY2YW
```

#### **Verification Steps:**

1. **Check Firebase Console**
   - Project Settings > General > Your apps
   - Verify config values match your `.env.local`

2. **Test Connection**
   ```javascript
   // In browser console:
   console.log('Firebase Config:', {
     apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
     authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
     projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID
   });
   ```

## 🔧 Development Debugging

### Enable Debug Mode

Add to your `.env.local`:
```env
VITE_APP_ENV=development
VITE_FIREBASE_DEBUG=true
```

### Browser Console Commands

```javascript
// Check current auth state
firebase.auth().currentUser

// Sign out completely
firebase.auth().signOut()

// Clear all storage
localStorage.clear(); sessionStorage.clear();

// Check Firestore connection
firebase.firestore().collection('users').limit(1).get()
```

### Network Tab Debugging

1. Open Browser DevTools > Network tab
2. Filter by "firebase" or "auth"
3. Look for failed requests (red entries)
4. Check request/response details

## 🚀 Production Considerations

### Security Rules Update

Update Firestore rules for better error handling:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null;
    }
    
    // Admin access
    match /users/{document=**} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### Authorized Domains

Add these to Firebase Console > Authentication > Settings > Authorized domains:
- `localhost` (for development)
- Your production domain
- Any staging domains

## 📞 Emergency Fixes

### If Nothing Works:

1. **Create New Firebase Project**
   - Sometimes starting fresh is faster
   - Export/import any existing data

2. **Use Firebase Admin SDK**
   - For backend user management
   - More reliable for user deletion

3. **Contact Firebase Support**
   - For persistent email reservation issues
   - Enterprise users get priority support

### Quick Reset Commands

```bash
# Complete reset (run in project root)
rm -rf node_modules
rm package-lock.json
npm install
npm run dev
```

## 🔍 Monitoring and Logs

### Firebase Console Monitoring

1. **Authentication Logs**
   - Firebase Console > Authentication > Users
   - Check sign-in attempts and errors

2. **Firestore Logs**
   - Firebase Console > Firestore > Usage
   - Monitor read/write operations

3. **Error Reporting**
   - Enable Firebase Crashlytics
   - Monitor authentication errors

### Browser Console Logs

The app now includes detailed logging:
- Authentication attempts
- Firestore operations
- Error details with suggestions

---

## 📋 Checklist for Email Issues

- [ ] Delete user from Firebase Authentication
- [ ] Delete user document from Firestore
- [ ] Clear browser cache and storage
- [ ] Hard refresh the page
- [ ] Check authorized domains
- [ ] Verify environment variables
- [ ] Try different email format
- [ ] Wait 24 hours if needed
- [ ] Contact support if persistent

**Most issues are resolved by following the complete deletion process and clearing browser cache.**
