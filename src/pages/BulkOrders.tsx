import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  Package, 
  Calendar, 
  MapPin,
  TrendingDown,
  Plus,
  Search,
  AlertTriangle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface BulkOrder {
  id: string;
  buyer_id: string;
  produce_type: string;
  quantity: number;
  unit: string;
  target_price: number | null;
  deadline: string | null;
  description: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

const BulkOrders: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<BulkOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const [newOrder, setNewOrder] = useState({
    produce_type: '',
    quantity: '',
    unit: 'Kg',
    target_price: '',
    deadline: '',
    description: ''
  });

  useEffect(() => {
    fetchBulkOrders();
  }, []);

  const fetchBulkOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bulk_orders')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching bulk orders:', error);
      toast({
        title: 'Error',
        description: 'Failed to load bulk orders. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to create a bulk order',
        variant: 'destructive'
      });
      return;
    }

    if (!newOrder.produce_type || !newOrder.quantity) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    try {
      const { error } = await supabase.from('bulk_orders').insert({
        buyer_id: user.id,
        produce_type: newOrder.produce_type,
        quantity: parseFloat(newOrder.quantity),
        unit: newOrder.unit,
        target_price: newOrder.target_price ? parseFloat(newOrder.target_price) : null,
        deadline: newOrder.deadline || null,
        description: newOrder.description || null,
        status: 'open'
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Bulk order created successfully!'
      });

      setIsCreateDialogOpen(false);
      setNewOrder({
        produce_type: '',
        quantity: '',
        unit: 'Kg',
        target_price: '',
        deadline: '',
        description: ''
      });
      fetchBulkOrders();
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: 'Error',
        description: 'Failed to create bulk order',
        variant: 'destructive'
      });
    }
  };

  const joinOrder = async (orderId: string) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to join a bulk order',
        variant: 'destructive'
      });
      return;
    }

    toast({
      title: 'Joining Order',
      description: 'You have successfully joined this bulk order!',
    });
  };

  const filteredOrders = orders.filter(order =>
    order.produce_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDaysRemaining = (deadline: string | null) => {
    if (!deadline) return null;
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  if (loading) {
    return (
      <div className="min-h-screen pb-20 md:pb-0">
        <Header />
        <main className="py-12 px-6 max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading bulk orders...</p>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-green-600 via-green-500 to-emerald-500 dark:from-green-900 dark:via-green-800 dark:to-emerald-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <Package className="h-16 w-16 mx-auto mb-4 text-white/90" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">Bulk Orders</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto drop-shadow-md opacity-95">
            Join group purchases to get better prices on agricultural products. 
            Organize with other buyers for maximum savings.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Disclaimer */}
        <Card className="mb-6 border-amber-200 bg-amber-50 dark:bg-amber-950/20">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>Disclaimer:</strong> AgriConnect facilitates connections between willing buyers and sellers. 
                All bulk orders are subject to seller confirmation. We do not guarantee transactions or 
                take responsibility for order fulfillment. Always verify seller credentials.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Search and Create */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search bulk orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 md:w-64"
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {filteredOrders.length} active bulk orders
            </span>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Bulk Order
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Create Bulk Order</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <Label htmlFor="produce_type">Product Type *</Label>
                    <Input
                      id="produce_type"
                      value={newOrder.produce_type}
                      onChange={e => setNewOrder({...newOrder, produce_type: e.target.value})}
                      placeholder="e.g., Maize, Beans, Fertilizer"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="quantity">Quantity *</Label>
                      <Input
                        id="quantity"
                        type="number"
                        value={newOrder.quantity}
                        onChange={e => setNewOrder({...newOrder, quantity: e.target.value})}
                        placeholder="e.g., 1000"
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
                          <SelectItem value="Tonnes">Tonnes</SelectItem>
                          <SelectItem value="Crates">Crates</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="target_price">Target Price (KES per unit)</Label>
                      <Input
                        id="target_price"
                        type="number"
                        value={newOrder.target_price}
                        onChange={e => setNewOrder({...newOrder, target_price: e.target.value})}
                        placeholder="e.g., 50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="deadline">Deadline</Label>
                      <Input
                        id="deadline"
                        type="date"
                        value={newOrder.deadline}
                        onChange={e => setNewOrder({...newOrder, deadline: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newOrder.description}
                      onChange={e => setNewOrder({...newOrder, description: e.target.value})}
                      placeholder="Add details about your bulk order..."
                      rows={3}
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

        {/* Benefits Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="p-3 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <TrendingDown className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Save Up to 30%</h3>
              <p className="text-muted-foreground">Get wholesale prices through group buying power</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="p-3 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Community Driven</h3>
              <p className="text-muted-foreground">Connect with farmers in your area</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="p-3 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Package className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Quality Assured</h3>
              <p className="text-muted-foreground">Verified suppliers and products</p>
            </CardContent>
          </Card>
        </div>

        {/* Bulk Orders List */}
        <div className="grid lg:grid-cols-2 gap-6">
          {filteredOrders.map((order) => {
            const daysRemaining = getDaysRemaining(order.deadline);
            
            return (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl mb-2">{order.produce_type}</CardTitle>
                    </div>
                    {daysRemaining !== null && (
                      <Badge variant={daysRemaining > 7 ? "default" : "destructive"}>
                        {daysRemaining} days left
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.description && (
                      <p className="text-muted-foreground">{order.description}</p>
                    )}
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Quantity Needed</div>
                        <div className="font-medium">{order.quantity} {order.unit}</div>
                      </div>
                      {order.target_price && (
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Target Price</div>
                          <div className="font-medium">KES {order.target_price}/{order.unit}</div>
                        </div>
                      )}
                    </div>

                    {order.deadline && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Deadline: {new Date(order.deadline).toLocaleDateString()}</span>
                      </div>
                    )}

                    <div className="pt-4 border-t flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                      >
                        View Details
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => joinOrder(order.id)}
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Join Order
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredOrders.length === 0 && !loading && (
          <Card className="text-center py-12">
            <CardContent>
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No bulk orders found</h3>
              <p className="text-muted-foreground mb-4">
                Be the first to create a bulk order.
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Bulk Order
              </Button>
            </CardContent>
          </Card>
        )}

        {/* How It Works */}
        <section className="mt-16 bg-muted/30 rounded-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">How Bulk Orders Work</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple steps to save money through group purchasing
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="p-3 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Find or Create</h3>
              <p className="text-muted-foreground text-sm">Browse existing orders or create your own</p>
            </div>
            <div className="text-center">
              <div className="p-3 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Join & Commit</h3>
              <p className="text-muted-foreground text-sm">Commit to your quantity and payment</p>
            </div>
            <div className="text-center">
              <div className="p-3 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Reach Target</h3>
              <p className="text-muted-foreground text-sm">Wait for minimum participants to join</p>
            </div>
            <div className="text-center">
              <div className="p-3 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">4</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Get Delivery</h3>
              <p className="text-muted-foreground text-sm">Receive your order at wholesale prices</p>
            </div>
          </div>
        </section>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default BulkOrders;
