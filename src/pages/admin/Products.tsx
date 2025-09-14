import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Eye, Package, Loader2 } from "lucide-react";
import { productService } from '@/services/productService';
import { useToast } from '@/hooks/use-toast';

interface Product {
  _id: string;
  title: string;
  description: string;
  category: string;
  productCollection: string; // Changed from 'collection' to match backend schema
  price: number;
  quantity: number;
  images: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminProducts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Load products from API
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productService.getProducts({
        page: 1,
        limit: 50,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });
      
      if (response.success && response.products) {
        setProducts(response.products);
      } else {
        throw new Error(response.error || 'Failed to load products');
      }
    } catch (err: any) {
      console.error('Error loading products:', err);
      setError(err.message || 'Failed to load products');
      toast({
        title: "Error",
        description: "Failed to load products. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await productService.deleteProduct(productId);
      if (response.success) {
        toast({
          title: "Success",
          description: "Product deleted successfully!",
        });
        loadProducts(); // Reload the list
      } else {
        throw new Error(response.error || 'Failed to delete product');
      }
    } catch (err: any) {
      console.error('Error deleting product:', err);
      toast({
        title: "Error",
        description: err.message || 'Failed to delete product',
        variant: "destructive",
      });
    }
  };

  const toggleProductStatus = async (id: string, currentStatus: boolean) => {
    try {
      const newStatus = currentStatus ? 'archived' : 'active';
      const response = await productService.updateProduct(id, { status: newStatus });
      
      if (response.success) {
        toast({
          title: "Success",
          description: `Product ${newStatus === 'active' ? 'activated' : 'archived'} successfully!`,
        });
        loadProducts(); // Reload the list
      } else {
        throw new Error(response.error || 'Failed to update product status');
      }
    } catch (err: any) {
      console.error('Error updating product status:', err);
      toast({
        title: "Error",
        description: err.message || 'Failed to update product status',
        variant: "destructive",
      });
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    // TODO: Implement with Firebase/API
    console.log(`Delete product ${id}`);
  };

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.productCollection.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <Link to="/admin/add-product">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Badge variant="outline">
          {filteredProducts.length} products
        </Badge>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading products...</span>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={loadProducts}>Try Again</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product._id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="aspect-square relative bg-muted overflow-hidden">
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                
                {/* Status Badge */}
                <Badge
                  className={`absolute top-2 right-2 shadow-md ${
                    product.status === 'active' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                  }`}
                >
                  {product.status === 'active' ? 'Active' : 'Inactive'}
                </Badge>
                
                {/* Stock Badge */}
                <Badge className="absolute top-2 left-2 bg-blue-500 text-white shadow-md">
                  Stock: {product.quantity || 0}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{product.title}</CardTitle>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{product.category} - {product.productCollection}</Badge>
                  <span className="text-lg font-bold">₹{product.price.toLocaleString()}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-foreground">
                    Stock: {product.quantity}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Added: {new Date(product.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={product.status === 'active' ? "secondary" : "default"}
                    onClick={() => toggleProductStatus(product._id, product.status === 'active')}
                  >
                    {product.status === 'active' ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteProduct(product._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredProducts.length === 0 && !loading && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No products found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first product'}
          </p>
          <Link to="/admin/add-product">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>
      )}
      </div>
    </AdminLayout>
  );
}