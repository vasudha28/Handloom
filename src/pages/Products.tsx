import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Heart, Search, Filter, ShoppingCart, Loader2, Eye } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "sonner";
import { productService, ProductFormData } from "@/services/productService";
import { ProductDetailsModal } from "@/components/ProductDetailsModal";

// Images are now loaded from database

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<ProductFormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<ProductFormData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // Fetch products from database
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await productService.getProducts({
          page: 1,
          limit: 100,
          category: category || undefined,
          search: searchTerm || undefined,
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
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [category, searchTerm]);

  const handleAddToCart = (product: ProductFormData) => {
    addToCart({
      id: product._id || product.title,
      name: product.title,
      price: product.price,
      originalPrice: product.costPerItem,
      image: product.images?.[0] || '/placeholder.svg',
      origin: product.category
    });
    
    toast.success(`${product.title} added to cart!`);
  };

  const handleWishlistToggle = (product: ProductFormData) => {
    const wishlistItem = {
      id: product._id || product.title,
      name: product.title,
      price: product.price,
      originalPrice: product.costPerItem,
      image: product.images?.[0] || '/placeholder.svg',
      origin: product.category,
      category: product.category
    };

    if (isInWishlist(product._id || product.title)) {
      removeFromWishlist(product._id || product.title);
      toast.success(`${product.title} removed from wishlist!`);
    } else {
      addToWishlist(wishlistItem);
      toast.success(`${product.title} added to wishlist!`);
    }
  };

  const handleViewDetails = (product: ProductFormData) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };


  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !category || product.category === category;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">Our Handloom Collection</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover authentic handwoven treasures crafted by skilled artisans across India
          </p>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-lg p-6 mb-8 shadow-soft">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="sarees">Sarees</SelectItem>
                <SelectItem value="dupatta">Dupatta</SelectItem>
                <SelectItem value="kurta">Kurta</SelectItem>
                <SelectItem value="stole">Stole</SelectItem>
                <SelectItem value="home-decor">Home Decor</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="price-low">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product._id || product.title} className="group hover:shadow-elegant transition-all duration-300 overflow-hidden bg-white">
              <div className="relative overflow-hidden">
                <div className="aspect-square w-full">
                  <img
                    src={product.images?.[0] || '/placeholder.svg'}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                </div>
                
                {/* Status Badge */}
                {product.status === 'active' ? (
                  <Badge className="absolute top-3 left-3 bg-green-500 text-white shadow-md">
                    Available
                  </Badge>
                ) : (
                  <Badge className="absolute top-3 left-3 bg-red-500 text-white shadow-md">
                    Out of Stock
                  </Badge>
                )}
                
                {/* Discount Badge */}
                {product.costPerItem > product.price && (
                  <Badge className="absolute top-3 right-3 bg-orange-500 text-white shadow-md">
                    {Math.round(((product.costPerItem - product.price) / product.costPerItem) * 100)}% OFF
                  </Badge>
                )}
                
                {/* Wishlist Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className={`absolute bottom-3 right-3 bg-white/90 hover:bg-white shadow-md transition-all duration-200 ${
                    isInWishlist(product._id || product.title) ? 'text-red-500 scale-110' : 'text-gray-600'
                  }`}
                  onClick={() => handleWishlistToggle(product)}
                >
                  <Heart 
                    className={`h-5 w-5 ${
                      isInWishlist(product._id || product.title) ? 'fill-current' : ''
                    }`} 
                  />
                </Button>
                
              </div>
              <CardContent className="p-4 space-y-3">
                {/* Stock Badge */}
                <div className="flex items-center justify-end">
                  <span className="text-xs text-muted-foreground">
                    Stock: {product.quantity || 0}
                  </span>
                </div>
                
                {/* Product Title */}
                <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
                  {product.title}
                </h3>
                
                {/* Price Section */}
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-primary">
                    ₹{product.price.toLocaleString()}
                  </span>
                  {product.costPerItem > product.price && (
                    <>
                      <span className="text-sm text-muted-foreground line-through">
                        ₹{product.costPerItem.toLocaleString()}
                      </span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Save ₹{(product.costPerItem - product.price).toLocaleString()}
                      </span>
                    </>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleViewDetails(product)}
                    size="sm"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                  <Button 
                    className="flex-1" 
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.quantity || product.quantity <= 0}
                    size="sm"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {product.quantity && product.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Products
          </Button>
        </div>
      </div>

      {/* Product Details Modal */}
      <ProductDetailsModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default Products;