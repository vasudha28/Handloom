// Utility function to create an admin user
// This should be run once to create the initial admin user

import { firebaseAuthService } from '@/lib/firebase';

export async function createAdminUser() {
  try {
    // Create admin user with email/password
    const adminData = {
      fullName: 'Admin User',
      email: 'vasudhaoffsetprinters@gmail.com',
      password: 'Vasu@123',
      role: 'admin' as const,
      phone: '+1234567890',
      companyName: 'Handloom Portal',
      accessCodes: ['ADMIN2024']
    };

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

    console.log('Admin user created successfully:', result);
    return result;
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
}

// Instructions for manual admin user creation:
export const ADMIN_CREATION_INSTRUCTIONS = `
To create an admin user manually:

1. Go to your main site: http://localhost:8080/
2. Click "Sign Up"
3. Select "B2B Customer" 
4. Fill in the form with:
   - Full Name: Admin User
   - Email: vasudhaoffsetprinters@gmail.com
   - Company Name: Handloom Portal
   - GST Number: 22AAAAA0000A1Z5
   - Password: Vasu@123
5. After registration, go to Firebase Console
6. Go to Firestore Database
7. Find the user document with email: vasudhaoffsetprinters@gmail.com
8. Edit the document and change the "role" field from "b2b_buyer" to "admin"
9. Save the changes

Now you can login at: http://localhost:8080/admin/login
`;
