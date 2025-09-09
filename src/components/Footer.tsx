import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  Heart 
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4">
        {/* Newsletter Section */}
        <div className="py-12 border-b border-border">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Stay Connected with <span className="bg-gradient-primary bg-clip-text text-transparent">HandloomPortal</span>
            </h3>
            <p className="text-muted-foreground mb-6">
              Get exclusive access to new collections, artisan stories, and special offers
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1"
              />
              <Button variant="hero" className="sm:w-auto">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-primary rounded-full"></div>
                <span className="text-xl font-bold">HandloomPortal</span>
              </div>
              <p className="text-muted-foreground mb-4 text-sm">
                Connecting authentic handloom artisans with conscious consumers worldwide. 
                Every purchase supports traditional craftsmanship and sustainable livelihoods.
              </p>
              <div className="flex space-x-3">
                <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                  <Facebook className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                  <Instagram className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                  <Youtube className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Quick Links</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-smooth">About Us</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-smooth">Our Artisans</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-smooth">Product Categories</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-smooth">Bulk Orders</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-smooth">Sustainability</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-smooth">Blog & Stories</a></li>
              </ul>
            </div>

            {/* Customer Support */}
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Customer Care</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-smooth">FAQ</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-smooth">Shipping Info</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-smooth">Return Policy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-smooth">Size Guide</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-smooth">Track Order</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-smooth">Contact Support</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Get in Touch</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-primary mt-0.5" />
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="text-foreground">hello@handloomportal.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-primary mt-0.5" />
                  <div>
                    <p className="text-muted-foreground">Phone</p>
                    <p className="text-foreground">+91 98765 43210</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-primary mt-0.5" />
                  <div>
                    <p className="text-muted-foreground">Address</p>
                    <p className="text-foreground">Mumbai, Maharashtra, India</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Bottom Footer */}
        <div className="py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>© 2024 HandloomPortal. All rights reserved.</span>
              <span>•</span>
              <a href="#" className="hover:text-primary transition-smooth">Privacy Policy</a>
              <span>•</span>
              <a href="#" className="hover:text-primary transition-smooth">Terms of Service</a>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>for artisans worldwide</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;