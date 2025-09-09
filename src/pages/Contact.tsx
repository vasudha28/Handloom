import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from "lucide-react";

const Contact = () => {
  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Our Store",
      details: ["123 Handloom Street", "Craft District, New Delhi", "India - 110001"],
      action: "Get Directions"
    },
    {
      icon: Phone,
      title: "Call Us",
      details: ["+91 98765 43210", "+91 11 4567 8900", "Mon-Sat: 9 AM - 7 PM"],
      action: "Call Now"
    },
    {
      icon: Mail,
      title: "Email Us",
      details: ["info@handloomportal.com", "support@handloomportal.com", "Response within 24 hours"],
      action: "Send Email"
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: ["Monday - Friday: 9 AM - 7 PM", "Saturday: 10 AM - 6 PM", "Sunday: 11 AM - 4 PM"],
      action: "View Calendar"
    }
  ];

  const faqs = [
    {
      question: "How can I track my order?",
      answer: "You can track your order using the tracking ID sent to your email or by visiting our Order Tracking page."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 15-day return policy for all handloom products in original condition with tags attached."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes, we ship worldwide. International shipping rates and delivery times vary by location."
    },
    {
      question: "Are your products authentic?",
      answer: "Yes, all our products are 100% authentic handloom items with authenticity certificates from verified artisans."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="secondary">Get in Touch</Badge>
            <h1 className="text-5xl font-bold text-primary mb-6">Contact Us</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We're here to help you with any questions about our handloom products, 
              orders, or artisan stories. Reach out to us anytime!
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="pb-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <Card key={index} className="text-center hover:shadow-elegant transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <info.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-3">{info.title}</h3>
                  <div className="space-y-1 mb-4">
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-sm text-muted-foreground">{detail}</p>
                    ))}
                  </div>
                  <Button variant="outline" size="sm">
                    {info.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form and Map */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">First Name</label>
                    <Input placeholder="Enter your first name" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Last Name</label>
                    <Input placeholder="Enter your last name" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email</label>
                  <Input type="email" placeholder="Enter your email address" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Phone Number</label>
                  <Input type="tel" placeholder="Enter your phone number" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Subject</label>
                  <Input placeholder="What is this regarding?" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Message</label>
                  <Textarea 
                    placeholder="Tell us how we can help you..."
                    rows={5}
                  />
                </div>
                <Button className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
                <p className="text-sm text-muted-foreground text-center">
                  We'll get back to you within 24 hours
                </p>
              </CardContent>
            </Card>

            {/* Map and Additional Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Visit Our Showroom</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted rounded-lg h-64 flex items-center justify-center mb-4">
                    <p className="text-muted-foreground">Interactive Map Coming Soon</p>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Experience our handloom collection in person at our flagship store. 
                    Our knowledgeable staff can help you find the perfect pieces and 
                    share the stories behind each creation.
                  </p>
                  <Button variant="outline" className="w-full">
                    Schedule a Visit
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">24/7 Phone Support</p>
                        <p className="text-sm text-muted-foreground">
                          Call us anytime for urgent order-related queries
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MessageCircle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Live Chat</p>
                        <p className="text-sm text-muted-foreground">
                          Chat with our support team during business hours
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Email Support</p>
                        <p className="text-sm text-muted-foreground">
                          Detailed responses within 24 hours
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Quick answers to common questions about our products and services
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button variant="outline">
                View All FAQs
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;