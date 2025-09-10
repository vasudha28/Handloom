import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Home,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  Percent,
  FileText,
  Globe,
  BarChart3,
  Store,
  Plus,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  Grid3x3,
  Archive,
  ShoppingBag,
  ArrowRightLeft,
  Gift
} from 'lucide-react';

interface SidebarItem {
  title: string;
  icon: React.ComponentType<any>;
  href?: string;
  badge?: number;
  children?: SidebarItem[];
}

const sidebarItems: SidebarItem[] = [
  {
    title: 'Home',
    icon: Home,
    href: '/admin'
  },
  {
    title: 'Orders',
    icon: ShoppingCart,
    href: '/admin/orders',
    badge: 8
  },
  {
    title: 'Products',
    icon: Package,
    children: [
      {
        title: 'All Products',
        icon: Package,
        href: '/admin/products'
      },
      {
        title: 'Collections',
        icon: Grid3x3,
        href: '/admin/products/collections'
      },
      {
        title: 'Inventory',
        icon: Archive,
        href: '/admin/products/inventory'
      },
      {
        title: 'Purchase orders',
        icon: ShoppingBag,
        href: '/admin/products/purchase-orders'
      },
      {
        title: 'Transfers',
        icon: ArrowRightLeft,
        href: '/admin/products/transfers'
      },
      {
        title: 'Gift cards',
        icon: Gift,
        href: '/admin/products/gift-cards'
      }
    ]
  },
  {
    title: 'Customers',
    icon: Users,
    href: '/admin/customers'
  },
  {
    title: 'Marketing',
    icon: TrendingUp,
    href: '/admin/marketing'
  },
  {
    title: 'Discounts',
    icon: Percent,
    href: '/admin/discounts'
  },
  {
    title: 'Content',
    icon: FileText,
    href: '/admin/content'
  },
  {
    title: 'Markets',
    icon: Globe,
    href: '/admin/markets'
  },
  {
    title: 'Analytics',
    icon: BarChart3,
    href: '/admin/analytics'
  }
];

const salesChannels: SidebarItem[] = [
  {
    title: 'Online Store',
    icon: Store,
    href: '/admin/online-store'
  }
];

interface AdminSidebarProps {
  className?: string;
}

export default function AdminSidebar({ className }: AdminSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const location = useLocation();

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-gray-50 border-r border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className={cn("flex items-center space-x-2", isCollapsed && "justify-center")}>
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <span className="font-semibold text-lg text-gray-900">Handloom</span>
          )}
        </div>
        
        {/* Desktop collapse toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <X className="w-4 h-4" />}
        </Button>

        {/* Mobile close button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          {sidebarItems.map((item) => (
            <div key={item.title}>
              {item.href ? (
                <Link
                  to={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    isActive(item.href)
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && <span>{item.title}</span>}
                  </div>
                  {!isCollapsed && item.badge && (
                    <Badge variant="secondary" className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              ) : (
                <button
                  onClick={() => toggleExpanded(item.title)}
                  className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && <span>{item.title}</span>}
                  </div>
                  {!isCollapsed && item.children && (
                    expandedItems.includes(item.title) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )
                  )}
                </button>
              )}

              {/* Submenu */}
              {item.children && expandedItems.includes(item.title) && !isCollapsed && (
                <div className="ml-8 mt-1 space-y-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.title}
                      to={child.href!}
                      onClick={() => setIsMobileOpen(false)}
                      className={cn(
                        "flex items-center px-3 py-2 text-sm rounded-lg transition-colors",
                        isActive(child.href!)
                          ? "bg-primary text-white"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      )}
                    >
                      <child.icon className="w-4 h-4 mr-3" />
                      <span>{child.title}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Sales Channels Section */}
        <div className="mt-8">
          {!isCollapsed && (
            <div className="flex items-center justify-between px-3 mb-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Sales channels
              </h3>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          )}
          
          <div className="space-y-1">
            {salesChannels.map((item) => (
              <Link
                key={item.title}
                to={item.href!}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  isActive(item.href!)
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span>{item.title}</span>}
              </Link>
            ))}
          </div>
        </div>

        {/* Apps Section */}
        <div className="mt-8">
          {!isCollapsed && (
            <div className="flex items-center justify-between px-3 mb-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Apps
              </h3>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          )}
          
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-gray-700 hover:bg-gray-100 hover:text-gray-900",
              isCollapsed && "justify-center px-2"
            )}
            onClick={() => setIsMobileOpen(false)}
          >
            <Plus className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="ml-3">Add</span>}
          </Button>
        </div>
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-white shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </Button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 flex-shrink-0 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        className
      )}>
        <SidebarContent />
      </aside>
    </>
  );
}
