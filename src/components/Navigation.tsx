import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart, User, Menu, Search, LogOut, Settings, Shield, Building, Users } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/contexts/CartContext";
import FloatingAuthModal from "@/components/auth/FloatingAuthModal";
import logoImage from "@/assets/logo.png";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'signin' | 'signup'>('signin');
  const { user, signOut } = useAuth();
  const { getCartItemsCount } = useCart();

  const handleAuthClick = (tab: 'signin' | 'signup') => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  const getUserDisplayName = () => {
    return user?.fullName || user?.email || 'User';
  };

  const getUserRole = () => {
    switch (user?.role) {
      case 'admin':
        return 'Administrator';
      case 'b2b_buyer':
        return 'B2B Buyer';
      case 'customer':
        return 'Customer';
      default:
        return 'User';
    }
  };

  return (
    <nav className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border shadow-soft">
      <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <img 
                src={logoImage} 
                alt="HandloomPortal Logo" 
                className="h-13 w-auto object-contain"
              />
            </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-primary transition-smooth">Home</Link>
            <Link to="/products" className="text-foreground hover:text-primary transition-smooth">Products</Link>
            <Link to="/track-order" className="text-foreground hover:text-primary transition-smooth">Track Order</Link>
            <Link to="/bulk-orders" className="text-foreground hover:text-primary transition-smooth">Bulk Orders</Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-smooth">About</Link>
            <Link to="/contact" className="text-foreground hover:text-primary transition-smooth">Contact</Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center max-w-sm mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search handloom products..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Heart className="w-5 h-5" />
            </Button>
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {getCartItemsCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getCartItemsCount()}
                  </span>
                )}
              </Button>
            </Link>
            
            {/* Authentication Section */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 hidden sm:flex">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={getUserDisplayName()} />
                      <AvatarFallback>
                        {getUserDisplayName().split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium">{getUserDisplayName()}</span>
                      <Badge variant="secondary" className="text-xs py-0">
                        {getUserRole()}
                      </Badge>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Profile Settings
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <Link to="/orders" className="flex items-center">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      My Orders
                    </Link>
                  </DropdownMenuItem>

                  {user.role === 'b2b_buyer' && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/quotations" className="flex items-center">
                          <Building className="mr-2 h-4 w-4" />
                          Quotations
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/invoices" className="flex items-center">
                          <Shield className="mr-2 h-4 w-4" />
                          Invoices
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  {user.role === 'admin' && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="flex items-center">
                          <Shield className="mr-2 h-4 w-4" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/users" className="flex items-center">
                          <Users className="mr-2 h-4 w-4" />
                          User Management
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2 hidden sm:flex">
                <Button variant="ghost" size="sm" onClick={() => handleAuthClick('signin')}>
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleAuthClick('signup')}>
                  Sign Up
                </Button>
              </div>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-3">
              <Link to="/" className="text-foreground hover:text-primary transition-smooth py-2" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link to="/products" className="text-foreground hover:text-primary transition-smooth py-2" onClick={() => setIsMenuOpen(false)}>Products</Link>
              <Link to="/track-order" className="text-foreground hover:text-primary transition-smooth py-2" onClick={() => setIsMenuOpen(false)}>Track Order</Link>
              <Link to="/bulk-orders" className="text-foreground hover:text-primary transition-smooth py-2" onClick={() => setIsMenuOpen(false)}>Bulk Orders</Link>
              <Link to="/about" className="text-foreground hover:text-primary transition-smooth py-2" onClick={() => setIsMenuOpen(false)}>About</Link>
              <Link to="/contact" className="text-foreground hover:text-primary transition-smooth py-2" onClick={() => setIsMenuOpen(false)}>Contact</Link>
              <div className="pt-2 space-y-2">
                {user ? (
                  <>
                    <div className="flex items-center space-x-2 p-2 border rounded-lg">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={getUserDisplayName()} />
                        <AvatarFallback>
                          {getUserDisplayName().split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{getUserDisplayName()}</div>
                        <Badge variant="secondary" className="text-xs">
                          {getUserRole()}
                        </Badge>
                      </div>
                    </div>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="w-full" 
                      onClick={signOut}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleAuthClick('signin')}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Login
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleAuthClick('signup')}
                    >
                      Sign Up
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Floating Authentication Modal */}
      <FloatingAuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authModalTab}
      />
    </nav>
  );
};

export default Navigation;