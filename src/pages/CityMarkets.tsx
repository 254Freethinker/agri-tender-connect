import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Users, Package, TrendingUp, Clock, Building2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';
import { COUNTIES } from '@/config/app';

interface CityMarket {
  id: string;
  market_name: string;
  city: string;
  county: string;
  physical_address: string;
  operating_hours: string;
  operating_days: string[];
  commodities_traded: string[];
  average_daily_traders: number;
  is_active: boolean;
}

const CityMarkets: React.FC = () => {
  const { user } = useAuth();
  const [markets, setMarkets] = useState<CityMarket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCounty, setSelectedCounty] = useState('all');
  const [showAddMarket, setShowAddMarket] = useState(false);
  const [adding, setAdding] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const filteredMarkets = markets.filter(m => 
    (selectedCounty === 'all' || m.county === selectedCounty) &&
    (m.market_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     m.city.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // Fetch markets
        const { data: marketsData, error: marketsError } = await supabase
          .from('city_markets')
          .select('*')
          .eq('is_active', true);
        
        if (marketsError) {
          console.error('Error loading markets:', marketsError);
          toast({ 
            title: 'Error loading markets', 
            description: marketsError.message, 
            variant: 'destructive' 
          });
          setMarkets([]);
        } else {
          setMarkets(marketsData || []);
        }
        
        // Check admin status
        if (user) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .maybeSingle();
          
          if (profileError) {
            console.error('Error checking admin status:', profileError);
            setIsAdmin(false);
          } else {
            setIsAdmin(profileData?.role === 'admin');
          }
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        toast({ 
          title: 'Error', 
          description: 'An unexpected error occurred while loading data.', 
          variant: 'destructive' 
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">City Markets</h1>
            <p className="text-muted-foreground mt-2">Connect with local agricultural markets in your county</p>
          </div>
          {isAdmin && (
            <Button onClick={() => setShowAddMarket(true)}>
              Add New Market
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search markets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCounty} onValueChange={setSelectedCounty}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select county" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Counties</SelectItem>
              {COUNTIES.map((county) => (
                <SelectItem key={county} value={county}>
                  {county}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Markets Grid */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading markets...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMarkets.map((market) => (
              <Card key={market.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{market.market_name}</span>
                    <Badge variant={market.is_active ? "default" : "secondary"}>
                      {market.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{market.city}, {market.county}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{market.physical_address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{market.operating_hours}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{market.average_daily_traders} traders</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {market.commodities_traded?.slice(0, 3).map((commodity) => (
                        <Badge key={commodity} variant="outline" className="text-xs">
                          {commodity}
                        </Badge>
                      ))}
                      {market.commodities_traded?.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{market.commodities_traded.length - 3} more
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex-1"
                      >
                        <Package className="h-3 w-3 mr-1" />
                        Products
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex-1"
                      >
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Auctions
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add Market Dialog */}
        <Dialog open={showAddMarket} onOpenChange={setShowAddMarket}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Market</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Market Name</Label>
                <Input placeholder="Enter market name" />
              </div>
              <div>
                <Label>City</Label>
                <Input placeholder="Enter city" />
              </div>
              <div>
                <Label>County</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select county" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTIES.map((county) => (
                      <SelectItem key={county} value={county}>
                        {county}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddMarket(false)}>
                Cancel
              </Button>
              <Button disabled={adding}>
                {adding ? "Adding..." : "Add Market"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CityMarkets;