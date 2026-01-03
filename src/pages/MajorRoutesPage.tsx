import React, { useState, useEffect, lazy, Suspense } from 'react';
import Header from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Navigation, Phone, Star, Info, Plus, Route, Store, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

// Lazy load the map component
const RoadMarketsMap = lazy(() => import('@/components/maps/RoadMarketsMap'));

// Major highway routes coordinates
const MAJOR_ROUTES = [
  {
    id: 'A1',
    name: 'A1 - Namanga to Lokichogio',
    coordinates: [
      [-1.2921, 36.8219], // Nairobi
      [-1.5177, 37.2634], // Machakos
      [-2.2833, 37.9167], // Emali
      [-3.2167, 38.5667], // Mtito Andei
      [-3.9667, 38.5667], // Voi
      [-4.0333, 39.6667], // Mombasa
    ],
    color: '#FF5733',
    description: 'Main north-south route from Tanzania border to South Sudan'
  },
  {
    id: 'A2',
    name: 'A2 - Nairobi to Moyale',
    coordinates: [
      [-1.2921, 36.8219], // Nairobi
      [-0.0200, 37.0700], // Thika
      [0.3496, 37.5820], // Isiolo
      [3.5167, 39.0667], // Moyale
    ],
    color: '#3357FF',
    description: 'Eastern route connecting Nairobi to Ethiopia border'
  },
  {
    id: 'A3',
    name: 'A3 - Thika to Garissa',
    coordinates: [
      [-1.0332, 37.0690], // Thika
      [-0.4536, 39.6401], // Garissa
    ],
    color: '#33FF57',
    description: 'Route to North Eastern Kenya'
  },
  {
    id: 'A104',
    name: 'A104 - Nairobi-Nakuru-Eldoret',
    coordinates: [
      [-1.2921, 36.8219], // Nairobi
      [-0.9000, 36.6500], // Limuru
      [-0.3031, 36.0800], // Nakuru
      [0.5143, 35.2698], // Eldoret
    ],
    color: '#FF33F5',
    description: 'Major western corridor'
  },
  {
    id: 'B3',
    name: 'B3 - Kisumu to Busia',
    coordinates: [
      [-0.0917, 34.7500], // Kisumu
      [0.4638, 34.1167], // Busia
    ],
    color: '#F5A623',
    description: 'Lake Victoria region route'
  }
];

interface RouteVendor {
  id: string;
  name: string;
  route: string;
  location: string;
  lat: number;
  lng: number;
  services: string[];
  products: string[];
  rating: number;
  phone: string;
  verified: boolean;
  description?: string;
}

const MapLoadingFallback = () => (
  <div className="h-[500px] bg-muted rounded-lg flex items-center justify-center">
    <div className="text-center">
      <Route className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
      <p className="text-muted-foreground">Loading map...</p>
    </div>
  </div>
);

const MajorRoutesPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [vendors, setVendors] = useState<RouteVendor[]>([
    {
      id: '1',
      name: 'Machakos Fresh Produce',
      route: 'A1',
      location: 'Machakos Junction',
      lat: -1.5177,
      lng: 37.2634,
      services: ['Fresh Produce', 'Cold Storage'],
      products: ['Tomatoes', 'Onions'],
      rating: 4.5,
      phone: '+254 712 345 678',
      verified: true,
      description: 'Quality fresh produce from local farmers'
    },
    {
      id: '2',
      name: 'Nakuru Dairy Hub',
      route: 'A104',
      location: 'Nakuru Town',
      lat: -0.3031,
      lng: 36.0800,
      services: ['Dairy Products', 'Refrigerated Transport'],
      products: ['Milk', 'Yogurt', 'Butter'],
      rating: 4.7,
      phone: '+254 734 567 890',
      verified: true,
      description: 'Fresh dairy from Nakuru farms'
    },
    {
      id: '3',
      name: 'Thika Pineapple Vendors',
      route: 'A2',
      location: 'Thika Blue Post',
      lat: -1.0332,
      lng: 37.0690,
      services: ['Fresh Fruits', 'Wholesale'],
      products: ['Pineapples', 'Avocados', 'Bananas'],
      rating: 4.3,
      phone: '+254 745 678 901',
      verified: false,
      description: 'Famous Thika pineapples'
    },
    {
      id: '4',
      name: 'Isiolo Livestock Market',
      route: 'A2',
      location: 'Isiolo Town',
      lat: 0.3496,
      lng: 37.5820,
      services: ['Livestock', 'Veterinary'],
      products: ['Cattle', 'Goats', 'Camels'],
      rating: 4.0,
      phone: '+254 756 789 012',
      verified: true,
      description: 'Major livestock trading hub'
    }
  ]);
  
  const [selectedRoute, setSelectedRoute] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newVendor, setNewVendor] = useState({
    name: '',
    route: '',
    location: '',
    products: '',
    services: '',
    phone: '',
    description: ''
  });

  const filteredVendors = vendors.filter(v => 
    (selectedRoute === 'all' || v.route === selectedRoute) &&
    (searchTerm === '' || 
     v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     v.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
     v.products.some(p => p.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const handleAddVendor = () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to add your business',
        variant: 'destructive'
      });
      return;
    }

    if (!newVendor.name || !newVendor.route || !newVendor.location) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    const vendor: RouteVendor = {
      id: Date.now().toString(),
      name: newVendor.name,
      route: newVendor.route,
      location: newVendor.location,
      lat: -1.2921 + Math.random() * 0.5,
      lng: 36.8219 + Math.random() * 0.5,
      services: newVendor.services.split(',').map(s => s.trim()).filter(Boolean),
      products: newVendor.products.split(',').map(p => p.trim()).filter(Boolean),
      rating: 0,
      phone: newVendor.phone,
      verified: false,
      description: newVendor.description
    };

    setVendors([...vendors, vendor]);
    setIsAddDialogOpen(false);
    setNewVendor({ name: '', route: '', location: '', products: '', services: '', phone: '', description: '' });

    toast({
      title: 'Success',
      description: 'Your business has been added! It will appear after verification.'
    });
  };

  const handleVendorClick = (vendor: RouteVendor) => {
    toast({
      title: vendor.name,
      description: `${vendor.location} - Call ${vendor.phone}`,
    });
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Header />
      
      <main className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Route className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Kenya Major Routes Marketplace</h1>
          </div>
          <p className="text-muted-foreground mb-6">
            Explore Kenya's major highways and find farmers, traders, and service providers along the routes.
            Click on markers to see details or use the filters below.
          </p>

          {/* Disclaimer */}
          <Card className="mb-6 border-amber-200 bg-amber-50 dark:bg-amber-950/20">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  <strong>Disclaimer:</strong> All listings are user-submitted. AgriConnect does not verify 
                  the accuracy of business information or guarantee transactions. Always verify credentials 
                  before engaging with vendors.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-6 bg-blue-50 dark:bg-blue-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><strong>🗺️ Interactive Map:</strong> Click and drag to navigate, zoom in/out to explore</p>
              <p><strong>📍 Vendor Markers:</strong> Red markers show verified businesses along major routes</p>
              <p><strong>🛣️ Highway Lines:</strong> Colored lines represent different highway routes (A1, A2, A3, A104, B3)</p>
              <p><strong>📞 Contact Directly:</strong> Click markers to see contact information and services offered</p>
              <p><strong>➕ Add Your Location:</strong> Businesses can register to appear on the map</p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <Input
              placeholder="Search vendors or locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedRoute === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedRoute('all')}
                size="sm"
              >
                All Routes
              </Button>
              {MAJOR_ROUTES.map(route => (
                <Button
                  key={route.id}
                  variant={selectedRoute === route.id ? 'default' : 'outline'}
                  onClick={() => setSelectedRoute(route.id)}
                  size="sm"
                >
                  {route.id}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="h-[500px] overflow-hidden">
              <Suspense fallback={<MapLoadingFallback />}>
                <RoadMarketsMap 
                  vendors={filteredVendors} 
                  routes={selectedRoute === 'all' ? MAJOR_ROUTES : MAJOR_ROUTES.filter(r => r.id === selectedRoute)}
                  onVendorClick={handleVendorClick}
                />
              </Suspense>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Route Legend</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {MAJOR_ROUTES.map(route => (
                  <div key={route.id} className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: route.color }}
                    />
                    <span className="text-sm">{route.name}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Nearby Vendors ({filteredVendors.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-[400px] overflow-y-auto">
                {filteredVendors.length === 0 ? (
                  <div className="text-center py-6">
                    <Store className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">No vendors found</p>
                  </div>
                ) : (
                  filteredVendors.map(vendor => (
                    <div
                      key={vendor.id}
                      className="p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => handleVendorClick(vendor)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-sm">{vendor.name}</h3>
                        {vendor.verified && (
                          <Badge variant="secondary" className="text-xs">✓</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {vendor.location}
                      </p>
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                        <span className="text-xs">{vendor.rating}</span>
                        <Badge variant="outline" className="text-xs ml-2">
                          Route {vendor.route}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {vendor.products.slice(0, 2).map(product => (
                          <Badge key={product} variant="outline" className="text-xs">
                            {product}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add My Business to Map
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Register Your Business</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <Label htmlFor="name">Business Name *</Label>
                    <Input
                      id="name"
                      value={newVendor.name}
                      onChange={e => setNewVendor({...newVendor, name: e.target.value})}
                      placeholder="e.g., Fresh Produce Hub"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="route">Route *</Label>
                      <Select 
                        value={newVendor.route} 
                        onValueChange={value => setNewVendor({...newVendor, route: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select route" />
                        </SelectTrigger>
                        <SelectContent>
                          {MAJOR_ROUTES.map(route => (
                            <SelectItem key={route.id} value={route.id}>
                              {route.id} - {route.name.split(' - ')[1]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="location">Location *</Label>
                      <Input
                        id="location"
                        value={newVendor.location}
                        onChange={e => setNewVendor({...newVendor, location: e.target.value})}
                        placeholder="e.g., KM 45 Junction"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="products">Products (comma-separated)</Label>
                    <Input
                      id="products"
                      value={newVendor.products}
                      onChange={e => setNewVendor({...newVendor, products: e.target.value})}
                      placeholder="Tomatoes, Onions, Potatoes"
                    />
                  </div>
                  <div>
                    <Label htmlFor="services">Services (comma-separated)</Label>
                    <Input
                      id="services"
                      value={newVendor.services}
                      onChange={e => setNewVendor({...newVendor, services: e.target.value})}
                      placeholder="Fresh Produce, Cold Storage"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={newVendor.phone}
                      onChange={e => setNewVendor({...newVendor, phone: e.target.value})}
                      placeholder="+254 7XX XXX XXX"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newVendor.description}
                      onChange={e => setNewVendor({...newVendor, description: e.target.value})}
                      placeholder="Tell customers about your business..."
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddVendor}>
                    Submit for Verification
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default MajorRoutesPage;
