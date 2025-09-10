import { useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Eye, Package } from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock_quantity: number;
  images: string[];
  is_active: boolean;
  created_at: string;
}

export default function AdminProducts() {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for demonstration - replace with actual Firebase/API call
  const products: Product[] = [
    {
      id: "1",
      name: "Handwoven Cotton Saree",
      category: "Sarees",
      price: 2500,
      stock_quantity: 15,
      images: ["/api/placeholder/400/400"],
      is_active: true,
      created_at: "2024-01-10T00:00:00Z"
    },
    {
      id: "2",
      name: "Silk Dupatta",
      category: "Dupattas",
      price: 1200,
      stock_quantity: 8,
      images: ["/api/placeholder/400/400"],
      is_active: true,
      created_at: "2024-01-09T00:00:00Z"
    },
    {
      id: "3",
      name: "Block Print Kurta",
      category: "Kurtas",
      price: 1800,
      stock_quantity: 0,
      images: ["/api/placeholder/400/400"],
      is_active: false,
      created_at: "2024-01-08T00:00:00Z"
    }
  ];

  const toggleProductStatus = async (id: string, currentStatus: boolean) => {
    // TODO: Implement with Firebase/API
    console.log(`Toggle product ${id} from ${currentStatus} to ${!currentStatus}`);
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    // TODO: Implement with Firebase/API
    console.log(`Delete product ${id}`);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="aspect-square relative bg-muted">
              {product.images?.[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              <Badge
                className={`absolute top-2 right-2 ${
                  product.is_active ? 'bg-green-500' : 'bg-red-500'
                }`}
              >
                {product.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-lg">{product.name}</CardTitle>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{product.category}</Badge>
                <span className="text-lg font-bold">₹{product.price.toLocaleString()}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">
                  Stock: {product.stock_quantity}
                </span>
                <span className="text-sm text-muted-foreground">
                  Added: {new Date(product.created_at).toLocaleDateString()}
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
                  variant={product.is_active ? "secondary" : "default"}
                  onClick={() => toggleProductStatus(product.id, product.is_active)}
                >
                  {product.is_active ? 'Deactivate' : 'Activate'}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteProduct(product.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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