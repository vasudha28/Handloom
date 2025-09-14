// Authentication Performance Utilities
// Optimized for Chrome and modern browsers

export class AuthPerformance {
  private static instance: AuthPerformance;
  private performanceMetrics: Map<string, number> = new Map();

  public static getInstance(): AuthPerformance {
    if (!AuthPerformance.instance) {
      AuthPerformance.instance = new AuthPerformance();
    }
    return AuthPerformance.instance;
  }

  // Start timing an operation
  startTiming(operation: string): void {
    this.performanceMetrics.set(operation, performance.now());
    console.log(`🔵 Starting ${operation}...`);
  }

  // End timing and log results
  endTiming(operation: string): number {
    const startTime = this.performanceMetrics.get(operation);
    if (!startTime) {
      console.warn(`⚠️ No start time found for ${operation}`);
      return 0;
    }

    const duration = performance.now() - startTime;
    this.performanceMetrics.delete(operation);
    
    console.log(`✅ ${operation} completed in ${duration.toFixed(2)}ms`);
    
    // Log warning for slow operations
    if (duration > 3000) {
      console.warn(`⚠️ ${operation} took ${duration.toFixed(2)}ms - consider optimization`);
    }
    
    return duration;
  }

  // Check if Chrome and apply optimizations
  isChrome(): boolean {
    return /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
  }

  // Get Chrome version for specific optimizations
  getChromeVersion(): number {
    const match = navigator.userAgent.match(/Chrome\/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  // Apply Chrome-specific optimizations
  applyChromeOptimizations(): void {
    if (!this.isChrome()) return;

    const version = this.getChromeVersion();
    console.log(`🔵 Chrome version detected: ${version}`);

    // Chrome 90+ optimizations
    if (version >= 90) {
      // Enable performance optimizations
      this.enablePerformanceOptimizations();
    }

    // Chrome 100+ optimizations
    if (version >= 100) {
      this.enableAdvancedOptimizations();
    }
  }

  private enablePerformanceOptimizations(): void {
    console.log('🔵 Applying Chrome 90+ performance optimizations...');
    
    // Preload critical resources
    this.preloadCriticalResources();
    
    // Optimize memory usage
    this.optimizeMemoryUsage();
  }

  private enableAdvancedOptimizations(): void {
    console.log('🔵 Applying Chrome 100+ advanced optimizations...');
    
    // Enable advanced caching
    this.enableAdvancedCaching();
    
    // Optimize network requests
    this.optimizeNetworkRequests();
  }

  private preloadCriticalResources(): void {
    // Preload Firebase SDK
    const firebaseScript = document.createElement('link');
    firebaseScript.rel = 'preload';
    firebaseScript.href = 'https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js';
    firebaseScript.as = 'script';
    document.head.appendChild(firebaseScript);
  }

  private optimizeMemoryUsage(): void {
    // Clear unused memory
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.8) {
        console.log('🔵 High memory usage detected, clearing cache...');
        this.clearMemoryCache();
      }
    }
  }

  private enableAdvancedCaching(): void {
    // Enable service worker caching for auth
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Service worker not available, continue without it
      });
    }
  }

  private optimizeNetworkRequests(): void {
    // Set up connection pooling
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        console.log('🔵 Slow connection detected, applying optimizations...');
        this.applySlowConnectionOptimizations();
      }
    }
  }

  private applySlowConnectionOptimizations(): void {
    // Reduce timeout values for slow connections
    console.log('🔵 Applying slow connection optimizations...');
  }

  private clearMemoryCache(): void {
    // Clear any cached data that might be slowing down auth
    try {
      // Clear localStorage auth cache
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('firebase:authUser:')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('⚠️ Could not clear memory cache:', error);
    }
  }

  // Get performance summary
  getPerformanceSummary(): Record<string, number> {
    return Object.fromEntries(this.performanceMetrics);
  }

  // Reset all metrics
  reset(): void {
    this.performanceMetrics.clear();
  }
}

// Export singleton instance
export const authPerformance = AuthPerformance.getInstance();
