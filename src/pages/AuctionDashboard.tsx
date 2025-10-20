import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Gavel, TrendingUp, Clock, DollarSign, Package } from 'lucide-react';
import { MobileHeader, MobileNav } from '@/components/ui/mobile-nav';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const AuctionDashboard: React.FC = () => {
  const { user } = useAuth();
  const [auctions, setAuctions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchAuctions();
  }, []);

  async function fetchAuctions() {
    try {
      const { data, error } = await supabase
        .from('city_market_products')
        .select(`
          *,
          agent:agent_id (
            full_name
          )
        `)
        .eq('status', 'fresh')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setAuctions(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'Failed to load auctions',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }

  const handlePlaceBid = async (auctionId: string) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to place bids',
        variant: 'destructive'
      });
      return;
    }

    const amount = parseFloat(bidAmount[auctionId]);
    if (!amount || amount <= 0) {
      toast({
        title: 'Invalid Bid',
        description: 'Please enter a valid bid amount',
        variant: 'destructive'
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('city_market_bids')
        .insert({
          auction_id: auctionId,
          bidder_user_id: user.id,
          bid_amount: amount
        });

      if (error) throw error;

      toast({
        title: 'Bid Placed!',
        description: 'Your bid has been submitted successfully'
      });
      
      setBidAmount({ ...bidAmount, [auctionId]: '' });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'Failed to place bid',
        variant: 'destructive'
      });
    }
  }

  return (
    <div className="min-h-screen pb-20 lg:pb-0">
      <MobileHeader title="Auctions" />
      
      <main className="py-6 px-4 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2">
            <Gavel className="h-8 w-8 text-primary" />
            Live Auctions
          </h1>
          <p className="text-muted-foreground">Bid on fresh agricultural products</p>
          
          <Card className="mt-4 bg-amber-50 dark:bg-amber-950 border-amber-200">
            <CardContent className="pt-4">
              <h3 className="font-semibold mb-2">How Auctions Work</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Browse live auctions from verified sellers</li>
                <li>• Place bids on products you're interested in</li>
                <li>• Highest bid wins when auction closes</li>
                <li>• Arrange pickup at the specified market location</li>
                <li>• Complete payment as agreed with seller</li>
              </ul>
              <p className="text-xs mt-3 text-amber-700 dark:text-amber-400">
                <strong>Disclaimer:</strong> SokoConnect is a platform connecting buyers and sellers. We are not liable for product quality, delivery, or disputes. Always verify products before payment.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div className="col-span-full text-center py-12">Loading auctions...</div>
          ) : auctions.length > 0 ? (
            auctions.map(auction => (
              <Card key={auction.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="default" className="gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Live
                    </Badge>
                    <Badge variant="outline">
                      {auction.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{auction.name}</CardTitle>
                  <div className="text-sm text-muted-foreground">
                    By {auction.agent?.full_name || 'Verified Seller'}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <div className="text-muted-foreground">Quantity</div>
                        <div className="font-semibold flex items-center gap-1">
                          <Package className="h-3 w-3" />
                          {auction.quantity} {auction.unit}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Starting Price</div>
                        <div className="font-semibold flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          KES {auction.price_per_unit}/{auction.unit}
                        </div>
                      </div>
                    </div>

                    {auction.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {auction.description}
                      </p>
                    )}

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Posted {new Date(auction.created_at).toLocaleDateString()}
                    </div>

                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Bid amount"
                        value={bidAmount[auction.id] || ''}
                        onChange={e => setBidAmount({ ...bidAmount, [auction.id]: e.target.value })}
                        className="flex-1"
                      />
                      <Button onClick={() => handlePlaceBid(auction.id)} size="sm">
                        <Gavel className="h-4 w-4 mr-1" />
                        Bid
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Gavel className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No active auctions at the moment</p>
            </div>
          )}
        </div>
      </main>
      
      <MobileNav />
    </div>
  );
};

export default AuctionDashboard;