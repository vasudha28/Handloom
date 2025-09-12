import { RAZORPAY_CONFIG, PaymentDetails, PaymentStatus } from '@/config/razorpay';

// Declare Razorpay for TypeScript
declare global {
  interface Window {
    Razorpay: any;
  }
}

export class PaymentService {
  private static instance: PaymentService;

  private constructor() {}

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

  // Generate order ID (in real app, this should come from your backend)
  private generateOrderId(): string {
    return 'order_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  // Create payment order
  public async createPaymentOrder(amount: number): Promise<{ orderId: string; amount: number }> {
    // In a real application, you would call your backend API here
    // to create an order with Razorpay and get the order_id
    const orderId = this.generateOrderId();
    
    return {
      orderId,
      amount: amount * 100 // Convert to paise (Razorpay expects amount in smallest currency unit)
    };
  }

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

      // Create order
      const order = await this.createPaymentOrder(paymentDetails.amount);

      // Razorpay options
      const options = {
        key: RAZORPAY_CONFIG.keyId,
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
        handler: (response: any) => {
          // Payment successful
          onSuccess({
            ...response,
            orderId: order.orderId,
            amount: paymentDetails.amount,
            status: PaymentStatus.SUCCESS
          });
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

  // Verify payment (you would implement this on your backend)
  public async verifyPayment(paymentId: string, orderId: string, signature: string): Promise<boolean> {
    // In a real application, send these details to your backend for verification
    // For now, we'll just return true (DO NOT DO THIS IN PRODUCTION)
    console.log('Payment verification:', { paymentId, orderId, signature });
    return true;
  }

  // Format amount for display
  public formatAmount(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  }
}
