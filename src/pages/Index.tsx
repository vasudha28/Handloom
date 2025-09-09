import HeroSection from "@/components/HeroSection";
import ProductCategories from "@/components/ProductCategories";
import FeaturedProducts from "@/components/FeaturedProducts";
import WeaverStories from "@/components/WeaverStories";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <ProductCategories />
      <FeaturedProducts />
      <WeaverStories />
    </div>
  );
};

export default Index;
