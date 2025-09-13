import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderTracking from "./pages/OrderTracking";
import About from "./pages/About";
import Contact from "./pages/Contact";
import BulkOrders from "./pages/BulkOrders";
import Wishlist from "./pages/Wishlist";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import { AuthProvider } from "./hooks/useAuth";
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import AuthGuard from "./components/auth/AuthGuard";
import SecurityInfo from "./components/auth/SecurityInfo";
// Admin imports
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminProductsPage from "./pages/admin/Products";
import AddProductPage from "./pages/admin/AddProductPage";
import ProductCollectionsPage from "./pages/admin/ProductCollectionsPage";
import ProductInventoryPage from "./pages/admin/ProductInventoryPage";
import PurchaseOrdersPage from "./pages/admin/PurchaseOrdersPage";
import TransfersPage from "./pages/admin/TransfersPage";
import GiftCardsPage from "./pages/admin/GiftCardsPage";

// Load debug utilities and extension helpers
if (import.meta.env.DEV) {
  import("./utils/debugAuth");
  import("./utils/testGoogleAuth");
  import("./utils/setupAdmin");
  
  // Inform developers about harmless Chrome extension console messages
  console.log(`
🔧 Development Mode Active

ℹ️  If you see errors like "The message port closed before a response was received":
   - These are usually harmless Chrome extension messages
   - Common sources: AdBlock, React DevTools, Firebase extensions
   - They don't affect your app functionality
   - You can safely ignore them if authentication works

🛠️  Debug tools available:
   - authDebug.runFullDiagnostic() - Full authentication check
   - testGoogleAuth() - Specific Google authentication test
   - quickAuthCheck() - Check current Google auth state
   - setupAdmin() - Create admin user for vasudhaoffsetprinters@gmail.com
   - authDebug.checkAuthState() - Current auth status
   - authDebug.watchAuthState() - Monitor auth changes
  `);
}

// Load Chrome extension helper (for both dev and production)
import("./utils/chromeExtensionHelper");


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
        <WishlistProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
           <Routes>
             {/* Admin Routes - Outside of main app layout */}
             <Route path="/admin/login" element={<AdminLoginPage />} />
             <Route path="/admin" element={<AdminDashboardPage />} />
             <Route path="/admin/orders" element={<AdminOrdersPage />} />
             
             {/* Admin Product Routes */}
             <Route path="/admin/products" element={<AdminProductsPage />} />
             <Route path="/admin/add-product" element={<AddProductPage />} />
             <Route path="/admin/products/collections" element={<ProductCollectionsPage />} />
             <Route path="/admin/products/inventory" element={<ProductInventoryPage />} />
             <Route path="/admin/products/purchase-orders" element={<PurchaseOrdersPage />} />
             <Route path="/admin/products/transfers" element={<TransfersPage />} />
             <Route path="/admin/products/gift-cards" element={<GiftCardsPage />} />
            
            {/* Main App Routes - With AuthGuard and layout */}
            <Route path="/*" element={
              <AuthGuard inactivityTimeout={30} showInactivityWarning={true}>
                <div className="min-h-screen flex flex-col">
                  <Navigation />
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/wishlist" element={<Wishlist />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/track-order" element={<OrderTracking />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/bulk-orders" element={<BulkOrders />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/security" element={<SecurityInfo />} />
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              </AuthGuard>
            } />
          </Routes>
        </BrowserRouter>
        </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
