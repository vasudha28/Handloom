import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Users, Globe, Award, Leaf, Shield } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Crafted with Love",
      description: "Every piece is handwoven with passion and dedication by skilled artisans"
    },
    {
      icon: Users,
      title: "Empowering Communities",
      description: "Supporting local weavers and preserving traditional craftsmanship"
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Bringing authentic Indian handloom products to customers worldwide"
    },
    {
      icon: Award,
      title: "Premium Quality",
      description: "Rigorous quality checks ensure only the finest products reach you"
    },
    {
      icon: Leaf,
      title: "Sustainable Practices",
      description: "Eco-friendly materials and processes that respect our planet"
    },
    {
      icon: Shield,
      title: "Authenticity Guaranteed",
      description: "100% genuine handloom products with authenticity certificates"
    }
  ];

  const stats = [
    { number: "500+", label: "Artisan Partners" },
    { number: "15+", label: "States Covered" },
    { number: "10,000+", label: "Happy Customers" },
    { number: "25+", label: "Years of Heritage" }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-10" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4" variant="secondary">Our Story</Badge>
            <h1 className="text-5xl font-bold text-primary mb-6">
              Preserving Heritage, Creating Future
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              For over two decades, we've been bridging the gap between traditional Indian 
              handloom artisans and modern consumers, creating a sustainable ecosystem that 
              celebrates craftsmanship while empowering communities.
            </p>
            <Button size="lg" className="bg-gradient-primary">
              Our Journey
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-4xl font-bold text-primary">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">Our Core Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do, from sourcing materials to 
              delivering the final product to your doorstep.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-elegant transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4" variant="secondary">Our Mission</Badge>
              <h2 className="text-4xl font-bold text-primary mb-6">
                Weaving Dreams, Building Lives
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Our mission is to create a thriving ecosystem where traditional Indian 
                handloom artisans can showcase their exceptional skills to a global audience, 
                while customers worldwide can access authentic, high-quality handcrafted products.
              </p>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                We believe in fair trade, sustainable practices, and the power of technology 
                to preserve and promote our rich cultural heritage for future generations.
              </p>
              <Button variant="outline" size="lg">
                Meet Our Artisans
              </Button>
            </div>
            <div className="relative">
              <img
                src="/placeholder.svg"
                alt="Handloom weaving process"
                className="rounded-lg shadow-elegant w-full"
              />
              <div className="absolute inset-0 bg-gradient-primary opacity-20 rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">Our Impact</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Beyond business, we're committed to creating positive social and 
              environmental impact in the communities we work with.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-8">
                <div className="text-3xl font-bold text-primary mb-2">₹2.5 Cr+</div>
                <p className="text-muted-foreground mb-4">Direct income to artisans</p>
                <p className="text-sm text-muted-foreground">
                  Fair wages ensuring sustainable livelihoods for weaving families
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-8">
                <div className="text-3xl font-bold text-primary mb-2">50+</div>
                <p className="text-muted-foreground mb-4">Villages impacted</p>
                <p className="text-sm text-muted-foreground">
                  Rural communities empowered through skill development programs
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-8">
                <div className="text-3xl font-bold text-primary mb-2">200+</div>
                <p className="text-muted-foreground mb-4">Young artisans trained</p>
                <p className="text-sm text-muted-foreground">
                  Next generation equipped with traditional and modern skills
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Join Our Mission</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Every purchase you make contributes to preserving traditional craftsmanship 
            and supporting artisan communities across India.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg">
              Shop Our Collection
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
              Partner With Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;