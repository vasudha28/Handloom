import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Building2, Users, Gift, Calendar, Upload, CheckCircle, Clock, FileText, AlertCircle, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FloatingAuthModal from "@/components/auth/FloatingAuthModal";

const BulkOrders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'signin' | 'signup'>('signin');
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [showB2BPopup, setShowB2BPopup] = useState(false);

  // Show B2B popup when page loads if user is not B2B
  useEffect(() => {
    if (user && user.role !== 'b2b_buyer') {
      setShowB2BPopup(true);
    }
  }, [user]);

  // Handle successful authentication - redirect to quote form if B2B
  useEffect(() => {
    if (user && user.role === 'b2b_buyer' && authModalOpen) {
      setAuthModalOpen(false);
      setShowQuoteForm(true);
    }
  }, [user, authModalOpen]);

  const handleRequestQuote = () => {
    if (!user) {
      // User not logged in, show sign up modal (since they need B2B account)
      setAuthModalTab('signup');
      setAuthModalOpen(true);
    } else if (user.role !== 'b2b_buyer') {
      // User logged in but not B2B, show B2B popup again
      setAuthModalOpen(false); // Close any open auth modal
      setShowB2BPopup(true);
    } else {
      // User is B2B buyer, show quote form
      setShowQuoteForm(true);
    }
  };

  const handleAuthClick = (tab: 'signin' | 'signup') => {
    // Close B2B popup and show auth modal
    setShowB2BPopup(false);
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };
  const orderTypes = [
    {
      icon: Building2,
      title: "Corporate Gifting",
      description: "Premium handloom gifts for employees, clients, and partners",
      minOrder: "50+ pieces",
      customization: "Logo embroidery, custom packaging"
    },
    {
      icon: Users,
      title: "Educational Institutions",
      description: "Bulk orders for schools, colleges, and universities",
      minOrder: "100+ pieces",
      customization: "Institution branding, volume discounts"
    },
    {
      icon: Gift,
      title: "Event & Wedding Orders",
      description: "Custom handloom items for special occasions",
      minOrder: "25+ pieces",
      customization: "Personalized designs, gift wrapping"
    }
  ];

  const benefits = [
    "Volume discounts up to 30%",
    "Free customization and branding",
    "Dedicated account manager",
    "Priority production and shipping",
    "Flexible payment terms",
    "Quality assurance guarantee"
  ];

  const process = [
    {
      step: 1,
      title: "Submit Requirements",
      description: "Fill out our bulk order form with your specific needs"
    },
    {
      step: 2,
      title: "Quotation & Samples",
      description: "Receive detailed quote and product samples within 48 hours"
    },
    {
      step: 3,
      title: "Customization & Approval",
      description: "Review designs, approve customizations and place order"
    },
    {
      step: 4,
      title: "Production & Delivery",
      description: "Track production progress and receive your order on time"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="secondary">B2B Solutions</Badge>
            <h1 className="text-5xl font-bold text-primary mb-6">Bulk Orders & Corporate Gifting</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Partner with us for premium handloom products in bulk quantities. 
              Perfect for corporate gifts, institutional orders, and special events.
            </p>
          </div>
        </div>
      </section>

      {/* Order Types */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {orderTypes.map((type, index) => (
              <Card key={index} className="text-center hover:shadow-elegant transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <type.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{type.title}</h3>
                  <p className="text-muted-foreground mb-4">{type.description}</p>
                  <div className="space-y-2">
                    <Badge variant="outline">{type.minOrder}</Badge>
                    <p className="text-sm text-muted-foreground">{type.customization}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary mb-4">Why Choose Our Bulk Orders?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Enjoy exclusive benefits designed for our business partners
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">Our Simple Process</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From inquiry to delivery, we make bulk ordering easy and transparent
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Request Quote Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-primary mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Request a personalized quote for your bulk order requirements
            </p>
            <Button 
              size="lg" 
              className="bg-gradient-primary hover:opacity-90"
              onClick={handleRequestQuote}
            >
              <FileText className="h-5 w-5 mr-2" />
              Request a Quote
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              Our B2B team will review your requirements and send you a detailed quotation within 24 hours
            </p>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-gradient-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Place Your Bulk Order?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Get in touch with our B2B team for personalized assistance and competitive pricing
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg">
              <Clock className="h-4 w-4 mr-2" />
              Schedule a Call
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
              Download Catalog
            </Button>
          </div>
        </div>
      </section>

      {/* B2B Sign-up Popup */}
      {showB2BPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg max-w-2xl w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-primary">B2B Account Required</h2>
                    <p className="text-muted-foreground">To place bulk orders, you need a B2B account</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowB2BPopup(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold mb-2">B2B Account Benefits:</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Volume discounts up to 30%</li>
                  <li>• Dedicated account manager</li>
                  <li>• Priority production and shipping</li>
                  <li>• Flexible payment terms</li>
                  <li>• Custom branding and packaging</li>
                  <li>• Access to exclusive B2B products</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={() => handleAuthClick('signup')}
                  className="flex-1"
                >
                  <Building2 className="w-4 h-4 mr-2" />
                  Sign up as B2B Buyer
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowB2BPopup(false)}
                >
                  Continue Browsing
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quote Form Modal */}
      {showQuoteForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-primary">Request a Quote</h2>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowQuoteForm(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Bulk Order Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Company Information */}
                  <div>
                    <h3 className="font-semibold mb-4">Company Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input placeholder="Company Name *" />
                      <Input placeholder="Contact Person *" />
                      <Input placeholder="Email Address *" />
                      <Input placeholder="Phone Number *" />
                      <Input placeholder="Industry/Sector" className="md:col-span-2" />
                    </div>
                  </div>

                  <Separator />

                  {/* Order Details */}
                  <div>
                    <h3 className="font-semibold mb-4">Order Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Order Type *" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="corporate">Corporate Gifting</SelectItem>
                          <SelectItem value="educational">Educational Institution</SelectItem>
                          <SelectItem value="event">Event/Wedding</SelectItem>
                          <SelectItem value="retail">Retail/Resale</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input placeholder="Expected Quantity *" />
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Product Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sarees">Sarees</SelectItem>
                          <SelectItem value="dupatta">Dupatta</SelectItem>
                          <SelectItem value="kurta">Kurta/Clothing</SelectItem>
                          <SelectItem value="home-decor">Home Decor</SelectItem>
                          <SelectItem value="accessories">Accessories</SelectItem>
                          <SelectItem value="mixed">Mixed Items</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Required by Date" type="date" />
                      </div>
                    </div>
                    <Textarea 
                      placeholder="Describe your specific requirements, preferred designs, colors, or any special customization needs..."
                      rows={4}
                    />
                  </div>

                  <Separator />

                  {/* Customization */}
                  <div>
                    <h3 className="font-semibold mb-4">Customization Requirements</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="logo" />
                        <label htmlFor="logo" className="text-sm">Logo/Branding Required</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="packaging" />
                        <label htmlFor="packaging" className="text-sm">Custom Packaging</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="samples" />
                        <label htmlFor="samples" className="text-sm">Request Samples</label>
                      </div>
                      <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Upload logo files, design references, or requirement documents
                        </p>
                        <Button variant="outline" size="sm">
                          Choose Files
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Budget and Additional Info */}
                  <div>
                    <h3 className="font-semibold mb-4">Budget & Additional Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Budget Range (per piece)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="500-1000">₹500 - ₹1,000</SelectItem>
                          <SelectItem value="1000-2500">₹1,000 - ₹2,500</SelectItem>
                          <SelectItem value="2500-5000">₹2,500 - ₹5,000</SelectItem>
                          <SelectItem value="5000+">₹5,000+</SelectItem>
                          <SelectItem value="flexible">Flexible</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Payment Terms Preference" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="advance">100% Advance</SelectItem>
                          <SelectItem value="partial">50% Advance, 50% on Delivery</SelectItem>
                          <SelectItem value="credit">30-day Credit Terms</SelectItem>
                          <SelectItem value="discuss">Discuss Later</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Textarea 
                      placeholder="Any additional information, special requests, or questions..."
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button className="flex-1">
                      Submit Request
                    </Button>
                    <Button variant="outline">
                      Save as Draft
                    </Button>
                  </div>

                  <p className="text-sm text-muted-foreground text-center">
                    Our team will review your requirements and send you a detailed quotation within 24 hours
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Authentication Modal */}
      <FloatingAuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authModalTab}
      />
    </div>
  );
};

export default BulkOrders;