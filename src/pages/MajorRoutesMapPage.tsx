import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MapPin, Navigation, Phone, Star, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Major highway routes coordinates
const MAJOR_ROUTES = [
  {
    id: 'A1',
    name: 'A1 - Nairobi-Mombasa Highway',
    coordinates: [
      [-1.2921, 36.8219], // Nairobi
      [-1.5177, 37.2634], // Machakos
      [-2.2833, 37.9167], // Emali
      [-3.2167, 38.5667], // Mtito Andei
      [-3.9667, 38.5667], // Voi
      [-4.0333, 39.6667], // Mombasa
    ],
    color: '#FF5733'
  },
  {
    id: 'A2',
    name: 'A2 - Nairobi-Nakuru-Eldoret Highway',
    coordinates: [
      [-1.2921, 36.8219], // Nairobi
      [-0.9000, 36.6500], // Limuru
      [-0.3031, 36.0800], // Nakuru
      [0.5143, 35.2698], // Eldoret
    ],
    color: '#3357FF'
  },
  {
    id: 'A3',
    name: 'A3 - Nairobi-Kisumu Highway',
    coordinates: [
      [-1.2921, 36.8219], // Nairobi
      [-0.3031, 36.0800], // Nakuru
      [-0.0917, 35.2833], // Kericho
      [-0.0917, 34.7500], // Kisumu
    ],
    color: '#33FF57'
  },
  {
    id: 'A104',
    name: 'A104 - Thika Superhighway',
    coordinates: [
      [-1.2921, 36.8219], // Nairobi
      [-1.0332, 37.0690], // Thika
    ],
    color: '#FF33F5'
  },
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
}

const MapController: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

const MajorRoutesMapPage: React.FC = () => {
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
    },
    {
      id: '2',
      name: 'Nakuru Dairy Hub',
      route: 'A2',
      location: 'Nakuru Town',
      lat: -0.3031,
      lng: 36.0800,
      services: ['Dairy Products', 'Refrigerated Transport'],
      products: ['Milk', 'Yogurt'],
      rating: 4.7,
      phone: '+254 734 567 890',
      verified: true,
    },
    {
      id: '3',
      name: 'Thika Pineapple Vendors',
      route: 'A104',
      location: 'Thika Blue Post',
      lat: -1.0332,
      lng: 37.0690,
      services: ['Fresh Fruits', 'Wholesale'],
      products: ['Pineapples', 'Avocados'],
      rating: 4.3,
      phone: '+254 745 678 901',
      verified: false,
    },
  ]);
  
  const [selectedRoute, setSelectedRoute] = useState<string>('all');
  const [mapCenter, setMapCenter] = useState<[number, number]>([-1.2921, 36.8219]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredVendors = vendors.filter(v => 
    (selectedRoute === 'all' || v.route === selectedRoute) &&
    (searchTerm === '' || v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     v.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleVendorClick = (vendor: RouteVendor) => {
    setMapCenter([vendor.lat, vendor.lng]);
    toast({
      title: vendor.name,
      description: vendor.location,
    });
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Interactive Major Routes Map</h1>
          <p className="text-muted-foreground mb-6">
            Explore Kenya's major highways and find farmers, traders, and service providers along the routes.
            Click on markers to see details or use the filters below.
          </p>
          
          <Card className="mb-6 bg-blue-50 dark:bg-blue-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><strong>🗺️ Interactive Map:</strong> Click and drag to navigate, zoom in/out to explore</p>
              <p><strong>📍 Vendor Markers:</strong> Red markers show verified businesses along major routes</p>
              <p><strong>🛣️ Highway Lines:</strong> Colored lines represent different highway routes (A1, A2, A3, A104)</p>
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
              >
                All Routes
              </Button>
              {MAJOR_ROUTES.map(route => (
                <Button
                  key={route.id}
                  variant={selectedRoute === route.id ? 'default' : 'outline'}
                  onClick={() => setSelectedRoute(route.id)}
                >
                  {route.id}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="h-[600px] overflow-hidden">
              <MapContainer
                center={mapCenter}
                zoom={7}
                style={{ height: '100%', width: '100%' }}
              >
                <MapController center={mapCenter} />
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {/* Draw routes */}
                {MAJOR_ROUTES.map(route => (
                  (selectedRoute === 'all' || selectedRoute === route.id) && (
                    <Polyline
                      key={route.id}
                      positions={route.coordinates as [number, number][]}
                      pathOptions={{ color: route.color, weight: 4, opacity: 0.7 }}
                    />
                  )
                ))}
                
                {/* Vendor markers */}
                {filteredVendors.map(vendor => (
                  <Marker
                    key={vendor.id}
                    position={[vendor.lat, vendor.lng]}
                  >
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-bold mb-1">{vendor.name}</h3>
                        {vendor.verified && (
                          <Badge variant="secondary" className="mb-2 text-xs">Verified</Badge>
                        )}
                        <p className="text-sm mb-2 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {vendor.location}
                        </p>
                        <p className="text-sm mb-2">
                          <strong>Products:</strong> {vendor.products.join(', ')}
                        </p>
                        <p className="text-sm mb-2 flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                          {vendor.rating}
                        </p>
                        <Button size="sm" className="w-full" variant="outline">
                          <Phone className="h-3 w-3 mr-1" />
                          {vendor.phone}
                        </Button>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
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
                {filteredVendors.map(vendor => (
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
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {vendor.products.slice(0, 2).map(product => (
                        <Badge key={product} variant="outline" className="text-xs">
                          {product}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Button className="w-full">
              <MapPin className="h-4 w-4 mr-2" />
              Add My Business to Map
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MajorRoutesMapPage;
