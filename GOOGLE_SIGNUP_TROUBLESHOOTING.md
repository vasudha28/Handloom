# Google Sign-Up Troubleshooting Guide

## 🎯 Specific to Google Authentication Issues

Since you're having issues **only with Google sign-up**, this guide focuses specifically on Google authentication problems.

## 🔧 **Immediate Testing Steps**

### Step 1: Open Browser Console
1. Press `F12` → Go to **Console** tab
2. Look for colored emoji logs when you test Google sign-up:
   - 🔵 Blue = Process steps
   - 🟢 Green = Success
   - 🔴 Red = Errors

### Step 2: Run Google Authentication Test
In the browser console, run:
```javascript
testGoogleAuth()
```
This will test your entire Google authentication flow step by step.

### Step 3: Quick Auth State Check
```javascript
quickAuthCheck()
```
This shows your current authentication state.

## 🚨 **Common Google Sign-Up Issues**

### Issue 1: "Google sign-in is not enabled"
**Cause**: Google authentication not enabled in Firebase Console

**Fix**:
1. Go to [Firebase Console](https://console.firebase.google.com/project/handloom-portal-3297e/authentication/providers)
2. Click **"Google"** provider
3. Click **"Enable"**
4. Select your support email
5. Click **"Save"**

### Issue 2: "Unauthorized domain"
**Cause**: Your domain is not authorized for Google sign-in

**Fix**:
1. Firebase Console → Authentication → Settings → **Authorized domains**
2. Add your domain:
   - `localhost` (for development)
   - Your actual domain (for production)

### Issue 3: "Pop-up was blocked"
**Cause**: Browser is blocking the Google sign-in popup

**Fix**:
1. Allow popups for your site
2. Check browser popup blocker settings
3. Try in **Incognito mode**

### Issue 4: Profile not created in Firestore
**Cause**: Firestore permissions or connection issues

**Fix**:
1. Check Firestore security rules
2. Verify Firestore database exists
3. Test Firestore connection manually

## 🔍 **Debugging Your Specific Issue**

Based on your console logs when running `testGoogleAuth()`, you'll see exactly where the failure occurs:

### If Google Popup Opens But Fails:
```javascript
// Check these in console:
🔵 Opening Google sign-in popup...
🔴 Google popup error: [ERROR DETAILS]
```
→ **Check popup blockers and authorized domains**

### If Google Authentication Succeeds But Profile Fails:
```javascript
🟢 Google authentication successful
🔵 Creating user profile in Firestore...
🔴 Failed to create user profile: [ERROR DETAILS]
```
→ **Check Firestore permissions and database setup**

### If Everything Seems to Work But UI Doesn't Update:
```javascript
🟢 User profile created successfully in Firestore
🟢 Google authentication completed successfully
```
→ **Check React state management and auth hook**

## 🎯 **Environment Verification**

Make sure your `.env.local` file contains:
```env
VITE_FIREBASE_API_KEY=AIzaSyACbFlMDqN9E19eRzo_iq2JfMFW1WBYDP4
VITE_FIREBASE_AUTH_DOMAIN=handloom-portal-3297e.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=handloom-portal-3297e
VITE_FIREBASE_STORAGE_BUCKET=handloom-portal-3297e.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=773913965948
VITE_FIREBASE_APP_ID=1:773913965948:web:aac158d53d6207444020f9
VITE_FIREBASE_MEASUREMENT_ID=G-RT6VFMY2YW
```

## 🔄 **Step-by-Step Test Process**

1. **Open your app in browser**
2. **Open browser console** (F12)
3. **Click Google sign-up button**
4. **Watch console logs** with colored emojis
5. **Note exactly where it fails**
6. **Run diagnostic**: `testGoogleAuth()`

## 🎉 **Expected Success Flow**

When Google sign-up works correctly, you should see:
```
🔵 Starting Google authentication...
🔵 Google provider configured with email and profile scopes
🔵 Opening Google sign-in popup...
🔵 Google popup completed successfully
🟢 Google authentication successful: {uid, email, displayName...}
🔵 Checking if user exists in Firestore...
🟢 New user detected, creating profile...
🔵 Creating user profile in Firestore: {uid, email, fullName, role}
🟢 User profile created successfully in Firestore
🟢 Google authentication completed successfully: {isNewUser: true, userEmail, userRole}
```

## 📞 **If Still Not Working**

1. **Try Incognito Mode** - Disables all extensions
2. **Different Browser** - Test in Chrome vs Firefox vs Edge
3. **Different Network** - Try mobile hotspot
4. **Clear Everything**: 
   ```javascript
   localStorage.clear();
   sessionStorage.clear();
   location.reload(true);
   ```

## 🎯 **Share Debug Info**

If none of the above helps, run this in console and share the output:
```javascript
// Full diagnostic with Google-specific tests
authDebug.runFullDiagnostic();
testGoogleAuth();
```

This will give us detailed information about exactly where the Google sign-up process is failing.
