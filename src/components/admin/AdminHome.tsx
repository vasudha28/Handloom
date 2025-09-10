import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  Package, 
  Users, 
  Plus,
  Eye,
  Edit,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

// Mock data - replace with actual API calls
const mockData = {
  stats: {
    totalOrders: { value: 156, change: 12.5, trend: 'up' },
    revenue: { value: 45600, change: 8.2, trend: 'up' },
    products: { value: 89, change: -2.1, trend: 'down' },
    customers: { value: 1234, change: 15.3, trend: 'up' }
  },
  recentOrders: [
    { id: "ORD-001", customer: "John Doe", amount: 2500, status: "pending", date: "2024-01-15", items: 3 },
    { id: "ORD-002", customer: "Jane Smith", amount: 1800, status: "processing", date: "2024-01-15", items: 2 },
    { id: "ORD-003", customer: "Mike Johnson", amount: 3200, status: "completed", date: "2024-01-14", items: 5 },
    { id: "ORD-004", customer: "Sarah Wilson", amount: 1500, status: "pending", date: "2024-01-14", items: 2 },
    { id: "ORD-005", customer: "David Brown", amount: 2200, status: "processing", date: "2024-01-13", items: 4 },
  ],
  topProducts: [
    { id: 1, name: "Cotton Saree - Blue", sales: 45, revenue: 22500, category: "Sarees" },
    { id: 2, name: "Silk Kurta - Red", sales: 38, revenue: 19000, category: "Kurtas" },
    { id: 3, name: "Linen Shirt - White", sales: 32, revenue: 16000, category: "Shirts" },
    { id: 4, name: "Handwoven Scarf", sales: 28, revenue: 14000, category: "Accessories" },
  ]
};

export default function AdminHome() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const StatCard = ({ title, value, change, trend, icon: Icon, format = 'number' }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <Icon className="h-4 w-4 text-gray-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900 mb-1">
          {format === 'currency' ? formatCurrency(value) : value.toLocaleString()}
        </div>
        <div className="flex items-center text-xs">
          {trend === 'up' ? (
            <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
          ) : (
            <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
          )}
          <span className={trend === 'up' ? 'text-green-600' : 'text-red-600'}>
            {Math.abs(change)}%
          </span>
          <span className="text-gray-500 ml-1">from last month</span>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Orders"
          value={mockData.stats.totalOrders.value}
          change={mockData.stats.totalOrders.change}
          trend={mockData.stats.totalOrders.trend}
          icon={ShoppingCart}
        />
        <StatCard
          title="Revenue"
          value={mockData.stats.revenue.value}
          change={mockData.stats.revenue.change}
          trend={mockData.stats.revenue.trend}
          icon={DollarSign}
          format="currency"
        />
        <StatCard
          title="Products"
          value={mockData.stats.products.value}
          change={mockData.stats.products.change}
          trend={mockData.stats.products.trend}
          icon={Package}
        />
        <StatCard
          title="Customers"
          value={mockData.stats.customers.value}
          change={mockData.stats.customers.change}
          trend={mockData.stats.customers.trend}
          icon={Users}
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button className="h-20 flex flex-col items-center justify-center space-y-2">
              <Plus className="h-5 w-5" />
              <span className="text-sm">Add Product</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <ShoppingCart className="h-5 w-5" />
              <span className="text-sm">Manage Orders</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Users className="h-5 w-5" />
              <span className="text-sm">View Customers</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <TrendingUp className="h-5 w-5" />
              <span className="text-sm">Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest customer orders</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockData.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{order.id}</p>
                      <Badge className={getStatusColor(order.status)} variant="outline">
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{order.customer}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm font-semibold text-gray-900">
                        {formatCurrency(order.amount)}
                      </span>
                      <span className="text-xs text-gray-500">{order.items} items</span>
                    </div>
                  </div>
                  <div className="ml-3 flex space-x-1">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Top Products</CardTitle>
              <CardDescription>Best performing products this month</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockData.topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {formatCurrency(product.revenue)}
                    </p>
                    <p className="text-xs text-gray-500">{product.sales} sold</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Order Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Pending</span>
              <Badge className={getStatusColor('pending')} variant="outline">8</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Processing</span>
              <Badge className={getStatusColor('processing')} variant="outline">15</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Completed</span>
              <Badge className={getStatusColor('completed')} variant="outline">133</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Revenue Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Today</span>
              <span className="text-sm font-semibold">{formatCurrency(2450)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">This Week</span>
              <span className="text-sm font-semibold">{formatCurrency(12800)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">This Month</span>
              <span className="text-sm font-semibold">{formatCurrency(45600)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Inventory Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Low Stock</span>
              <Badge variant="destructive">5</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Out of Stock</span>
              <Badge variant="destructive">2</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Overstocked</span>
              <Badge variant="secondary">8</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
