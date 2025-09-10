import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface FlaggedMarket {
  id: string;
  market_id: string;
  user_id: string;
  reason: string;
  created_at: string;
}

interface BanRecommendation {
  id: string;
  market_id: string;
  user_id: string;
  reason: string;
  created_at: string;
}

interface AdminDashboardProps {
  isAdmin: boolean;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ isAdmin }) => {
  const [flaggedMarkets, setFlaggedMarkets] = useState<FlaggedMarket[]>([]);
  const [banRecommendations, setBanRecommendations] = useState<BanRecommendation[]>([]);

  useEffect(() => {
    if (!isAdmin) return;
    
    const loadData = async () => {
      try {
        const [flaggedResponse, banResponse] = await Promise.all([
          supabase.from('flagged_markets').select('*'),
          supabase.from('ban_recommendations').select('*')
        ]);

        if (flaggedResponse.error) {
          toast({ title: 'Error loading flagged markets', description: flaggedResponse.error.message });
        } else {
          setFlaggedMarkets(flaggedResponse.data || []);
        }

        if (banResponse.error) {
          toast({ title: 'Error loading ban recommendations', description: banResponse.error.message });
        } else {
          setBanRecommendations(banResponse.data || []);
        }
      } catch (error) {
        console.error('Error loading admin data:', error);
      }
    };

    loadData();
  }, [isAdmin]);

  if (!isAdmin) return null;

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Flagged City Markets</CardTitle>
        </CardHeader>
        <CardContent>
          {flaggedMarkets.length === 0 ? (
            <div>No flagged markets.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th>Market ID</th>
                  <th>User ID</th>
                  <th>Reason</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {flaggedMarkets.map((flag) => (
                  <tr key={flag.id}>
                    <td>{flag.market_id}</td>
                    <td>{flag.user_id}</td>
                    <td>{flag.reason}</td>
                    <td>{new Date(flag.created_at).toLocaleString()}</td>
                    <td>
                      <Button size="sm" variant="outline">Resolve</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Ban Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          {banRecommendations.length === 0 ? (
            <div>No ban recommendations.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th>Market ID</th>
                  <th>User ID</th>
                  <th>Reason</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {banRecommendations.map((ban) => (
                  <tr key={ban.id}>
                    <td>{ban.market_id}</td>
                    <td>{ban.user_id}</td>
                    <td>{ban.reason}</td>
                    <td>{new Date(ban.created_at).toLocaleString()}</td>
                    <td>
                      <Button size="sm" variant="destructive">Ban</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;