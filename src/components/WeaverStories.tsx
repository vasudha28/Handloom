import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, MapPin, Clock } from "lucide-react";
import weaverStory from "@/assets/weaver-story.jpg";

const WeaverStories = () => {
  const stories = [
    {
      id: 1,
      title: "Meera's Journey: Reviving Ancient Banarasi Techniques",
      excerpt: "Meet Meera Devi, a master weaver from Varanasi who has been preserving 300-year-old silk weaving traditions...",
      location: "Varanasi, Uttar Pradesh",
      readTime: "5 min read",
      image: weaverStory,
      category: "Master Craftsperson"
    },
    {
      id: 2,
      title: "The Ikat Revolution: Transforming Tribal Art",
      excerpt: "Discover how young artisans in Odisha are bringing contemporary designs to traditional Ikat weaving...",
      location: "Sambalpur, Odisha",
      readTime: "4 min read",
      image: weaverStory,
      category: "Innovation"
    },
    {
      id: 3,
      title: "Empowering Women Through Handloom Cooperatives",
      excerpt: "The inspiring story of how 200 women formed a cooperative to create sustainable livelihoods...",
      location: "Maheshwar, Madhya Pradesh",
      readTime: "6 min read",
      image: weaverStory,
      category: "Social Impact"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-muted/20 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-warm bg-clip-text text-transparent">Stories</span> Behind the Threads
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Every product has a story. Meet the skilled artisans who pour their heart and heritage 
            into every piece they create
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {stories.map((story) => (
            <Card key={story.id} className="overflow-hidden group hover:shadow-warm transition-smooth">
              <div className="relative">
                <img 
                  src={story.image} 
                  alt={story.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-smooth"
                />
                <Badge 
                  className="absolute top-3 left-3 bg-background/90 text-foreground"
                >
                  {story.category}
                </Badge>
              </div>

              <div className="p-6">
                <h3 className="font-semibold text-lg mb-3 group-hover:text-primary transition-smooth line-clamp-2">
                  {story.title}
                </h3>
                
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {story.excerpt}
                </p>

                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {story.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {story.readTime}
                  </div>
                </div>

                <Button 
                  variant="ghost" 
                  className="w-full justify-between group-hover:bg-primary/5 transition-smooth"
                >
                  Read Full Story
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-smooth" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="bg-gradient-primary rounded-2xl p-8 md:p-12 text-center text-white">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Want to Share Your Craft Story?
          </h3>
          <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
            Are you an artisan or know someone with an amazing handloom story? 
            We'd love to feature your journey and help share your craft with the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" size="lg" className="bg-white text-primary hover:bg-gray-50">
              Submit Your Story
            </Button>
            <Button variant="ghost" size="lg" className="text-white hover:bg-white/10">
              Join Our Artisan Network
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WeaverStories;