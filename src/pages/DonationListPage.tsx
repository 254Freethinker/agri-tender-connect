import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Package, Heart, Search } from 'lucide-react';
import { MobileHeader, MobileNav } from '@/components/ui/mobile-nav';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const DonationListPage: React.FC = () => {
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchDonations();
  }, []);

  async function fetchDonations() {
    try {
      const { data, error } = await supabase
        .from('food_rescue_listings')
        .select(`
          *,
          donor:donor_id (
            full_name
          )
        `)
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDonations(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'Failed to load donations',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }

  const filteredDonations = donations.filter(d =>
    d.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.pickup_location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-20 lg:pb-0">
      <MobileHeader title="Food Donations" />
      
      <main className="py-6 px-4 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Available Food Donations</h1>
          <p className="text-muted-foreground">Help reduce food waste by claiming surplus food</p>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search donations..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div className="col-span-full text-center py-12">Loading donations...</div>
          ) : filteredDonations.length > 0 ? (
            filteredDonations.map(donation => (
              <Card key={donation.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-lg">{donation.product_name}</span>
                    <Badge variant="secondary">
                      <Package className="mr-1 h-3 w-3" />
                      {donation.quantity} {donation.unit}
                    </Badge>
                  </CardTitle>
                  <div className="text-sm text-muted-foreground">
                    By {donation.donor?.full_name || 'Anonymous'}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-primary" />
                      {donation.pickup_location}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-primary" />
                      Expires: {new Date(donation.expiry_date).toLocaleDateString()}
                    </div>
                    {donation.description && (
                      <p className="text-sm text-muted-foreground">{donation.description}</p>
                    )}
                    <Button className="w-full" size="sm">
                      <Heart className="mr-2 h-4 w-4" />
                      Claim Donation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No donations available at the moment</p>
            </div>
          )}
        </div>
      </main>
      
      <MobileNav />
    </div>
  );
};

export default DonationListPage;