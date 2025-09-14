import { RAZORPAY_CONFIG, PaymentDetails, PaymentStatus } from '@/config/razorpay';

// Declare Razorpay for TypeScript
declare global {
  interface Window {
    Razorpay: any;
  }
}

export class PaymentService {
  private static instance: PaymentService;
  private backendUrl: string;

  private constructor() {
    // Use environment variable or default to localhost for development
    this.backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
  }

  public static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  // Load Razorpay script dynamically
  private loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  // Create payment order via backend API
  public async createPaymentOrder(amount: number, currency: string = 'INR'): Promise<{ orderId: string; amount: number }> {
    try {
      const response = await fetch(`${this.backendUrl}/api/razorpay/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          receipt: `receipt_${Date.now()}`
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to create order');
      }

      return {
        orderId: data.order.id,
        amount: data.order.amount
      };
    } catch (error) {
      console.error('Error creating payment order:', error);
      throw new Error('Failed to create payment order. Please try again.');
    }
  }

  // Get Razorpay key method removed to prevent MongoDB connection issues
  // Will use direct fallback to environment variable

  // Process payment
  public async processPayment(
    paymentDetails: PaymentDetails,
    onSuccess: (response: any) => void,
    onFailure: (error: any) => void
  ): Promise<void> {
    try {
      // Load Razorpay script
      const isLoaded = await this.loadRazorpayScript();
      if (!isLoaded) {
        throw new Error('Failed to load Razorpay SDK');
      }

      // Use Razorpay key from environment variable directly to avoid GET request
      const razorpayKey = RAZORPAY_CONFIG.keyId;

      // Create order via backend
      const order = await this.createPaymentOrder(paymentDetails.amount, paymentDetails.currency);

      // Razorpay options
      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: paymentDetails.currency,
        name: RAZORPAY_CONFIG.businessName,
        description: RAZORPAY_CONFIG.businessDescription,
        image: RAZORPAY_CONFIG.businessImage,
        order_id: order.orderId,
        prefill: {
          name: paymentDetails.customerName,
          email: paymentDetails.customerEmail,
          contact: paymentDetails.customerPhone,
        },
        theme: RAZORPAY_CONFIG.theme,
        method: RAZORPAY_CONFIG.paymentMethods,
        handler: async (response: any) => {
          try {
            // Verify payment with backend
            const isVerified = await this.verifyPayment(
              response.razorpay_payment_id,
              response.razorpay_order_id,
              response.razorpay_signature
            );
            
            if (isVerified) {
              onSuccess({
                ...response,
                orderId: order.orderId,
                amount: paymentDetails.amount,
                status: PaymentStatus.SUCCESS
              });
            } else {
              onFailure({
                error: 'Payment verification failed',
                status: PaymentStatus.FAILED
              });
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            onFailure({
              error: 'Payment verification failed',
              status: PaymentStatus.FAILED
            });
          }
        },
        modal: {
          ondismiss: () => {
            // Payment cancelled by user
            onFailure({
              error: 'Payment cancelled by user',
              status: PaymentStatus.CANCELLED
            });
          }
        }
      };

      // Create and open Razorpay payment modal
      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Payment processing error:', error);
      onFailure({
        error: error instanceof Error ? error.message : 'Payment processing failed',
        status: PaymentStatus.FAILED
      });
    }
  }

  // Verify payment via backend API
  public async verifyPayment(paymentId: string, orderId: string, signature: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.backendUrl}/api/razorpay/verify-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          razorpay_payment_id: paymentId,
          razorpay_order_id: orderId,
          razorpay_signature: signature
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Error verifying payment:', error);
      return false;
    }
  }

  // Format amount for display
  public formatAmount(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  }
}
