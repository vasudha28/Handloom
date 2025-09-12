import HeroSection from "@/components/HeroSection";
import ProductCategories from "@/components/ProductCategories";
import ScrollingSarees from "@/components/ScrollingSarees";
import FeaturedProducts from "@/components/FeaturedProducts";
import WeaverStories from "@/components/WeaverStories";

const Index = () => {
  return (
    <div className="w-full">
      <HeroSection />
      <ProductCategories />
      <ScrollingSarees />
      <FeaturedProducts />
      <WeaverStories />
    </div>
  );
};

export default Index;
