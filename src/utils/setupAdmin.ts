// Quick admin setup utility
// Run this in browser console to create admin user

import { firebaseAuthService } from '@/lib/firebase';

export async function setupAdminUser() {
  console.log('🔧 Setting up admin user...');
  
  try {
    const adminData = {
      fullName: 'Admin User',
      email: 'vasudhaoffsetprinters@gmail.com',
      password: 'Vasu@123',
      role: 'admin' as const,
      phone: '+91-9876543210',
      companyName: 'Handloom Portal',
      accessCodes: ['ADMIN2024']
    };

    console.log('📧 Creating admin user with email:', adminData.email);
    
    const result = await firebaseAuthService.registerWithEmail(
      adminData.email,
      adminData.password,
      {
        fullName: adminData.fullName,
        phone: adminData.phone,
        role: adminData.role,
        companyName: adminData.companyName,
        accessCodes: adminData.accessCodes
      }
    );

    console.log('✅ Admin user created successfully!');
    console.log('📋 Login details:');
    console.log('   Email:', adminData.email);
    console.log('   Password:', adminData.password);
    console.log('   Role:', adminData.role);
    console.log('');
    console.log('⚠️ IMPORTANT: Email verification is NOT required for admin login');
    console.log('🔗 You can now login at: /admin/login');
    
    return result;
  } catch (error: any) {
    console.error('❌ Error creating admin user:', error);
    
    if (error.message.includes('email-already-in-use')) {
      console.log('ℹ️ Admin user already exists. Try logging in directly.');
      console.log('📧 Email: vasudhaoffsetprinters@gmail.com');
      console.log('🔑 Password: Vasu@123');
      console.log('⚠️ NOTE: Email verification is NOT required for admin users');
      console.log('');
      console.log('🔧 If login still fails, try these steps:');
      console.log('1. Check browser console for specific error messages');
      console.log('2. Verify Firebase configuration');
      console.log('3. Check Firestore security rules');
      
      // Try to test login directly
      console.log('');
      console.log('🧪 Testing admin login...');
      try {
        const loginResult = await firebaseAuthService.loginWithEmail(adminData.email, adminData.password);
        console.log('✅ Admin login test successful!');
        console.log('👤 User role:', loginResult.profile.role);
        return loginResult;
      } catch (loginError: any) {
        console.error('❌ Admin login test failed:', loginError.message);
        console.log('💡 Try manually creating the user in Firebase Console');
      }
    } else if (error.message.includes('weak-password')) {
      console.log('⚠️ Password is too weak. Use a stronger password.');
    } else if (error.message.includes('invalid-email')) {
      console.log('⚠️ Invalid email format.');
    } else {
      console.log('💡 Possible solutions:');
      console.log('1. Check Firebase configuration');
      console.log('2. Ensure Authentication is enabled in Firebase Console');
      console.log('3. Check network connection');
      console.log('4. Check Firestore database exists and is accessible');
    }
    
    throw error;
  }
}

// Test admin login function
export async function testAdminLogin() {
  console.log('🧪 Testing admin login...');
  
  try {
    const result = await firebaseAuthService.loginWithEmail(
      'vasudhaoffsetprinters@gmail.com',
      'Vasu@123'
    );
    
    console.log('✅ Admin login successful!');
    console.log('👤 User details:', {
      email: result.profile.email,
      role: result.profile.role,
      fullName: result.profile.fullName,
      isEmailVerified: result.profile.isEmailVerified
    });
    
    return result;
  } catch (error: any) {
    console.error('❌ Admin login failed:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting steps:');
    console.log('1. Make sure admin user exists - run: setupAdmin()');
    console.log('2. Check Firebase Console > Authentication > Users');
    console.log('3. Check Firestore > users collection for admin profile');
    console.log('4. Verify email/password are correct');
    
    throw error;
  }
}

// Make available globally for console use
if (typeof window !== 'undefined') {
  (window as any).setupAdmin = setupAdminUser;
  (window as any).testAdminLogin = testAdminLogin;
  console.log('🔧 Admin tools available:');
  console.log('   - setupAdmin() - Create admin user');
  console.log('   - testAdminLogin() - Test admin login');
}

export default setupAdminUser;
