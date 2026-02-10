
-- ============================================================
-- BATCH 1: Core Infrastructure, Bluetooth, Cooperatives, Events
-- ============================================================

-- 1. app_settings
CREATE TABLE public.app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public settings viewable by all" ON public.app_settings FOR SELECT USING (is_public = true);
CREATE POLICY "Admins manage settings" ON public.app_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 2. farms
CREATE TABLE public.farms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  farm_name TEXT NOT NULL,
  county TEXT NOT NULL,
  location TEXT,
  size_acres NUMERIC,
  farm_type TEXT,
  description TEXT,
  coordinates JSONB,
  images TEXT[],
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own farms" ON public.farms FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users create own farms" ON public.farms FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own farms" ON public.farms FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users delete own farms" ON public.farms FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 3. land_parcels
CREATE TABLE public.land_parcels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id UUID REFERENCES public.farms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  parcel_name TEXT NOT NULL,
  size_acres NUMERIC,
  soil_type TEXT,
  current_crop TEXT,
  status TEXT DEFAULT 'active',
  coordinates JSONB,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.land_parcels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own parcels" ON public.land_parcels FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 4. bluetooth_alerts
CREATE TABLE public.bluetooth_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  severity TEXT DEFAULT 'info',
  county TEXT,
  target_radius_km NUMERIC,
  sender_id UUID,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.bluetooth_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active alerts" ON public.bluetooth_alerts FOR SELECT USING (is_active = true);
CREATE POLICY "Authenticated users create alerts" ON public.bluetooth_alerts FOR INSERT TO authenticated WITH CHECK (auth.uid() = sender_id);

-- 5. bluetooth_devices
CREATE TABLE public.bluetooth_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  device_name TEXT,
  device_id TEXT NOT NULL,
  device_type TEXT,
  last_seen TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  capabilities JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.bluetooth_devices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own devices" ON public.bluetooth_devices FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 6. bluetooth_shared_prices
CREATE TABLE public.bluetooth_shared_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commodity TEXT NOT NULL,
  price NUMERIC NOT NULL,
  unit TEXT DEFAULT 'kg',
  market_name TEXT,
  county TEXT,
  shared_by UUID,
  verified_count INTEGER DEFAULT 0,
  shared_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);
ALTER TABLE public.bluetooth_shared_prices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view shared prices" ON public.bluetooth_shared_prices FOR SELECT USING (true);
CREATE POLICY "Authenticated users share prices" ON public.bluetooth_shared_prices FOR INSERT TO authenticated WITH CHECK (auth.uid() = shared_by);

-- 7. bluetooth_traders
CREATE TABLE public.bluetooth_traders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  trader_name TEXT NOT NULL,
  products TEXT[],
  location TEXT,
  county TEXT,
  is_available BOOLEAN DEFAULT true,
  rating NUMERIC,
  last_active TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.bluetooth_traders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view traders" ON public.bluetooth_traders FOR SELECT USING (true);
CREATE POLICY "Users manage own trader profile" ON public.bluetooth_traders FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 8. cooperative_groups
CREATE TABLE public.cooperative_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_name TEXT NOT NULL,
  description TEXT,
  county TEXT NOT NULL,
  location TEXT,
  leader_id UUID,
  member_count INTEGER DEFAULT 0,
  registration_number TEXT,
  group_type TEXT DEFAULT 'cooperative',
  is_verified BOOLEAN DEFAULT false,
  balance NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.cooperative_groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view cooperatives" ON public.cooperative_groups FOR SELECT USING (true);
CREATE POLICY "Leaders manage cooperatives" ON public.cooperative_groups FOR UPDATE TO authenticated USING (auth.uid() = leader_id);
CREATE POLICY "Authenticated users create cooperatives" ON public.cooperative_groups FOR INSERT TO authenticated WITH CHECK (auth.uid() = leader_id);

-- 9. group_members
CREATE TABLE public.group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES public.cooperative_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'active',
  shares INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members view own group" ON public.group_members FOR SELECT TO authenticated USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.group_members gm WHERE gm.group_id = group_members.group_id AND gm.user_id = auth.uid()));
CREATE POLICY "Users join groups" ON public.group_members FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users manage own membership" ON public.group_members FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- 10. cooperative_activities
CREATE TABLE public.cooperative_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES public.cooperative_groups(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  scheduled_date TIMESTAMPTZ,
  status TEXT DEFAULT 'planned',
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.cooperative_activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Group members view activities" ON public.cooperative_activities FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.group_members gm WHERE gm.group_id = cooperative_activities.group_id AND gm.user_id = auth.uid()));
CREATE POLICY "Leaders create activities" ON public.cooperative_activities FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

-- 11. cooperative_dividends
CREATE TABLE public.cooperative_dividends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES public.cooperative_groups(id) ON DELETE CASCADE,
  total_amount NUMERIC NOT NULL,
  period TEXT,
  distribution_date TIMESTAMPTZ,
  status TEXT DEFAULT 'pending',
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.cooperative_dividends ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Group members view dividends" ON public.cooperative_dividends FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.group_members gm WHERE gm.group_id = cooperative_dividends.group_id AND gm.user_id = auth.uid()));
CREATE POLICY "Leaders create dividends" ON public.cooperative_dividends FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

-- 12. member_dividend_payments
CREATE TABLE public.member_dividend_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dividend_id UUID REFERENCES public.cooperative_dividends(id) ON DELETE CASCADE,
  member_id UUID NOT NULL,
  amount NUMERIC NOT NULL,
  payment_method TEXT,
  status TEXT DEFAULT 'pending',
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.member_dividend_payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members view own payments" ON public.member_dividend_payments FOR SELECT TO authenticated USING (auth.uid() = member_id);

-- 13. group_messages
CREATE TABLE public.group_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES public.cooperative_groups(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text',
  attachments TEXT[],
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.group_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Group members view messages" ON public.group_messages FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.group_members gm WHERE gm.group_id = group_messages.group_id AND gm.user_id = auth.uid()));
CREATE POLICY "Members send messages" ON public.group_messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = sender_id);

-- 14. group_transactions
CREATE TABLE public.group_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES public.cooperative_groups(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  description TEXT,
  recorded_by UUID,
  reference_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.group_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Group members view transactions" ON public.group_transactions FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.group_members gm WHERE gm.group_id = group_transactions.group_id AND gm.user_id = auth.uid()));
CREATE POLICY "Leaders record transactions" ON public.group_transactions FOR INSERT TO authenticated WITH CHECK (auth.uid() = recorded_by);

-- 15. agricultural_events
CREATE TABLE public.agricultural_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT,
  location TEXT,
  county TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  organizer_id UUID,
  organizer_name TEXT,
  registration_url TEXT,
  is_free BOOLEAN DEFAULT true,
  fee NUMERIC,
  max_attendees INTEGER,
  image_url TEXT,
  status TEXT DEFAULT 'upcoming',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.agricultural_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view events" ON public.agricultural_events FOR SELECT USING (true);
CREATE POLICY "Authenticated users create events" ON public.agricultural_events FOR INSERT TO authenticated WITH CHECK (auth.uid() = organizer_id);
CREATE POLICY "Organizers update events" ON public.agricultural_events FOR UPDATE TO authenticated USING (auth.uid() = organizer_id);

-- 16. agricultural_organizations
CREATE TABLE public.agricultural_organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_name TEXT NOT NULL,
  org_type TEXT,
  description TEXT,
  county TEXT,
  location TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  website TEXT,
  services TEXT[],
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.agricultural_organizations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view organizations" ON public.agricultural_organizations FOR SELECT USING (true);
CREATE POLICY "Admins manage organizations" ON public.agricultural_organizations FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Add updated_at triggers
CREATE TRIGGER update_farms_updated_at BEFORE UPDATE ON public.farms FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_land_parcels_updated_at BEFORE UPDATE ON public.land_parcels FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bluetooth_devices_updated_at BEFORE UPDATE ON public.bluetooth_devices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_cooperative_groups_updated_at BEFORE UPDATE ON public.cooperative_groups FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_cooperative_activities_updated_at BEFORE UPDATE ON public.cooperative_activities FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_agricultural_events_updated_at BEFORE UPDATE ON public.agricultural_events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_agricultural_organizations_updated_at BEFORE UPDATE ON public.agricultural_organizations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_app_settings_updated_at BEFORE UPDATE ON public.app_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
