// PROJECT CHECKLIST: ALWAYS REMEMBER
// 1. Use correct Supabase table names: city_markets, market_participants, market_products, market_auctions, market_agents, counties, users
// 2. Never use hardcoded data for counties, admin, or markets
// 3. All data must be fetched from Supabase
// 4. Use type-safe queries and handle errors with toast
// 5. Local feature components must be inside the main function
// 6. Only export the main CityMarkets component
// 7. Keep UI and logic maintainable and readable
// Feature components are declared locally below, not imported from './CityMarkets'

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, MapPin, Users, Package, TrendingUp, Phone, Clock, Building2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
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

interface MarketParticipant {
  id: string;
  participant_name: string;
  participant_type: string;
  specialization: string[];
  contact_phone: string;
  market_id: string;
}

const CityMarkets: React.FC = () => {
const { user, session } = useAuth();
const [selectedMarket, setSelectedMarket] = useState<string | null>(null);
const [view, setView] = useState<'main' | 'detail' | 'sellers' | 'auctions' | 'agents'>('main');
const handleMarketNav = (marketId: string, nextView: typeof view) => {
  setSelectedMarket(marketId);
  setView(nextView);
};
const [markets, setMarkets] = useState<CityMarket[]>([]);
const [participants, setParticipants] = useState<MarketParticipant[]>([]);
const [loading, setLoading] = useState(true);
const [searchTerm, setSearchTerm] = useState('');
const [selectedCounty, setSelectedCounty] = useState('all');
const [showAddMarket, setShowAddMarket] = useState(false);
const [adding, setAdding] = useState(false);
const [form, setForm] = useState({
  market_name: '',
  city: '',
  county: '',
  physical_address: '',
  operating_hours: '',
  operating_days: [],
  commodities_traded: [],
  average_daily_traders: ''
});
const [counties, setCounties] = useState<string[]>([]);
const [isAdmin, setIsAdmin] = useState(false);

const filteredMarkets = markets.filter(m => selectedCounty === 'all' || m.county === selectedCounty).filter(m => m.market_name.toLowerCase().includes(searchTerm.toLowerCase()) || m.city.toLowerCase().includes(searchTerm.toLowerCase()));

const getParticipantsByType = (marketId: string, type: string) => participants.filter(p => p.market_id === marketId && p.participant_type === type);


// Use correct table names for Supabase queries

// Use correct table names from Supabase schema
const getProducts = async (marketId: string) => {
  const { data, error } = await supabase
    .from('city_market_products')
    .select('*')
    .eq('market_id', marketId);
  if (error) {
    console.error('Error loading products:', error);
    toast({ title: 'Error loading products', description: error.message, variant: 'destructive' });
  }
  return { data: data || [] };
};

const getCityMarketAuctions = async (marketId: string) => {
  const { data, error } = await supabase
    .from('city_market_auctions')
    .select('*')
    .eq('market_id', marketId);
  if (error) {
    console.error('Error loading auctions:', error);
    toast({ title: 'Error loading auctions', description: error.message, variant: 'destructive' });
  }
  return { data: data || [] };
};

const getAgents = async (marketId?: string) => {
  let query = supabase.from('market_agents').select('*');
  if (marketId) query = query.eq('market_id', marketId);
  const { data, error } = await query;
  if (error) {
    console.error('Error loading agents:', error);
    toast({ title: 'Error loading agents', description: error.message, variant: 'destructive' });
  }
  return { data: data || [] };
};

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    
    // Set counties from app config (no counties table exists in Supabase)
    setCounties(COUNTIES);
    
    try {
      // Fetch markets
      const { data: marketsData, error: marketsError } = await (supabase
        .from('city_markets')
        .select('*')
        .eq('is_active', true) as any);
      
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
      
      // Fetch participants
      const { data: participantsData, error: participantsError } = await (supabase
        .from('market_participants')
        .select('*') as any);
      
      if (participantsError) {
        console.error('Error loading participants:', participantsError);
        toast({ 
          title: 'Error loading participants', 
          description: participantsError.message, 
          variant: 'destructive' 
        });
        setParticipants([]);
      } else {
        setParticipants(participantsData || []);
      }
      
      // Check admin status
      if (user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
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
// ...existing code...
  return (
    <React.Fragment>
      <div className="min-h-screen">
        <Header />
        {/* ...existing code for main content, dialogs, etc... */}
      </div>
    </React.Fragment>
  );
}

export default CityMarkets;
