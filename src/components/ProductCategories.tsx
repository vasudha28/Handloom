import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const ProductCategories = () => {
  const categories = [
    {
      name: "Sarees & Dupattas",
      description: "Handwoven silk and cotton sarees with traditional motifs",
      color: "bg-gradient-warm",
      textColor: "text-white",
      count: "120+ Products"
    },
    {
      name: "Home Textiles",
      description: "Cushion covers, table runners, and decorative fabrics",
      color: "bg-gradient-cool",
      textColor: "text-white",
      count: "85+ Products"
    },
    {
      name: "Bags & Accessories",
      description: "Handcrafted bags, wallets, and fashion accessories",
      color: "bg-gradient-secondary",
      textColor: "text-white",
      count: "60+ Products"
    },
    {
      name: "Apparel",
      description: "Kurtas, scarves, and contemporary handloom clothing",
      color: "bg-gradient-primary",
      textColor: "text-white",
      count: "90+ Products"
    },
    {
      name: "Corporate Gifts",
      description: "Bulk orders for corporate gifting and events",
      color: "bg-card border border-border",
      textColor: "text-foreground",
      count: "Custom Orders"
    },
    {
      name: "Seasonal Collections",
      description: "Festival specials and limited edition pieces",
      color: "bg-muted",
      textColor: "text-foreground",
      count: "Limited Edition"
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-primary bg-clip-text text-transparent">Explore</span> Categories
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From traditional sarees to contemporary home decor, discover our curated collection 
            of authentic handloom products
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {categories.map((category, index) => (
            <Card 
              key={index} 
              className={`${category.color} p-6 hover:shadow-warm transform hover:scale-105 transition-bounce cursor-pointer group`}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className={`text-xl font-semibold mb-2 ${category.textColor}`}>
                      {category.name}
                    </h3>
                    <p className={`${category.textColor} opacity-90 text-sm mb-3`}>
                      {category.description}
                    </p>
                    <span className={`${category.textColor} text-xs opacity-75`}>
                      {category.count}
                    </span>
                  </div>
                </div>
                <div className="mt-auto">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`${category.textColor} hover:bg-white/20 group-hover:translate-x-1 transition-smooth p-0`}
                  >
                    View Products
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" size="lg">
            View All Categories
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductCategories;