import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Package, Truck, MapPin, Clock, CheckCircle } from "lucide-react";

const OrderTracking = () => {
  const [trackingId, setTrackingId] = useState("");
  const [showTracking, setShowTracking] = useState(false);

  const handleTrack = () => {
    if (trackingId.trim()) {
      setShowTracking(true);
    }
  };

  const orderDetails = {
    orderId: "HM-2024-001234",
    status: "In Transit",
    estimatedDelivery: "March 15, 2024",
    items: [
      { name: "Handwoven Silk Saree", price: "₹3,500", qty: 1 },
      { name: "Cotton Block Print Dupatta", price: "₹850", qty: 2 }
    ],
    total: "₹5,200"
  };

  const trackingSteps = [
    { label: "Order Placed", status: "completed", date: "March 10, 2024", time: "2:30 PM" },
    { label: "Order Confirmed", status: "completed", date: "March 10, 2024", time: "3:15 PM" },
    { label: "Shipped", status: "completed", date: "March 11, 2024", time: "10:00 AM" },
    { label: "In Transit", status: "current", date: "March 13, 2024", time: "9:45 AM" },
    { label: "Out for Delivery", status: "pending", date: "", time: "" },
    { label: "Delivered", status: "pending", date: "", time: "" }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">Track Your Order</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Enter your order ID or tracking number to get real-time updates
          </p>
        </div>

        {/* Tracking Input */}
        <Card className="max-w-md mx-auto mb-8">
          <CardHeader>
            <CardTitle className="text-center">Enter Tracking Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Enter Order ID or Tracking Number"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
            />
            <Button onClick={handleTrack} className="w-full">
              Track Order
            </Button>
          </CardContent>
        </Card>

        {/* Order Tracking Results */}
        {showTracking && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Order #{orderDetails.orderId}</CardTitle>
                    <p className="text-muted-foreground">Estimated delivery: {orderDetails.estimatedDelivery}</p>
                  </div>
                  <Badge variant={orderDetails.status === "In Transit" ? "default" : "secondary"}>
                    {orderDetails.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {orderDetails.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Quantity: {item.qty}</p>
                      </div>
                      <p className="font-semibold">{item.price}</p>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between items-center font-bold">
                    <span>Total Amount</span>
                    <span className="text-primary">{orderDetails.total}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tracking Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {trackingSteps.map((step, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`
                          w-10 h-10 rounded-full flex items-center justify-center
                          ${step.status === 'completed' ? 'bg-primary text-primary-foreground' :
                            step.status === 'current' ? 'bg-secondary text-secondary-foreground border-2 border-primary' :
                            'bg-muted text-muted-foreground'}
                        `}>
                          {step.status === 'completed' ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : step.status === 'current' ? (
                            <Truck className="h-5 w-5" />
                          ) : (
                            <Clock className="h-5 w-5" />
                          )}
                        </div>
                        {index < trackingSteps.length - 1 && (
                          <div className={`w-0.5 h-12 mt-2 ${
                            step.status === 'completed' ? 'bg-primary' : 'bg-muted'
                          }`} />
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <h3 className={`font-semibold ${
                          step.status === 'current' ? 'text-primary' : ''
                        }`}>
                          {step.label}
                        </h3>
                        {step.date && (
                          <p className="text-sm text-muted-foreground">
                            {step.date} at {step.time}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Delivery Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Delivery Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-1">Delivery Address</h4>
                    <p className="text-muted-foreground">
                      123 Main Street, Apartment 4B<br />
                      New Delhi, Delhi 110001<br />
                      India
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Courier Partner</h4>
                    <p className="text-muted-foreground">Blue Dart Express</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Contact</h4>
                    <p className="text-muted-foreground">
                      Phone: +91 98765 43210<br />
                      Email: support@handloomportal.com
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Help Section */}
        <Card className="max-w-2xl mx-auto mt-8">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              If you're having trouble tracking your order or have any questions, 
              our customer support team is here to help.
            </p>
            <div className="flex gap-4">
              <Button variant="outline">Contact Support</Button>
              <Button variant="outline">FAQs</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderTracking;