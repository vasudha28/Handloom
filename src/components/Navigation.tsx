import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart, User, Menu, Search, LogOut, Settings, Shield, Building, Users, Package } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import FloatingAuthModal from "@/components/auth/FloatingAuthModal";
import logoImage from "@/assets/logo.png";

// Custom Hover Dropdown Component
const HoverDropdown = ({ trigger, children, className = "" }: { 
  trigger: React.ReactNode; 
  children: React.ReactNode; 
  className?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className={`relative ${className}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {trigger}
      {isOpen && (
        <div className="absolute top-full left-0 z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 slide-in-from-top-2">
          {children}
        </div>
      )}
    </div>
  );
};

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'signin' | 'signup'>('signin');
  const { user, signOut } = useAuth();
  const { getCartItemsCount } = useCart();
  const { getWishlistItemsCount } = useWishlist();

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
            
            {/* Men Dropdown */}
            <HoverDropdown
              trigger={
                <Link to="/products?category=men" className="text-foreground hover:text-primary transition-smooth cursor-pointer">
                  Men
                </Link>
              }
            >
              <Link to="/products?category=men&subcategory=shirts" className="block w-full px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors">
                Shirts
              </Link>
              <Link to="/products?category=men&subcategory=kurtas" className="block w-full px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors">
                Kurtas
              </Link>
              <Link to="/products?category=men&subcategory=dhotis" className="block w-full px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors">
                Dhotis
              </Link>
            </HoverDropdown>

            {/* Women Dropdown */}
            <HoverDropdown
              trigger={
                <Link to="/products?category=women" className="text-foreground hover:text-primary transition-smooth cursor-pointer">
                  Women
                </Link>
              }
            >
              <Link to="/products?category=women&subcategory=saree" className="block w-full px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors">
                Saree
              </Link>
              <Link to="/products?category=women&subcategory=short-kurti" className="block w-full px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors">
                Short Kurti
              </Link>
              <Link to="/products?category=women&subcategory=long-kurtis" className="block w-full px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors">
                Long Kurtis
              </Link>
              <Link to="/products?category=women&subcategory=lehangas" className="block w-full px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors">
                Lehangas
              </Link>
              <Link to="/products?category=women&subcategory=dupattas" className="block w-full px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors">
                Dupattas
              </Link>
            </HoverDropdown>

            {/* Living Dropdown */}
            <HoverDropdown
              trigger={
                <Link to="/products?category=living" className="text-foreground hover:text-primary transition-smooth cursor-pointer">
                  Living
                </Link>
              }
            >
              <Link to="/products?category=living&subcategory=bedsheets" className="block w-full px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors">
                Bedsheets
              </Link>
              <Link to="/products?category=living&subcategory=curtains" className="block w-full px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors">
                Curtains
              </Link>
              <Link to="/products?category=living&subcategory=doormats" className="block w-full px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors">
                Doormats
              </Link>
              <Link to="/products?category=living&subcategory=handkies" className="block w-full px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors">
                Handkies
              </Link>
            </HoverDropdown>

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
            <Link to="/wishlist">
              <Button variant="ghost" size="icon" className="hidden sm:flex relative">
                <Heart className="w-5 h-5" />
                {getWishlistItemsCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getWishlistItemsCount()}
                  </span>
                )}
              </Button>
            </Link>
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

                  <DropdownMenuItem asChild>
                    <Link to="/track-order" className="flex items-center">
                      <Package className="mr-2 h-4 w-4" />
                      Track Order
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
              
              {/* Men Mobile Section */}
              <div className="space-y-2">
                <div className="text-foreground font-medium py-2">Men</div>
                <div className="ml-4 space-y-2">
                  <Link to="/products?category=men&subcategory=shirts" className="text-foreground hover:text-primary transition-smooth py-1 block" onClick={() => setIsMenuOpen(false)}>Shirts</Link>
                  <Link to="/products?category=men&subcategory=kurtas" className="text-foreground hover:text-primary transition-smooth py-1 block" onClick={() => setIsMenuOpen(false)}>Kurtas</Link>
                  <Link to="/products?category=men&subcategory=dhotis" className="text-foreground hover:text-primary transition-smooth py-1 block" onClick={() => setIsMenuOpen(false)}>Dhotis</Link>
                </div>
              </div>

              {/* Women Mobile Section */}
              <div className="space-y-2">
                <div className="text-foreground font-medium py-2">Women</div>
                <div className="ml-4 space-y-2">
                  <Link to="/products?category=women&subcategory=saree" className="text-foreground hover:text-primary transition-smooth py-1 block" onClick={() => setIsMenuOpen(false)}>Saree</Link>
                  <Link to="/products?category=women&subcategory=short-kurti" className="text-foreground hover:text-primary transition-smooth py-1 block" onClick={() => setIsMenuOpen(false)}>Short Kurti</Link>
                  <Link to="/products?category=women&subcategory=long-kurtis" className="text-foreground hover:text-primary transition-smooth py-1 block" onClick={() => setIsMenuOpen(false)}>Long Kurtis</Link>
                  <Link to="/products?category=women&subcategory=lehangas" className="text-foreground hover:text-primary transition-smooth py-1 block" onClick={() => setIsMenuOpen(false)}>Lehangas</Link>
                  <Link to="/products?category=women&subcategory=dupattas" className="text-foreground hover:text-primary transition-smooth py-1 block" onClick={() => setIsMenuOpen(false)}>Dupattas</Link>
                </div>
              </div>

              {/* Living Mobile Section */}
              <div className="space-y-2">
                <div className="text-foreground font-medium py-2">Living</div>
                <div className="ml-4 space-y-2">
                  <Link to="/products?category=living&subcategory=bedsheets" className="text-foreground hover:text-primary transition-smooth py-1 block" onClick={() => setIsMenuOpen(false)}>Bedsheets</Link>
                  <Link to="/products?category=living&subcategory=curtains" className="text-foreground hover:text-primary transition-smooth py-1 block" onClick={() => setIsMenuOpen(false)}>Curtains</Link>
                  <Link to="/products?category=living&subcategory=doormats" className="text-foreground hover:text-primary transition-smooth py-1 block" onClick={() => setIsMenuOpen(false)}>Doormats</Link>
                  <Link to="/products?category=living&subcategory=handkies" className="text-foreground hover:text-primary transition-smooth py-1 block" onClick={() => setIsMenuOpen(false)}>Handkies</Link>
                </div>
              </div>

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
                    
                    {/* Mobile User Menu Options */}
                    <div className="space-y-2">
                      <Link 
                        to="/profile" 
                        className="flex items-center w-full p-2 text-sm text-foreground hover:text-primary transition-colors rounded-md hover:bg-accent"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User className="w-4 h-4 mr-2" />
                        Profile Settings
                      </Link>
                      <Link 
                        to="/orders" 
                        className="flex items-center w-full p-2 text-sm text-foreground hover:text-primary transition-colors rounded-md hover:bg-accent"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        My Orders
                      </Link>
                      <Link 
                        to="/track-order" 
                        className="flex items-center w-full p-2 text-sm text-foreground hover:text-primary transition-colors rounded-md hover:bg-accent"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Package className="w-4 h-4 mr-2" />
                        Track Order
                      </Link>
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