import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "localhost",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: false, // Disable source maps to avoid Firebase source map issues
  },
  optimizeDeps: {
    exclude: ['firebase'], // Exclude Firebase from pre-bundling to avoid source map issues
  },
  esbuild: {
    sourcemap: false, // Disable esbuild source maps
  },
  define: {
    // Suppress Firebase source map warnings
    'process.env.NODE_ENV': JSON.stringify(mode),
  },
  // Suppress source map warnings in console
  logLevel: 'info',
  clearScreen: false,
}));
