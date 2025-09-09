import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Building2, Users, Gift, Calendar, Upload, CheckCircle, Clock, FileText } from "lucide-react";

const BulkOrders = () => {
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

      {/* Bulk Order Form */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-primary mb-4">Request a Quote</h2>
              <p className="text-muted-foreground">
                Fill out the form below and we'll get back to you within 24 hours
              </p>
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
    </div>
  );
};

export default BulkOrders;