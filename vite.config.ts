import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "localhost",
    port: 8080,
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
      credentials: true
    }
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: false, // Disable source maps to avoid Firebase source map issues
    target: 'es2015',
    minify: true, // Use default esbuild minifier
    rollupOptions: {
      output: {
        manualChunks: {
          // Ensure React is bundled as a single chunk
          'react-vendor': ['react', 'react-dom', 'react/jsx-runtime'],
          'react-router': ['react-router-dom'],
          'firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          'ui': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select'],
          'vendor': ['zod', 'clsx', 'tailwind-merge']
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    exclude: ['firebase'], // Exclude Firebase from pre-bundling to avoid source map issues
    include: [
      'react', 
      'react-dom', 
      'react/jsx-runtime',
      'react-router-dom',
      'react-hook-form',
      '@hookform/resolvers'
    ],
    force: true
  },
  esbuild: {
    jsx: 'automatic', // Use automatic JSX runtime
    sourcemap: false, // Disable esbuild source maps
    drop: mode === 'production' ? ['console', 'debugger'] : [], // Remove console.log and debugger in production only
  },
  define: {
    // Suppress Firebase source map warnings
    'process.env.NODE_ENV': JSON.stringify(mode),
    // Fix React Context issues in production
    global: 'globalThis',
    // Ensure React is available globally
    __DEV__: mode === 'development',
  },
  // Suppress source map warnings in console
  logLevel: 'info',
  clearScreen: false,
}));
