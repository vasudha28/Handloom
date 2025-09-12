// Razorpay Configuration
export const RAZORPAY_CONFIG = {
  // Replace with your actual Razorpay Key ID from https://dashboard.razorpay.com/app/keys
  keyId: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_your_key_id_here',
  
  // Company/Business Details
  businessName: 'HandloomPortal',
  businessDescription: 'Authentic Handloom & Handicrafts',
  businessImage: '/logo.png', // Your logo URL
  
  // Currency
  currency: 'INR',
  
  // Payment Options
  paymentMethods: {
    netbanking: true,
    card: true,
    upi: true,
    wallet: true,
  },
  
  // Theme Configuration
  theme: {
    color: '#FF6B35', // Primary brand color
  }
};

// Payment Status
export enum PaymentStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

// Payment Interface
export interface PaymentDetails {
  orderId: string;
  amount: number;
  currency: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
}
