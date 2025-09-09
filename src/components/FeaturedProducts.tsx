import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Star } from "lucide-react";
import productCollection from "@/assets/product-collection.jpg";

const FeaturedProducts = () => {
  const products = [
    {
      id: 1,
      name: "Royal Silk Saree",
      price: "₹12,999",
      originalPrice: "₹15,999",
      rating: 4.8,
      reviews: 124,
      image: productCollection,
      badge: "Best Seller",
      badgeColor: "bg-primary text-primary-foreground"
    },
    {
      id: 2,
      name: "Handwoven Cotton Dupatta",
      price: "₹2,499",
      originalPrice: "₹3,299",
      rating: 4.6,
      reviews: 89,
      image: productCollection,
      badge: "New Arrival",
      badgeColor: "bg-secondary text-secondary-foreground"
    },
    {
      id: 3,
      name: "Artisan Craft Bag",
      price: "₹1,899",
      originalPrice: "₹2,499",
      rating: 4.7,
      reviews: 156,
      image: productCollection,
      badge: "Limited Edition",
      badgeColor: "bg-accent text-accent-foreground"
    },
    {
      id: 4,
      name: "Traditional Block Print Kurta",
      price: "₹3,499",
      originalPrice: "₹4,299",
      rating: 4.9,
      reviews: 203,
      image: productCollection,
      badge: "Trending",
      badgeColor: "bg-coral text-coral-foreground"
    }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Featured <span className="bg-gradient-secondary bg-clip-text text-transparent">Products</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Handpicked collection of our most loved pieces, crafted with love by skilled artisans
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {products.map((product) => (
            <Card key={product.id} className="group overflow-hidden hover:shadow-warm transition-smooth">
              <div className="relative">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-smooth"
                />
                <Badge 
                  className={`absolute top-3 left-3 ${product.badgeColor}`}
                >
                  {product.badge}
                </Badge>
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-smooth">
                  <Button variant="ghost" size="icon" className="bg-background/90 backdrop-blur-sm hover:bg-background">
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-smooth">
                  {product.name}
                </h3>
                
                <div className="flex items-center gap-1 mb-3">
                  <Star className="w-4 h-4 fill-primary text-primary" />
                  <span className="text-sm font-medium">{product.rating}</span>
                  <span className="text-sm text-muted-foreground">({product.reviews})</span>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl font-bold text-primary">{product.price}</span>
                  <span className="text-sm text-muted-foreground line-through">{product.originalPrice}</span>
                  <Badge variant="secondary" className="text-xs">
                    {Math.round(((parseInt(product.originalPrice.slice(1).replace(',', '')) - parseInt(product.price.slice(1).replace(',', ''))) / parseInt(product.originalPrice.slice(1).replace(',', ''))) * 100)}% OFF
                  </Badge>
                </div>

                <Button 
                  className="w-full group-hover:bg-gradient-primary group-hover:text-white transition-smooth" 
                  variant="outline"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button variant="hero" size="lg">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;