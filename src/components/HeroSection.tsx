import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-handloom.jpg";

// Women's collection images for left side
import womenImage1 from "@/assets/scrolling-images/women/H1.png.webp";
import womenImage2 from "@/assets/scrolling-images/women/H2.webp";
import womenImage3 from "@/assets/scrolling-images/women/K2.webp";
import womenImage4 from "@/assets/scrolling-images/women/k3.webp";
import womenImage5 from "@/assets/scrolling-images/women/k4.webp";
import womenImage6 from "@/assets/scrolling-images/women/k5.webp";

import menImage1 from "@/assets/scrolling-images/men/K3.webp";
import menImage2 from "@/assets/scrolling-images/men/K1.webp";
import menImage3 from "@/assets/scrolling-images/men/K5.jpg";
import menImage4 from "@/assets/scrolling-images/men/K2.jpg";

// Men's collection images for right side (placeholder - add your men's images here)
// import menImage1 from "@/assets/scrolling-images/men/men1.jpg";
// import menImage2 from "@/assets/scrolling-images/men/men2.jpg";

const HeroSection = () => {
  // Women's collection for left side scrolling (6 images only)
  const womenImages = [
    { image: womenImage1, discount: "15% OFF" },
    { image: womenImage2, discount: "20% OFF" },
    { image: womenImage3, discount: "25% OFF" },
    { image: womenImage4, discount: "30% OFF" },
    { image: womenImage5, discount: "18% OFF" },
    { image: womenImage6, discount: "22% OFF" }
  ];

  // Men's collection for right side scrolling (6 images only)
  const menImages = [
    { image: menImage1, discount: "12% OFF" },
    { image: menImage2, discount: "28% OFF" },
    { image: menImage3, discount: "16% OFF" },
    { image: menImage4, discount: "24% OFF" },
    { image: menImage1, discount: "15% OFF" },
    { image: menImage2, discount: "20% OFF" }
  ];

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat md:bg-fixed"
        style={{ 
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center'
        }}
      >
        {/* Stronger dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-black/20 to-secondary/10"></div>
      </div>

      {/* Left Vertical Scrolling Images - Women's Collection */}
      <div className="absolute left-0 top-0 h-full w-24 md:w-40 lg:w-48 xl:w-56 overflow-hidden hidden md:block">
        <div className="animate-scroll-up flex flex-col gap-6">
          {womenImages.concat(womenImages).map((item, index) => (
            <div key={`women-${index}`} className="relative rounded-lg overflow-hidden shadow-lg">
              <img
                src={item.image}
                alt={`Women's handloom product ${index + 1}`}
                className="w-full h-40 md:h-52 lg:h-64 xl:h-72 object-contain hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              {/* Discount Badge */}
              <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 shadow-lg">
                {item.discount}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Right Vertical Scrolling Images - Men's Collection */}
      <div className="absolute right-0 top-0 h-full w-24 md:w-40 lg:w-48 xl:w-56 overflow-hidden hidden md:block">
        <div className="animate-scroll-down flex flex-col gap-6">
          {menImages.concat(menImages).map((item, index) => (
            <div key={`men-${index}`} className="relative rounded-lg overflow-hidden shadow-lg">
              <img
                src={item.image}
                alt={`Men's handloom product ${index + 1}`}
                className="w-full h-40 md:h-52 lg:h-64 xl:h-72 object-contain hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              {/* Discount Badge */}
              <Badge className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 shadow-lg">
                {item.discount}
              </Badge>
            </div>
          ))}
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-28 lg:px-36 xl:px-44 text-center">
        <div className="max-w-6xl mx-auto bg-black/5 backdrop-blur-sm rounded-3xl p-8 md:p-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-background/90 backdrop-blur-sm rounded-full px-4 py-2 mb-6 shadow-soft">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Authentic Handloom & Handicrafts</span>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg">
            <span className="bg-gradient-hero bg-clip-text text-transparent leading-tight drop-shadow-lg">
              Threads of
            </span>
            <br />
            <span className="text-white drop-shadow-lg">Tradition</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
            Discover authentic handwoven textiles and handicrafts directly from skilled artisans. 
            Every purchase supports traditional craftsmanship and sustainable livelihoods.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="hero" size="xl" className="min-w-[200px]">
              Shop Collection
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="outline" size="xl" className="min-w-[200px] bg-background/90 backdrop-blur-sm">
              Bulk Orders
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-8 border-t border-white/20">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2 drop-shadow-md">500+</div>
              <div className="text-white/80 drop-shadow-sm">Artisan Partners</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary mb-2 drop-shadow-md">10K+</div>
              <div className="text-white/80 drop-shadow-sm">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2 drop-shadow-md">50+</div>
              <div className="text-white/80 drop-shadow-sm">Product Categories</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-primary rounded-full blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-secondary rounded-full blur-xl opacity-20 animate-pulse delay-1000"></div>
    </section>
  );
};

export default HeroSection;