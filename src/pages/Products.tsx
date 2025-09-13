import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Heart, Search, Filter, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "sonner";

// Import existing images from hero section
import womenImage1 from "@/assets/scrolling-images/women/H1.png.webp";
import womenImage2 from "@/assets/scrolling-images/women/H2.webp";
import womenImage3 from "@/assets/scrolling-images/women/K2.webp";
import womenImage4 from "@/assets/scrolling-images/women/k3.webp";
import womenImage5 from "@/assets/scrolling-images/women/k4.webp";
import womenImage6 from "@/assets/scrolling-images/women/k5.webp";

import menImage1 from "@/assets/scrolling-images/men/K3.jpg";
import menImage2 from "@/assets/scrolling-images/men/k1.jpg";
import menImage3 from "@/assets/scrolling-images/men/k5.jpg";
import menImage4 from "@/assets/scrolling-images/men/k2.jpg";

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const handleAddToCart = (product: any) => {
    // Convert price string to number (remove ₹ and ,)
    const price = parseInt(product.price.slice(1).replace(',', ''));
    const originalPrice = parseInt(product.originalPrice.slice(1).replace(',', ''));
    
    addToCart({
      id: product.id,
      name: product.name,
      price,
      originalPrice,
      image: product.image,
      origin: product.origin
    });
    
    toast.success(`${product.name} added to cart!`);
  };

  const handleWishlistToggle = (product: any) => {
    // Convert price string to number (remove ₹ and ,)
    const price = parseInt(product.price.slice(1).replace(',', ''));
    const originalPrice = parseInt(product.originalPrice.slice(1).replace(',', ''));
    
    const wishlistItem = {
      id: product.id,
      name: product.name,
      price,
      originalPrice,
      image: product.image,
      origin: product.origin,
      category: product.category
    };

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.success(`${product.name} removed from wishlist!`);
    } else {
      addToWishlist(wishlistItem);
      toast.success(`${product.name} added to wishlist!`);
    }
  };

  const products = [
    // Women's Collection
    {
      id: 1,
      name: "Elegant Silk Saree",
      price: "₹3,500",
      originalPrice: "₹4,200",
      image: womenImage1,
      category: "Sarees",
      origin: "Kanchipuram",
      discount: "17% OFF"
    },
    {
      id: 2,
      name: "Traditional Cotton Dupatta",
      price: "₹850",
      originalPrice: "₹1,200",
      image: womenImage2,
      category: "Dupatta",
      origin: "Rajasthan",
      discount: "29% OFF"
    },
    {
      id: 3,
      name: "Handwoven Kurta Set",
      price: "₹1,200",
      originalPrice: "₹1,500",
      image: womenImage3,
      category: "Kurta",
      origin: "West Bengal",
      discount: "20% OFF"
    },
    {
      id: 4,
      name: "Designer Saree",
      price: "₹2,800",
      originalPrice: "₹3,500",
      image: womenImage4,
      category: "Sarees",
      origin: "Gujarat",
      discount: "20% OFF"
    },
    {
      id: 5,
      name: "Embroidered Dupatta",
      price: "₹1,100",
      originalPrice: "₹1,400",
      image: womenImage5,
      category: "Dupatta",
      origin: "Punjab",
      discount: "21% OFF"
    },
    {
      id: 6,
      name: "Silk Kurta",
      price: "₹1,800",
      originalPrice: "₹2,200",
      image: womenImage6,
      category: "Kurta",
      origin: "Karnataka",
      discount: "18% OFF"
    },
    // Men's Collection
    {
      id: 7,
      name: "Cotton Kurta",
      price: "₹1,500",
      originalPrice: "₹1,900",
      image: menImage1,
      category: "Kurta",
      origin: "Rajasthan",
      discount: "21% OFF"
    },
    {
      id: 8,
      name: "Linen Shirt",
      price: "₹1,200",
      originalPrice: "₹1,500",
      image: menImage2,
      category: "Shirts",
      origin: "Tamil Nadu",
      discount: "20% OFF"
    },
    {
      id: 9,
      name: "Traditional Dhoti",
      price: "₹800",
      originalPrice: "₹1,000",
      image: menImage3,
      category: "Dhotis",
      origin: "Kerala",
      discount: "20% OFF"
    },
    {
      id: 10,
      name: "Formal Kurta",
      price: "₹2,200",
      originalPrice: "₹2,800",
      image: menImage4,
      category: "Kurta",
      origin: "Uttar Pradesh",
      discount: "21% OFF"
    },
    // Home Decor
    {
      id: 11,
      name: "Ikat Print Bedsheet",
      price: "₹2,100",
      originalPrice: "₹2,800",
      image: womenImage1,
      category: "Home Decor",
      origin: "Odisha",
      discount: "25% OFF"
    },
    {
      id: 12,
      name: "Handwoven Table Runner",
      price: "₹450",
      originalPrice: "₹600",
      image: womenImage2,
      category: "Home Decor",
      origin: "Gujarat",
      discount: "25% OFF"
    }
  ];

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
          {products.map((product) => (
            <Card key={product.id} className="group hover:shadow-elegant transition-shadow duration-300 overflow-hidden">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground">
                  {product.discount}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`absolute top-3 right-3 bg-white/80 hover:bg-white ${
                    isInWishlist(product.id) ? 'text-red-500' : 'text-gray-600'
                  }`}
                  onClick={() => handleWishlistToggle(product)}
                >
                  <Heart 
                    className={`h-4 w-4 ${
                      isInWishlist(product.id) ? 'fill-current' : ''
                    }`} 
                  />
                </Button>
              </div>
              <CardContent className="p-4">
                <Badge variant="outline" className="mb-2 text-xs">
                  {product.origin}
                </Badge>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl font-bold text-primary">{product.price}</span>
                  <span className="text-sm text-muted-foreground line-through">
                    {product.originalPrice}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1" onClick={() => handleAddToCart(product)}>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button variant="outline" size="sm">
                    View Details
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
    </div>
  );
};

export default Products;