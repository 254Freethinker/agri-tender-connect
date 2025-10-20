import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RefreshCcw, Package, MapPin, Calendar, Plus } from 'lucide-react';
import { MobileHeader, MobileNav } from '@/components/ui/mobile-nav';
import { useToast } from '@/hooks/use-toast';

const BarterTrade: React.FC = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  const mockOffers = [
    {
      id: '1',
      offering: 'Maize',
      quantity_offering: 500,
      unit_offering: 'Kg',
      seeking: 'Fertilizer',
      quantity_seeking: 50,
      unit_seeking: 'Kg',
      location: 'Nairobi',
      trader: 'John Doe',
      description: 'Quality maize for trade',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      offering: 'Beans',
      quantity_offering: 200,
      unit_offering: 'Kg',
      seeking: 'Seeds',
      quantity_seeking: 20,
      unit_seeking: 'Packets',
      location: 'Kiambu',
      trader: 'Mary Smith',
      description: 'Fresh beans ready for exchange',
      created_at: new Date().toISOString()
    }
  ];

  const handleCreateOffer = () => {
    toast({
      title: 'Success',
      description: 'Barter offer created successfully'
    });
    setIsCreateDialogOpen(false);
  };

  return (
    <div className="min-h-screen pb-20 lg:pb-0">
      <MobileHeader title="Barter Trade" />
      
      <main className="py-6 px-4 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2">
            <RefreshCcw className="h-8 w-8 text-primary" />
            Barter Trade Exchange
          </h1>
          <p className="text-muted-foreground">Trade agricultural products without money</p>
          
          <Card className="mt-4 bg-amber-50 dark:bg-amber-950 border-amber-200">
            <CardContent className="pt-4 space-y-2 text-sm">
              <p className="font-semibold">Important Guidelines:</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Verify product quality before exchanging</li>
                <li>• Meet in safe, public locations</li>
                <li>• Consider fair market values for both items</li>
                <li>• Document exchanges with receipts/photos</li>
              </ul>
              <p className="text-xs text-amber-700 dark:text-amber-400 pt-2">
                <strong>Disclaimer:</strong> SokoConnect facilitates connections only. We are not responsible for product quality, fairness of trades, or disputes. Trade at your own discretion.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Create Barter Offer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Barter Trade Offer</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="border-b pb-4">
                  <h3 className="font-semibold mb-3">What I'm Offering</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Product</Label>
                      <Input placeholder="e.g., Maize" />
                    </div>
                    <div>
                      <Label>Quantity</Label>
                      <Input type="number" placeholder="Amount" />
                    </div>
                  </div>
                </div>
                <div className="border-b pb-4">
                  <h3 className="font-semibold mb-3">What I'm Seeking</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Product</Label>
                      <Input placeholder="e.g., Fertilizer" />
                    </div>
                    <div>
                      <Label>Quantity</Label>
                      <Input type="number" placeholder="Amount" />
                    </div>
                  </div>
                </div>
                <div>
                  <Label>Location</Label>
                  <Input placeholder="Your location" />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea placeholder="Add details about your offer..." />
                </div>
                <Button onClick={handleCreateOffer} className="w-full">
                  Create Offer
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {mockOffers.map(offer => (
            <Card key={offer.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Trade Offer</span>
                  <Badge variant="secondary">Active</Badge>
                </CardTitle>
                <div className="text-sm text-muted-foreground">By {offer.trader}</div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Offering</div>
                      <div className="font-semibold flex items-center gap-1">
                        <Package className="h-4 w-4 text-green-600" />
                        {offer.offering}
                      </div>
                      <div className="text-sm">{offer.quantity_offering} {offer.unit_offering}</div>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Seeking</div>
                      <div className="font-semibold flex items-center gap-1">
                        <Package className="h-4 w-4 text-blue-600" />
                        {offer.seeking}
                      </div>
                      <div className="text-sm">{offer.quantity_seeking} {offer.unit_seeking}</div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">{offer.description}</p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {offer.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(offer.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  <Button className="w-full">
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Propose Trade
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      
      <MobileNav />
    </div>
  );
};

export default BarterTrade;