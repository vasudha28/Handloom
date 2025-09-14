import { useState, useEffect } from "react";
// Removed Supabase import to prevent conflicts
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, TrendingUp, Users, Package, ShoppingCart, DollarSign, Calendar } from "lucide-react";

interface AnalyticsData {
  salesData: {
    daily: { date: string; amount: number; orders: number }[];
    monthly: { month: string; amount: number; orders: number }[];
    yearly: { year: string; amount: number; orders: number }[];
  };
  productPerformance: {
    topProducts: { name: string; sales: number; revenue: number }[];
    categoryWise: { category: string; sales: number; revenue: number }[];
  };
  customerInsights: {
    repeatCustomers: number;
    newCustomers: number;
    abandonedCarts: number;
  };
  orderTrends: {
    bulkOrders: number;
    retailOrders: number;
    bulkRevenue: number;
    retailRevenue: number;
  };
}

export default function Analytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    salesData: { daily: [], monthly: [], yearly: [] },
    productPerformance: { topProducts: [], categoryWise: [] },
    customerInsights: { repeatCustomers: 0, newCustomers: 0, abandonedCarts: 0 },
    orderTrends: { bulkOrders: 0, retailOrders: 0, bulkRevenue: 0, retailRevenue: 0 }
  });
  
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      // Fetch sales data
      const { data: orders } = await supabase
        .from('orders')
        .select(`
          created_at,
          total_amount,
          order_type,
          order_items (
            quantity,
            products (name, category)
          )
        `);

      // Fetch cart abandonment data
      const { count: abandonedCarts } = await supabase
        .from('cart_items')
        .select('*', { count: 'exact', head: true });

      // Process data
      const processedData = processAnalyticsData(orders || []);
      
      setAnalytics({
        ...processedData,
        customerInsights: {
          ...processedData.customerInsights,
          abandonedCarts: abandonedCarts || 0
        }
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const processAnalyticsData = (orders: any[]): AnalyticsData => {
    // Process sales data by period
    const now = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const last12Months = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

    // Daily data (last 30 days)
    const dailyData = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const dayOrders = orders.filter(o => o.created_at.startsWith(dateStr));
      
      dailyData.push({
        date: dateStr,
        amount: dayOrders.reduce((sum, o) => sum + Number(o.total_amount), 0),
        orders: dayOrders.length
      });
    }

    // Monthly data (last 12 months)
    const monthlyData = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStr = date.toISOString().substring(0, 7);
      const monthOrders = orders.filter(o => o.created_at.startsWith(monthStr));
      
      monthlyData.push({
        month: monthStr,
        amount: monthOrders.reduce((sum, o) => sum + Number(o.total_amount), 0),
        orders: monthOrders.length
      });
    }

    // Yearly data
    const yearlyData = [];
    const currentYear = now.getFullYear();
    for (let year = currentYear - 2; year <= currentYear; year++) {
      const yearOrders = orders.filter(o => o.created_at.startsWith(year.toString()));
      yearlyData.push({
        year: year.toString(),
        amount: yearOrders.reduce((sum, o) => sum + Number(o.total_amount), 0),
        orders: yearOrders.length
      });
    }

    // Product performance
    const productSales: { [key: string]: { sales: number; revenue: number } } = {};
    const categorySales: { [key: string]: { sales: number; revenue: number } } = {};

    orders.forEach(order => {
      order.order_items?.forEach((item: any) => {
        const product = item.products;
        if (product) {
          if (!productSales[product.name]) {
            productSales[product.name] = { sales: 0, revenue: 0 };
          }
          if (!categorySales[product.category]) {
            categorySales[product.category] = { sales: 0, revenue: 0 };
          }
          
          productSales[product.name].sales += item.quantity;
          productSales[product.name].revenue += item.quantity * Number(order.total_amount) / order.order_items.length;
          
          categorySales[product.category].sales += item.quantity;
          categorySales[product.category].revenue += item.quantity * Number(order.total_amount) / order.order_items.length;
        }
      });
    });

    // Order trends
    const bulkOrders = orders.filter(o => o.order_type === 'bulk');
    const retailOrders = orders.filter(o => o.order_type === 'retail');

    return {
      salesData: {
        daily: dailyData,
        monthly: monthlyData,
        yearly: yearlyData
      },
      productPerformance: {
        topProducts: Object.entries(productSales)
          .map(([name, data]) => ({ name, ...data }))
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 10),
        categoryWise: Object.entries(categorySales)
          .map(([category, data]) => ({ category, ...data }))
          .sort((a, b) => b.revenue - a.revenue)
      },
      customerInsights: {
        repeatCustomers: 0, // Would need more complex query
        newCustomers: 0,    // Would need more complex query
        abandonedCarts: 0   // Will be set separately
      },
      orderTrends: {
        bulkOrders: bulkOrders.length,
        retailOrders: retailOrders.length,
        bulkRevenue: bulkOrders.reduce((sum, o) => sum + Number(o.total_amount), 0),
        retailRevenue: retailOrders.reduce((sum, o) => sum + Number(o.total_amount), 0)
      }
    };
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const currentData = analytics.salesData[selectedPeriod as keyof typeof analytics.salesData];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Analytics & Reports</h1>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₹{(analytics.orderTrends.bulkRevenue + analytics.orderTrends.retailRevenue).toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analytics.orderTrends.bulkOrders + analytics.orderTrends.retailOrders}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Abandoned Carts</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.customerInsights.abandonedCarts}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">+12.5%</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sales Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between space-x-2">
                {currentData.slice(-10).map((item: any, index) => {
                  const maxAmount = Math.max(...currentData.map((d: any) => d.amount));
                  const height = maxAmount > 0 ? (item.amount / maxAmount) * 200 : 0;
                  
                  return (
                    <div key={index} className="flex flex-col items-center space-y-2">
                      <div
                        className="bg-primary rounded-t"
                        style={{ height: `${height}px`, width: '20px' }}
                      ></div>
                      <span className="text-xs text-muted-foreground">
                        {selectedPeriod === 'daily' ? new Date(item.date).getDate() :
                         selectedPeriod === 'monthly' ? new Date(item.month).getMonth() + 1 :
                         item.year}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.productPerformance.topProducts.slice(0, 5).map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <span className="font-medium">{product.name}</span>
                      <div className="text-right">
                        <div className="font-bold">₹{product.revenue.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">{product.sales} sales</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.productPerformance.categoryWise.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <span className="font-medium">{category.category}</span>
                      <div className="text-right">
                        <div className="font-bold">₹{category.revenue.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">{category.sales} sales</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Type Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Bulk Orders</h3>
                      <p className="text-sm text-muted-foreground">B2B and corporate orders</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{analytics.orderTrends.bulkOrders}</div>
                      <div className="text-sm text-muted-foreground">
                        ₹{analytics.orderTrends.bulkRevenue.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Retail Orders</h3>
                      <p className="text-sm text-muted-foreground">Individual customer orders</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{analytics.orderTrends.retailOrders}</div>
                      <div className="text-sm text-muted-foreground">
                        ₹{analytics.orderTrends.retailRevenue.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}