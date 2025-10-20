import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MapPin, 
  Clock, 
  Users, 
  Store,
  Search,
  Phone,
  Calendar,
  Truck,
  Star
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import marikitiBg from '@/assets/marikiti-market.jpg';

interface CityMarket {
  id: string;
  name: string;
  market_type: string;
  location: string;
  operating_hours: string;
  facilities: string[];
  contact_info: any;
  coordinates: any;
  status: string;
  created_at: string;
  updated_at: string;
}

const CityMarkets: React.FC = () => {
  const [markets, setMarkets] = useState<CityMarket[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMarkets();
  }, []);

  const fetchMarkets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('city_markets')
        .select('*')
        .eq('status', 'active')
        .order('name');

      if (error) throw error;
      setMarkets(data || []);
    } catch (error) {
      console.error('Error fetching markets:', error);
      toast({
        title: 'Error',
        description: 'Failed to load city markets. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredMarkets = markets.filter(market => {
    const matchesSearch = market.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         market.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || market.market_type === selectedType;
    const matchesLocation = selectedLocation === 'all' || market.location.includes(selectedLocation);
    
    return matchesSearch && matchesType && matchesLocation;
  });

  const marketTypes = Array.from(new Set(markets.map(m => m.market_type).filter(Boolean)));
  const locations = Array.from(new Set(markets.map(m => m.location.split(',')[0]).filter(Boolean)));

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="py-12 px-6 max-w-7xl mx-auto">
          <div className="text-center">
            <div className="text-lg">Loading city markets...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section with Market Background */}
      <section 
        className="relative py-24 text-white overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${marikitiBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">City Markets Directory</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto drop-shadow-md">
            Discover local markets across Kenya. Find the best places to buy and sell 
            agricultural products in your county.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search markets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Market Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {marketTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map(location => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="text-sm text-muted-foreground flex items-center">
              {filteredMarkets.length} markets found
            </div>
          </div>
        </div>

        {/* Markets Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMarkets.map((market) => (
            <Card key={market.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl mb-2">{market.name}</CardTitle>
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{market.location}</span>
                    </div>
                  </div>
                  <Badge variant="secondary">{market.market_type}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {market.operating_hours && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{market.operating_hours}</span>
                    </div>
                  )}
                  
                  {market.contact_info?.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{market.contact_info.phone}</span>
                    </div>
                  )}

                  {market.facilities && market.facilities.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Facilities</h4>
                      <div className="flex flex-wrap gap-1">
                        {market.facilities.slice(0, 3).map((facility, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {facility}
                          </Badge>
                        ))}
                        {market.facilities.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{market.facilities.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <MapPin className="h-4 w-4 mr-2" />
                      Get Directions
                    </Button>
                    <Button size="sm" className="flex-1">
                      <Store className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMarkets.length === 0 && !loading && (
          <Card className="text-center py-12">
            <CardContent>
              <Store className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No markets found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or check back later for new markets.
              </p>
              <Button 
                variant="outline"
                onClick={() => {
                  // TODO: Implement market suggestion functionality
                  alert('Market suggestion feature coming soon! Please contact us directly for now.');
                }}
              >
                Suggest a Market
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Info Section */}
        <section className="mt-16 bg-muted/30 rounded-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Market Information</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about trading in city markets
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="p-3 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Operating Hours</h3>
              <p className="text-muted-foreground text-sm">Most markets operate 6 AM - 6 PM daily</p>
            </div>
            <div className="text-center">
              <div className="p-3 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Transport Access</h3>
              <p className="text-muted-foreground text-sm">Good road access and parking facilities</p>
            </div>
            <div className="text-center">
              <div className="p-3 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Market Community</h3>
              <p className="text-muted-foreground text-sm">Connect with local traders and farmers</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CityMarkets;