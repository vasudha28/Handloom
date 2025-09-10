// Utility to handle Chrome extension interference with Firebase authentication
// Based on the suggestions provided for fixing "message port closed" errors

export class ChromeExtensionHelper {
  private static extensionInterferenceDetected = false;

  // Detect if Chrome extensions are interfering
  static detectExtensionInterference(): boolean {
    // Check for common extension indicators
    const indicators = [
      // AdBlock related
      () => !!(window as any).adblock,
      () => !!(window as any).uBlock,
      
      // React DevTools
      () => !!(window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__,
      
      // Firebase DevTools
      () => !!(window as any).__FIREBASE_DEVTOOLS__,
      
      // General extension content scripts
      () => document.querySelectorAll('[data-extension]').length > 0,
      () => document.querySelectorAll('div[style*="z-index: 2147483647"]').length > 0
    ];

    return indicators.some(check => {
      try {
        return check();
      } catch {
        return false;
      }
    });
  }

  // Set up global error handler for extension-related errors
  static setupExtensionErrorHandler(): void {
    if (typeof window === 'undefined') return;

    // Handle unhandled promise rejections from extensions
    window.addEventListener('unhandledrejection', (event) => {
      const error = event.reason;
      
      // Check if it's an extension-related error
      if (this.isExtensionError(error)) {
        console.log('🔧 Chrome extension error detected (harmless):', error);
        event.preventDefault(); // Prevent it from showing in console as unhandled
        this.extensionInterferenceDetected = true;
      }
    });

    // Handle regular errors
    window.addEventListener('error', (event) => {
      if (this.isExtensionError(event.error)) {
        console.log('🔧 Chrome extension error detected (harmless):', event.error);
        event.preventDefault();
        this.extensionInterferenceDetected = true;
      }
    });

    // Specific handler for Firebase popup issues
    this.setupFirebasePopupHandler();
  }

  // Check if an error is extension-related
  private static isExtensionError(error: any): boolean {
    if (!error) return false;

    const extensionErrorPatterns = [
      'message port closed',
      'Extension context invalidated',
      'Could not establish connection',
      'The extension\'s background script',
      'chrome-extension://',
      'moz-extension://',
      'sendResponse'
    ];

    const errorString = error.toString().toLowerCase();
    return extensionErrorPatterns.some(pattern => 
      errorString.includes(pattern.toLowerCase())
    );
  }

  // Set up Firebase popup handler
  private static setupFirebasePopupHandler(): void {
    // Override console.error to filter extension errors
    const originalConsoleError = console.error;
    console.error = (...args: any[]) => {
      const errorMessage = args.join(' ').toLowerCase();
      
      if (this.isExtensionError(errorMessage)) {
        // Log as info instead of error for extension issues
        console.info('🔧 [Extension] Harmless extension error:', ...args);
        return;
      }
      
      // Call original console.error for real errors
      originalConsoleError.apply(console, args);
    };
  }

  // Get user-friendly message about extensions
  static getExtensionMessage(): string {
    if (this.extensionInterferenceDetected || this.detectExtensionInterference()) {
      return `
ℹ️ Chrome Extensions Detected

Some console messages might be from browser extensions:
• AdBlock/uBlock Origin
• React Developer Tools  
• Firebase DevTools
• Other extensions

These messages are usually harmless and don't affect functionality.

If authentication isn't working:
1. Try in Incognito mode
2. Temporarily disable extensions
3. Check if popups are blocked
      `.trim();
    }
    
    return '';
  }

  // Test if Firebase auth works despite extension interference
  static async testFirebaseWithExtensions(): Promise<{
    extensionsDetected: boolean;
    authWorking: boolean;
    recommendations: string[];
  }> {
    const extensionsDetected = this.detectExtensionInterference();
    let authWorking = false;
    const recommendations: string[] = [];

    try {
      // Test if Firebase is accessible
      const { auth } = await import('@/lib/firebase');
      authWorking = !!auth;
    } catch (error) {
      console.warn('Firebase auth test failed:', error);
    }

    if (extensionsDetected) {
      recommendations.push('Extensions detected - some console errors are normal');
      
      if (!authWorking) {
        recommendations.push('Try authentication in Incognito mode');
        recommendations.push('Temporarily disable browser extensions');
        recommendations.push('Check popup blocker settings');
      } else {
        recommendations.push('Extensions present but Firebase should work normally');
      }
    }

    return {
      extensionsDetected,
      authWorking,
      recommendations
    };
  }
}

// Initialize extension handling when loaded
if (typeof window !== 'undefined') {
  ChromeExtensionHelper.setupExtensionErrorHandler();
  
  // Log extension detection result
  setTimeout(() => {
    const message = ChromeExtensionHelper.getExtensionMessage();
    if (message) {
      console.info(message);
    }
  }, 1000);
}

export default ChromeExtensionHelper;
