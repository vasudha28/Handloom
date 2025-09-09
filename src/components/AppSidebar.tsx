import { Home, Package, ShoppingCart, Truck, Users, BarChart3, Settings, Plus, LogOut } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const customerItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Products", url: "/products", icon: Package },
  { title: "Cart", url: "/cart", icon: ShoppingCart },
  { title: "Track Order", url: "/track-order", icon: Truck },
  { title: "About", url: "/about", icon: Users },
  { title: "Contact", url: "/contact", icon: Settings },
];

const b2bItems = [
  ...customerItems,
  { title: "Bulk Orders", url: "/bulk-orders", icon: Package },
];

const adminItems = [
  { title: "Dashboard", url: "/admin/dashboard", icon: BarChart3 },
  { title: "Products", url: "/admin/products", icon: Package },
  { title: "Add Product", url: "/admin/add-product", icon: Plus },
  { title: "Orders", url: "/admin/orders", icon: ShoppingCart },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { profile, signOut, isAdmin, isB2B } = useAuth();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const getMenuItems = () => {
    if (isAdmin) return adminItems;
    if (isB2B) return b2bItems;
    return customerItems;
  };

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted/50";

  return (
    <Sidebar className={collapsed ? "w-14" : "w-60"}>
      <SidebarTrigger className="m-2 self-end" />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            {isAdmin ? "Admin Panel" : isB2B ? "B2B Portal" : "Customer Portal"}
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu>
              {getMenuItems().map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {profile && (
          <SidebarGroup className="mt-auto">
            <SidebarGroupContent>
              <div className="p-4 border-t">
                {!collapsed && (
                  <div className="mb-2">
                    <p className="text-sm font-medium">{profile.full_name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{profile.role}</p>
                  </div>
                )}
                <Button
                  variant="outline"
                  size={collapsed ? "icon" : "sm"}
                  onClick={signOut}
                  className="w-full"
                >
                  <LogOut className="h-4 w-4" />
                  {!collapsed && <span className="ml-2">Sign Out</span>}
                </Button>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}