import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ShoppingBag, Calendar, Package, Truck } from "lucide-react";
import Header from "@/components/Header";
import f2cHeroBg from "@/assets/f2c-hero-bg.png";

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  frequency: string;
  price: number;
  box_size: string;
}

interface UserSubscription {
  id: string;
  plan: SubscriptionPlan;
  status: string;
  next_delivery_date: string;
  delivery_address: string;
}

export default function F2CMarketplace() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [mySubscriptions, setMySubscriptions] = useState<UserSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();
    fetchMySubscriptions();
  }, []);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from("f2c_subscription_plans")
        .select("*")
        .order("price", { ascending: true });

      if (error) throw error;
      setPlans(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMySubscriptions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("f2c_subscriptions")
        .select(`
          *,
          plan:f2c_subscription_plans(*)
        `)
        .eq("consumer_id", user.id);

      if (error) throw error;
      setMySubscriptions(data || []);
    } catch (error: any) {
      console.error("Error fetching subscriptions:", error);
    }
  };

  const handleSubscribe = async () => {
    if (!selectedPlan || !deliveryAddress || !paymentMethod) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setSubscribing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to subscribe",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      const nextDeliveryDate = new Date();
      nextDeliveryDate.setDate(nextDeliveryDate.getDate() + 7);

      const { error } = await supabase
        .from("f2c_subscriptions")
        .insert({
          consumer_id: user.id,
          plan_id: selectedPlan.id,
          delivery_address: deliveryAddress,
          delivery_instructions: deliveryInstructions,
          payment_method: paymentMethod,
          next_delivery_date: nextDeliveryDate.toISOString(),
          status: "active",
        });

      if (error) throw error;

      toast({
        title: "Subscription Created",
        description: "Your farm-to-consumer subscription is now active!",
      });

      fetchMySubscriptions();
      setSelectedPlan(null);
      setDeliveryAddress("");
      setDeliveryInstructions("");
      setPaymentMethod("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSubscribing(false);
    }
  };

  const handleCancelSubscription = async (subscriptionId: string) => {
    try {
      const { error } = await supabase
        .from("f2c_subscriptions")
        .update({ status: "cancelled" })
        .eq("id", subscriptionId);

      if (error) throw error;

      toast({
        title: "Subscription Cancelled",
        description: "Your subscription has been cancelled",
      });

      fetchMySubscriptions();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading subscription plans...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative text-white py-16">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${f2cHeroBg})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/85 via-primary/70 to-primary/50" />
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 drop-shadow-lg">Farm-to-Consumer Marketplace</h1>
          <p className="text-white/90 max-w-2xl mx-auto drop-shadow">
            Subscribe to fresh, organic produce delivered directly from local farms to your doorstep
          </p>
        </div>
      </section>

      <div className="container mx-auto p-6 space-y-8">

      {mySubscriptions.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">My Subscriptions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mySubscriptions.map((subscription) => (
              <Card key={subscription.id}>
                <CardHeader>
                  <CardTitle>{subscription.plan.name}</CardTitle>
                  <CardDescription>
                    <Badge variant={subscription.status === "active" ? "default" : "secondary"}>
                      {subscription.status}
                    </Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    <span>Next Delivery: {new Date(subscription.next_delivery_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Truck className="h-4 w-4" />
                    <span>{subscription.delivery_address}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  {subscription.status === "active" && (
                    <Button
                      variant="destructive"
                      onClick={() => handleCancelSubscription(subscription.id)}
                      className="w-full"
                    >
                      Cancel Subscription
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Available Subscription Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card key={plan.id} className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  {plan.name}
                </CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Frequency</span>
                    <span className="font-medium">{plan.frequency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Box Size</span>
                    <span className="font-medium">{plan.box_size}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Price</span>
                    <span className="text-2xl font-bold text-primary">KES {plan.price.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full" onClick={() => setSelectedPlan(plan)}>
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Subscribe Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Subscribe to {plan.name}</DialogTitle>
                      <DialogDescription>
                        Complete your subscription details below
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="address">Delivery Address *</Label>
                        <Textarea
                          id="address"
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          placeholder="Enter your full delivery address"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instructions">Delivery Instructions (Optional)</Label>
                        <Textarea
                          id="instructions"
                          value={deliveryInstructions}
                          onChange={(e) => setDeliveryInstructions(e.target.value)}
                          placeholder="Any special instructions for delivery"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="payment">Payment Method *</Label>
                        <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mpesa">M-Pesa</SelectItem>
                            <SelectItem value="card">Credit/Debit Card</SelectItem>
                            <SelectItem value="cash">Cash on Delivery</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="bg-muted p-4 rounded-lg">
                        <p className="text-sm font-medium">Subscription Summary</p>
                        <div className="mt-2 space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Plan:</span>
                            <span className="font-medium">{plan.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Frequency:</span>
                            <span className="font-medium">{plan.frequency}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total:</span>
                            <span className="font-bold text-primary">KES {plan.price.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleSubscribe} disabled={subscribing}>
                        {subscribing ? "Processing..." : "Confirm Subscription"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}
