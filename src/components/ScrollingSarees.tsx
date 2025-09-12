import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

// Import actual product images
import womenImage1 from "@/assets/scrolling-images/women/H1.png.webp";
import womenImage2 from "@/assets/scrolling-images/women/H2.webp";
import womenImage3 from "@/assets/scrolling-images/women/K2.webp";
import womenImage4 from "@/assets/scrolling-images/women/k3.webp";
import womenImage5 from "@/assets/scrolling-images/women/k4.webp";
import womenImage6 from "@/assets/scrolling-images/women/k5.webp";
import menImage1 from "@/assets/scrolling-images/men/K3.webp";
import menImage2 from "@/assets/scrolling-images/men/K1.webp";

const ScrollingSarees = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();

  const handleAddToCart = (saree: any) => {
    // Convert price string to number (remove ₹ and ,)
    const price = parseInt(saree.price.slice(1).replace(',', ''));
    const originalPrice = parseInt(saree.originalPrice.slice(1).replace(',', ''));
    
    addToCart({
      id: saree.id,
      name: saree.name,
      price,
      originalPrice,
      image: saree.image,
      badge: saree.badge,
      origin: saree.origin,
      fabric: saree.fabric
    });
    
    toast.success(`${saree.name} added to cart!`);
  };

  const sarees = [
    {
      id: 1,
      name: "Handwoven Silk Saree",
      price: "₹18,999",
      originalPrice: "₹24,999",
      rating: 4.9,
      reviews: 256,
      image: womenImage1,
      badge: "Premium",
      badgeColor: "bg-amber-500 text-white",
      origin: "Varanasi",
      fabric: "Pure Silk"
    },
    {
      id: 2,
      name: "Traditional Cotton Saree",
      price: "₹15,499",
      originalPrice: "₹19,999",
      rating: 4.8,
      reviews: 189,
      image: womenImage2,
      badge: "Best Seller",
      badgeColor: "bg-primary text-primary-foreground",
      origin: "Kanchipuram",
      fabric: "Silk"
    },
    {
      id: 3,
      name: "Elegant Designer Saree",
      price: "₹6,999",
      originalPrice: "₹9,999",
      rating: 4.7,
      reviews: 134,
      image: womenImage3,
      badge: "Trending",
      badgeColor: "bg-coral text-coral-foreground",
      origin: "Madhya Pradesh",
      fabric: "Cotton Silk"
    },
    {
      id: 4,
      name: "Premium Handloom Saree",
      price: "₹8,999",
      originalPrice: "₹12,999",
      rating: 4.6,
      reviews: 98,
      image: womenImage4,
      badge: "New Arrival",
      badgeColor: "bg-secondary text-secondary-foreground",
      origin: "Jharkhand",
      fabric: "Tussar Silk"
    },
    {
      id: 5,
      name: "Artisan Craft Saree",
      price: "₹3,999",
      originalPrice: "₹5,999",
      rating: 4.5,
      reviews: 67,
      image: womenImage5,
      badge: "Eco-Friendly",
      badgeColor: "bg-green-500 text-white",
      origin: "West Bengal",
      fabric: "Handloom Cotton"
    },
    {
      id: 6,
      name: "Royal Collection Saree",
      price: "₹25,999",
      originalPrice: "₹35,999",
      rating: 5.0,
      reviews: 45,
      image: womenImage6,
      badge: "Exclusive",
      badgeColor: "bg-purple-600 text-white",
      origin: "Gujarat",
      fabric: "Double Ikat Silk"
    },
    {
      id: 7,
      name: "Men's Traditional Kurta",
      price: "₹7,499",
      originalPrice: "₹10,999",
      rating: 4.8,
      reviews: 112,
      image: menImage1,
      badge: "Regional Special",
      badgeColor: "bg-blue-500 text-white",
      origin: "Assam",
      fabric: "Handloom Cotton"
    },
    {
      id: 8,
      name: "Designer Men's Wear",
      price: "₹2,499",
      originalPrice: "₹3,999",
      rating: 4.4,
      reviews: 89,
      image: menImage2,
      badge: "Affordable",
      badgeColor: "bg-orange-500 text-white",
      origin: "West Bengal",
      fabric: "Cotton"
    }
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      // Responsive scroll amount based on screen size
      const isMobile = window.innerWidth < 640;
      const scrollAmount = isMobile ? 296 : 320; // Width of one card plus gap
      const newScrollLeft = direction === 'left' 
        ? scrollRef.current.scrollLeft - scrollAmount
        : scrollRef.current.scrollLeft + scrollAmount;
      
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-muted/30 to-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Exquisite <span className="bg-gradient-warm bg-clip-text text-transparent">Saree Collection</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Discover our curated collection of handwoven sarees from master weavers across India. 
            Each piece tells a story of tradition, craftsmanship, and timeless elegance.
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="text-sm">
              {sarees.length} Premium Sarees
            </Badge>
            <Badge variant="secondary" className="text-sm">
              Handwoven Collection
            </Badge>
          </div>
          <div className="hidden md:flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('left')}
              className="rounded-full hover:bg-primary hover:text-primary-foreground transition-smooth"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('right')}
              className="rounded-full hover:bg-primary hover:text-primary-foreground transition-smooth"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Scrolling Container */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitScrollbar: { display: 'none' }
            }}
          >
            {sarees.map((saree) => (
              <Card
                key={saree.id}
                className="flex-shrink-0 w-72 sm:w-80 group overflow-hidden hover:shadow-warm transition-smooth bg-card/50 backdrop-blur-sm border border-border/50"
              >
                <div className="relative">
                  <img
                    src={saree.image}
                    alt={saree.name}
                    className="w-full h-72 object-cover group-hover:scale-105 transition-smooth"
                  />
                  <Badge
                    className={`absolute top-3 left-3 ${saree.badgeColor} shadow-lg`}
                  >
                    {saree.badge}
                  </Badge>
                  <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-smooth">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-background/90 backdrop-blur-sm hover:bg-background shadow-lg"
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {/* Gradient overlay for better text readability */}
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  {/* Origin and Fabric badges on image */}
                  <div className="absolute bottom-3 left-3 flex gap-2">
                    <Badge variant="secondary" className="text-xs bg-background/90 text-foreground">
                      {saree.origin}
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-background/90 text-foreground border-white/20">
                      {saree.fabric}
                    </Badge>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-smooth">
                    {saree.name}
                  </h3>

                  <div className="flex items-center gap-1 mb-3">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <span className="text-sm font-medium">{saree.rating}</span>
                    <span className="text-sm text-muted-foreground">({saree.reviews} reviews)</span>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl font-bold text-primary">{saree.price}</span>
                    <span className="text-sm text-muted-foreground line-through">{saree.originalPrice}</span>
                    <Badge variant="secondary" className="text-xs">
                      {Math.round(((parseInt(saree.originalPrice.slice(1).replace(',', '')) - parseInt(saree.price.slice(1).replace(',', ''))) / parseInt(saree.originalPrice.slice(1).replace(',', ''))) * 100)}% OFF
                    </Badge>
                  </div>

                  <Button
                    className="w-full group-hover:bg-gradient-primary group-hover:text-white transition-smooth shadow-soft"
                    variant="outline"
                    onClick={() => handleAddToCart(saree)}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Mobile scroll hint */}
        <div className="md:hidden text-center mt-6 mb-8">
          <p className="text-sm text-muted-foreground">
            👈 Swipe to explore more sarees 👉
          </p>
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button variant="hero" size="lg" className="min-w-[200px]">
            View Complete Saree Collection
          </Button>
        </div>
      </div>

      {/* CSS for hiding scrollbar */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default ScrollingSarees;
