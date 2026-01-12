import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Calendar, MapPin, TrendingDown, Package, Plus, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface GroupOrder {
  id: string;
  input_type: string;
  description: string;
  coordinator_id: string;
  target_quantity: number;
  unit: string;
  target_price_per_unit: number | null;
  order_deadline: string;
  delivery_location: string | null;
  status: string;
  created_at: string;
  profiles?: {
    full_name: string;
  };
}

const GroupInputOrders = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<GroupOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"active" | "completed" | "all">("active");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const [newOrder, setNewOrder] = useState({
    input_type: '',
    description: '',
    target_quantity: '',
    unit: 'Kg',
    target_price_per_unit: '',
    order_deadline: '',
    delivery_location: ''
  });

  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      let query = supabase
        .from('group_input_orders')
        .select(`
          *,
          profiles:coordinator_id (
            full_name
          )
        `);

      if (activeTab === "active") {
        query = query.in('status', ['open', 'active']);
      } else if (activeTab === "completed") {
        query = query.eq('status', 'completed');
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching group orders:', error);
      toast({
        title: "Error",
        description: "Failed to load group orders. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOrder = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a group order",
        variant: "destructive",
      });
      return;
    }

    if (!newOrder.input_type || !newOrder.target_quantity || !newOrder.order_deadline) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from('group_input_orders').insert({
        coordinator_id: user.id,
        input_type: newOrder.input_type,
        description: newOrder.description,
        target_quantity: parseFloat(newOrder.target_quantity),
        unit: newOrder.unit,
        target_price_per_unit: newOrder.target_price_per_unit ? parseFloat(newOrder.target_price_per_unit) : null,
        order_deadline: newOrder.order_deadline,
        delivery_location: newOrder.delivery_location || null,
        status: 'open'
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Group input order created successfully!"
      });

      setIsCreateDialogOpen(false);
      setNewOrder({
        input_type: '',
        description: '',
        target_quantity: '',
        unit: 'Kg',
        target_price_per_unit: '',
        order_deadline: '',
        delivery_location: ''
      });
      fetchOrders();
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Error",
        description: "Failed to create group order",
        variant: "destructive",
      });
    }
  };

  const handleJoinOrder = async (orderId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to join a group order",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Joining Order",
      description: "Feature coming soon - you'll be able to specify your quantity commitment",
    });
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchTerm === "" || 
      order.input_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.delivery_location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  return (
    <div className="flex min-h-screen flex-col pb-20 md:pb-0">
      <Header />

      <main className="flex-1 container py-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Package className="h-8 w-8 text-primary" />
              Group Purchasing for Inputs
            </h1>
            <p className="text-muted-foreground mt-2">
              Save money by buying farm inputs in bulk with other farmers
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Express Need
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Create Group Input Order</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <Label htmlFor="input_type">Input Type *</Label>
                    <Input
                      id="input_type"
                      value={newOrder.input_type}
                      onChange={e => setNewOrder({...newOrder, input_type: e.target.value})}
                      placeholder="e.g., NPK Fertilizer, Seeds, Pesticides"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newOrder.description}
                      onChange={e => setNewOrder({...newOrder, description: e.target.value})}
                      placeholder="Describe what you're looking for..."
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="target_quantity">Target Quantity *</Label>
                      <Input
                        id="target_quantity"
                        type="number"
                        value={newOrder.target_quantity}
                        onChange={e => setNewOrder({...newOrder, target_quantity: e.target.value})}
                        placeholder="e.g., 100"
                      />
                    </div>
                    <div>
                      <Label htmlFor="unit">Unit</Label>
                      <Select 
                        value={newOrder.unit} 
                        onValueChange={value => setNewOrder({...newOrder, unit: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Kg">Kg</SelectItem>
                          <SelectItem value="Bags">Bags</SelectItem>
                          <SelectItem value="Litres">Litres</SelectItem>
                          <SelectItem value="Units">Units</SelectItem>
                          <SelectItem value="Tonnes">Tonnes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="target_price">Target Price per Unit (KES)</Label>
                      <Input
                        id="target_price"
                        type="number"
                        value={newOrder.target_price_per_unit}
                        onChange={e => setNewOrder({...newOrder, target_price_per_unit: e.target.value})}
                        placeholder="e.g., 3500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="order_deadline">Order Deadline *</Label>
                      <Input
                        id="order_deadline"
                        type="date"
                        value={newOrder.order_deadline}
                        onChange={e => setNewOrder({...newOrder, order_deadline: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="delivery_location">Delivery Location</Label>
                    <Input
                      id="delivery_location"
                      value={newOrder.delivery_location}
                      onChange={e => setNewOrder({...newOrder, delivery_location: e.target.value})}
                      placeholder="e.g., Nakuru County"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateOrder}>
                    Create Order
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Disclaimer */}
        <Card className="mb-6 border-amber-200 bg-amber-50 dark:bg-amber-950/20">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>Disclaimer:</strong> AgriConnect facilitates group purchasing connections between farmers. 
                All orders are subject to supplier availability and confirmation. We do not guarantee prices 
                or delivery. Always verify supplier credentials before making payments.
              </p>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="active" value={activeTab} onValueChange={(v) => setActiveTab(v as "active" | "completed" | "all")} className="mb-6">
          <TabsList>
            <TabsTrigger value="active">Active Orders</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="all">All Orders</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="mb-6">
          <Input
            placeholder="Search by input name, location, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-2/3 lg:w-1/2"
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <Card key={n} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-muted rounded w-full mb-2"></div>
                  <div className="h-4 bg-muted rounded w-5/6"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No group orders found</h3>
              <p className="text-muted-foreground mt-2 mb-4">
                {activeTab === "active" 
                  ? "No active group orders match your search. Start a new order to save on inputs!" 
                  : "No orders found. Check back later or view all orders."}
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Group Order
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map((order) => {
              const daysLeft = Math.ceil((new Date(order.order_deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
              
              return (
                <Card key={order.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-2">{order.input_type}</CardTitle>
                    <CardDescription className="truncate">
                      Organized by {order.profiles?.full_name || 'Farmer'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {order.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{order.description}</p>
                    )}
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Target Quantity</span>
                        <span className="font-medium">{order.target_quantity} {order.unit}</span>
                      </div>
                      {order.target_price_per_unit && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Target Price</span>
                          <span className="font-medium">KES {order.target_price_per_unit.toLocaleString()}/{order.unit}</span>
                        </div>
                      )}
                    </div>
                    
                    {order.delivery_location && (
                      <div className="flex items-center text-sm gap-1">
                        <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">{order.delivery_location}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center text-sm gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">Deadline: {new Date(order.order_deadline).toLocaleDateString()}</span>
                      {order.status !== 'completed' && daysLeft > 0 && (
                        <Badge variant={daysLeft > 7 ? "secondary" : "destructive"} className="ml-auto text-xs">
                          {daysLeft} days left
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between gap-2">
                    <Badge variant={order.status === 'open' || order.status === 'active' ? 'default' : 'secondary'}>
                      {order.status}
                    </Badge>
                    <Button 
                      size="sm" 
                      disabled={order.status === 'completed'}
                      onClick={() => handleJoinOrder(order.id)}
                    >
                      {order.status === 'completed' ? 'View Details' : 'Join Order'}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
};

export default GroupInputOrders;
