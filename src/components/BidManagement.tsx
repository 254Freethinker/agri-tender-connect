import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

interface Bid {
  id: string;
  auction_id: string;
  bidder_id: string;
  bid_amount: number;
  bid_time: string | null;
  is_winning_bid: boolean | null;
}

export const BidManagement: React.FC = () => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchBids();
  }, []);

  const fetchBids = async () => {
    try {
      const { data, error } = await supabase
        .from('auction_bids')
        .select('*')
        .eq('bidder_id', user?.id || '');

      if (error) throw error;
      setBids(data || []);
    } catch (error) {
      toast.error('Error fetching bids. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleBidAction = async (bidId: string, action: 'accept' | 'reject') => {
    try {
      const { error } = await supabase
        .from('auction_bids')
        .update({ is_winning_bid: action === 'accept' })
        .eq('id', bidId);

      if (error) throw error;

      toast.success(`Bid ${action}ed successfully`);
      fetchBids();
    } catch (error) {
      toast.error(`Error ${action}ing bid. Please try again later.`);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">Bid Management</h2>
      {loading ? (
        <div>Loading bids...</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {bids.map((bid) => (
            <Card key={bid.id} className="p-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Bid Amount: ${bid.bid_amount}</h3>
                <p>Bid Time: {bid.bid_time ? new Date(bid.bid_time).toLocaleString() : 'N/A'}</p>
                <p>Status: {bid.is_winning_bid ? 'winning' : 'pending'}</p>
                {!bid.is_winning_bid && (
                  <div className="flex gap-2 mt-2">
                    <Button
                      onClick={() => handleBidAction(bid.id, 'accept')}
                      variant="default"
                    >
                      Accept
                    </Button>
                    <Button
                      onClick={() => handleBidAction(bid.id, 'reject')}
                      variant="destructive"
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
