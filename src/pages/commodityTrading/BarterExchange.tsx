import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Users, MapPin, Calendar, ArrowRightLeft, Plus, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface BarterListing {
  id: string;
  title: string;
  offeredItem: string;
  offeredQuantity: string;
  requestedItem: string;
  requestedQuantity: string;
  location: string;
  farmerName: string;
  contact: string;
  postedDate: string;
  category: string;
  description?: string;
}

const BarterExchange: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [listings, setListings] = useState<BarterListing[]>([
    {
      id: '1',
      title: 'Trade Maize for Fertilizer',
      offeredItem: 'Maize',
      offeredQuantity: '10 bags (90kg each)',
      requestedItem: 'NPK Fertilizer',
      requestedQuantity: '5 bags (50kg each)',
      location: 'Nakuru County',
      farmerName: 'John Maina',
      contact: '+254 700 123456',
      postedDate: '2024-01-15',
      category: 'Grains',
      description: 'Quality maize from last harvest, looking for fertilizer for next planting season.'
    },
    {
      id: '2',
      title: 'Beans for Transport Services',
      offeredItem: 'Green Beans',
      offeredQuantity: '20 bags (50kg each)',
      requestedItem: 'Transport to Nairobi Market',
      requestedQuantity: 'One trip',
      location: 'Meru County',
      farmerName: 'Mary Wanjiku',
      contact: '+254 701 234567',
      postedDate: '2024-01-14',
      category: 'Legumes',
      description: 'Fresh beans ready for market, need transport to Wakulima Market.'
    },
    {
      id: '3',
      title: 'Equipment Exchange',
      offeredItem: 'Tractor Use',
      offeredQuantity: '2 days per month',
      requestedItem: 'Harvester Use',
      requestedQuantity: '1 day',
      location: 'Uasin Gishu County',
      farmerName: 'Peter Kiprotich',
      contact: '+254 702 345678',
      postedDate: '2024-01-13',
      category: 'Equipment'
    }
  ]);

  const [newListing, setNewListing] = useState({
    title: '',
    offeredItem: '',
    offeredQuantity: '',
    requestedItem: '',
    requestedQuantity: '',
    location: '',
    category: 'Grains',
    description: ''
  });

  const filteredListings = listings.filter(listing =>
    listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.offeredItem.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.requestedItem.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateListing = () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to create a barter listing',
        variant: 'destructive'
      });
      return;
    }

    if (!newListing.title || !newListing.offeredItem || !newListing.requestedItem) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    const listing: BarterListing = {
      id: Date.now().toString(),
      ...newListing,
      farmerName: 'You',
      contact: 'Your contact',
      postedDate: new Date().toISOString().split('T')[0]
    };

    setListings([listing, ...listings]);
    setIsCreateDialogOpen(false);
    setNewListing({
      title: '',
      offeredItem: '',
      offeredQuantity: '',
      requestedItem: '',
      requestedQuantity: '',
      location: '',
      category: 'Grains',
      description: ''
    });

    toast({
      title: 'Success',
      description: 'Your barter listing has been created!'
    });
  };

  const handleContactFarmer = (listing: BarterListing) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to contact farmers',
        variant: 'destructive'
      });
      return;
    }

    toast({
      title: 'Contacting Farmer',
      description: `Opening contact for ${listing.farmerName} at ${listing.contact}`
    });
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Header />
      
      <main className="py-8 px-4 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <ArrowRightLeft className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold">Barter Exchange</h1>
          </div>
          <p className="text-lg text-muted-foreground mb-6">
            Trade agricultural goods and services directly with other farmers without using money
          </p>

          {/* Disclaimer */}
          <Card className="mb-6 border-amber-200 bg-amber-50 dark:bg-amber-950/20">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  <strong>Disclaimer:</strong> AgriConnect facilitates connections between willing traders. 
                  All barter exchanges are agreements between parties. We do not guarantee the quality of 
                  goods/services or take responsibility for transactions. Always verify items before exchange.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search barter opportunities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Post Barter Offer
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Create Barter Listing</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={newListing.title}
                      onChange={e => setNewListing({...newListing, title: e.target.value})}
                      placeholder="e.g., Trade Maize for Fertilizer"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="offeredItem">What You're Offering *</Label>
                      <Input
                        id="offeredItem"
                        value={newListing.offeredItem}
                        onChange={e => setNewListing({...newListing, offeredItem: e.target.value})}
                        placeholder="e.g., Maize"
                      />
                    </div>
                    <div>
                      <Label htmlFor="offeredQuantity">Quantity</Label>
                      <Input
                        id="offeredQuantity"
                        value={newListing.offeredQuantity}
                        onChange={e => setNewListing({...newListing, offeredQuantity: e.target.value})}
                        placeholder="e.g., 10 bags"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="requestedItem">What You Want *</Label>
                      <Input
                        id="requestedItem"
                        value={newListing.requestedItem}
                        onChange={e => setNewListing({...newListing, requestedItem: e.target.value})}
                        placeholder="e.g., Fertilizer"
                      />
                    </div>
                    <div>
                      <Label htmlFor="requestedQuantity">Quantity</Label>
                      <Input
                        id="requestedQuantity"
                        value={newListing.requestedQuantity}
                        onChange={e => setNewListing({...newListing, requestedQuantity: e.target.value})}
                        placeholder="e.g., 5 bags"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select 
                        value={newListing.category} 
                        onValueChange={value => setNewListing({...newListing, category: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Grains">Grains</SelectItem>
                          <SelectItem value="Legumes">Legumes</SelectItem>
                          <SelectItem value="Vegetables">Vegetables</SelectItem>
                          <SelectItem value="Fruits">Fruits</SelectItem>
                          <SelectItem value="Equipment">Equipment</SelectItem>
                          <SelectItem value="Services">Services</SelectItem>
                          <SelectItem value="Livestock">Livestock</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="location">Location *</Label>
                      <Input
                        id="location"
                        value={newListing.location}
                        onChange={e => setNewListing({...newListing, location: e.target.value})}
                        placeholder="e.g., Nakuru County"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Description (optional)</Label>
                    <Textarea
                      id="description"
                      value={newListing.description}
                      onChange={e => setNewListing({...newListing, description: e.target.value})}
                      placeholder="Add more details about your offer..."
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateListing}>
                    Create Listing
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid gap-6">
          {filteredListings.length > 0 ? (
            filteredListings.map((listing) => (
              <Card key={listing.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl mb-2">{listing.title}</CardTitle>
                      <Badge variant="secondary">{listing.category}</Badge>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(listing.postedDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950/20">
                      <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Offering:</h4>
                      <p className="text-green-700 dark:text-green-300 font-medium">{listing.offeredItem}</p>
                      <p className="text-green-600 dark:text-green-400 text-sm">{listing.offeredQuantity}</p>
                    </div>
                    <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
                      <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Looking for:</h4>
                      <p className="text-blue-700 dark:text-blue-300 font-medium">{listing.requestedItem}</p>
                      <p className="text-blue-600 dark:text-blue-400 text-sm">{listing.requestedQuantity}</p>
                    </div>
                  </div>

                  {listing.description && (
                    <p className="text-muted-foreground text-sm mb-4">{listing.description}</p>
                  )}
                  
                  <div className="flex justify-between items-center pt-4 border-t">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{listing.farmerName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{listing.location}</span>
                      </div>
                    </div>
                    <Button onClick={() => handleContactFarmer(listing)}>
                      Contact Farmer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <ArrowRightLeft className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No barter opportunities found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search terms or be the first to post a barter offer!
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Post Your First Barter Offer
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default BarterExchange;
