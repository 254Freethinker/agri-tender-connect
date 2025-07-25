
-- Create missing tables for complete deployment readiness

-- Service providers table (referenced by service provider registration form)
CREATE TABLE IF NOT EXISTS public.service_providers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  service_type TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  contact_phone TEXT,
  contact_email TEXT NOT NULL,
  website_url TEXT,
  counties_served TEXT[] DEFAULT '{}',
  services_offered TEXT[] DEFAULT '{}',
  certifications TEXT[] DEFAULT '{}',
  experience_years INTEGER DEFAULT 0,
  hourly_rate NUMERIC,
  availability TEXT DEFAULT 'available',
  rating NUMERIC DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
  total_jobs INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create warehouse storage table
CREATE TABLE IF NOT EXISTS public.warehouses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  location TEXT NOT NULL,
  county TEXT NOT NULL,
  latitude NUMERIC,
  longitude NUMERIC,
  capacity_tons NUMERIC NOT NULL,
  has_refrigeration BOOLEAN DEFAULT false,
  has_security BOOLEAN DEFAULT false,
  certifications TEXT[] DEFAULT '{}',
  storage_types TEXT[] DEFAULT '{}',
  daily_rate_per_ton NUMERIC NOT NULL,
  contact_info TEXT NOT NULL,
  operating_hours TEXT,
  availability_status TEXT DEFAULT 'available',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create produce/inventory table for farmer products
CREATE TABLE IF NOT EXISTS public.produce_inventory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  farmer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  variety TEXT,
  quantity NUMERIC NOT NULL,
  unit TEXT NOT NULL DEFAULT 'kg',
  harvest_date DATE,
  expiry_date DATE,
  price_per_unit NUMERIC,
  location TEXT NOT NULL,
  storage_conditions TEXT,
  organic_certified BOOLEAN DEFAULT false,
  quality_grade TEXT DEFAULT 'A',
  available_for_sale BOOLEAN DEFAULT true,
  description TEXT,
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create training events table
CREATE TABLE IF NOT EXISTS public.training_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organizer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_type TEXT NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT NOT NULL,
  county TEXT NOT NULL,
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  cost NUMERIC DEFAULT 0,
  topics TEXT[] DEFAULT '{}',
  target_audience TEXT[] DEFAULT '{}',
  requirements TEXT[] DEFAULT '{}',
  contact_info TEXT NOT NULL,
  registration_deadline TIMESTAMP WITH TIME ZONE,
  is_online BOOLEAN DEFAULT false,
  meeting_link TEXT,
  materials_provided BOOLEAN DEFAULT false,
  certificate_provided BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create transport requests table
CREATE TABLE IF NOT EXISTS public.transport_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  transporter_id UUID REFERENCES transporters(id) ON DELETE SET NULL,
  pickup_location TEXT NOT NULL,
  dropoff_location TEXT NOT NULL,
  pickup_county TEXT NOT NULL,
  dropoff_county TEXT NOT NULL,
  cargo_type TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  unit TEXT NOT NULL DEFAULT 'kg',
  requested_date TIMESTAMP WITH TIME ZONE NOT NULL,
  flexible_timing BOOLEAN DEFAULT false,
  special_requirements TEXT[] DEFAULT '{}',
  estimated_value NUMERIC,
  insurance_required BOOLEAN DEFAULT false,
  contact_phone TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'in_transit', 'completed', 'cancelled')),
  quoted_price NUMERIC,
  actual_price NUMERIC,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create warehouse bookings table
CREATE TABLE IF NOT EXISTS public.warehouse_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  warehouse_id UUID REFERENCES warehouses(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  quantity_tons NUMERIC NOT NULL,
  produce_type TEXT NOT NULL,
  special_requirements TEXT[] DEFAULT '{}',
  total_cost NUMERIC NOT NULL,
  contact_phone TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'active', 'completed', 'cancelled')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'partial', 'refunded')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create market linkages/partnerships table
CREATE TABLE IF NOT EXISTS public.market_linkages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  linkage_type TEXT NOT NULL CHECK (linkage_type IN ('buyer_seller', 'contract_farming', 'cooperative', 'export_opportunity', 'processing_partnership')),
  crops_involved TEXT[] NOT NULL,
  counties TEXT[] NOT NULL,
  requirements TEXT[] DEFAULT '{}',
  benefits TEXT[] DEFAULT '{}',
  contact_info TEXT NOT NULL,
  application_deadline DATE,
  start_date DATE,
  duration_months INTEGER,
  minimum_quantity NUMERIC,
  price_range TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed', 'completed')),
  participants_count INTEGER DEFAULT 0,
  max_participants INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produce_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warehouse_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_linkages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for service_providers
CREATE POLICY "Users can view all service providers" ON public.service_providers FOR SELECT USING (true);
CREATE POLICY "Users can create their own service provider profile" ON public.service_providers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own service provider profile" ON public.service_providers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own service provider profile" ON public.service_providers FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for warehouses
CREATE POLICY "Users can view all warehouses" ON public.warehouses FOR SELECT USING (true);
CREATE POLICY "Users can create their own warehouse" ON public.warehouses FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update their own warehouse" ON public.warehouses FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Users can delete their own warehouse" ON public.warehouses FOR DELETE USING (auth.uid() = owner_id);

-- Create RLS policies for produce_inventory
CREATE POLICY "Users can view all produce" ON public.produce_inventory FOR SELECT USING (true);
CREATE POLICY "Users can create their own produce listings" ON public.produce_inventory FOR INSERT WITH CHECK (auth.uid() = farmer_id);
CREATE POLICY "Users can update their own produce listings" ON public.produce_inventory FOR UPDATE USING (auth.uid() = farmer_id);
CREATE POLICY "Users can delete their own produce listings" ON public.produce_inventory FOR DELETE USING (auth.uid() = farmer_id);

-- Create RLS policies for training_events
CREATE POLICY "Users can view all training events" ON public.training_events FOR SELECT USING (true);
CREATE POLICY "Users can create training events" ON public.training_events FOR INSERT WITH CHECK (auth.uid() = organizer_id);
CREATE POLICY "Users can update their own training events" ON public.training_events FOR UPDATE USING (auth.uid() = organizer_id);
CREATE POLICY "Users can delete their own training events" ON public.training_events FOR DELETE USING (auth.uid() = organizer_id);

-- Create RLS policies for transport_requests
CREATE POLICY "Users can view transport requests" ON public.transport_requests FOR SELECT USING (true);
CREATE POLICY "Users can create transport requests" ON public.transport_requests FOR INSERT WITH CHECK (auth.uid() = requester_id);
CREATE POLICY "Users can update their own transport requests" ON public.transport_requests FOR UPDATE USING (auth.uid() = requester_id OR auth.uid() IN (SELECT user_id FROM transporters WHERE id = transporter_id));

-- Create RLS policies for warehouse_bookings
CREATE POLICY "Users can view their own bookings" ON public.warehouse_bookings FOR SELECT USING (auth.uid() = user_id OR auth.uid() IN (SELECT owner_id FROM warehouses WHERE id = warehouse_id));
CREATE POLICY "Users can create warehouse bookings" ON public.warehouse_bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own bookings" ON public.warehouse_bookings FOR UPDATE USING (auth.uid() = user_id OR auth.uid() IN (SELECT owner_id FROM warehouses WHERE id = warehouse_id));

-- Create RLS policies for market_linkages
CREATE POLICY "Users can view all market linkages" ON public.market_linkages FOR SELECT USING (true);
CREATE POLICY "Users can create market linkages" ON public.market_linkages FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update their own market linkages" ON public.market_linkages FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users can delete their own market linkages" ON public.market_linkages FOR DELETE USING (auth.uid() = created_by);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_service_providers_location ON public.service_providers(location);
CREATE INDEX IF NOT EXISTS idx_service_providers_service_type ON public.service_providers(service_type);
CREATE INDEX IF NOT EXISTS idx_warehouses_county ON public.warehouses(county);
CREATE INDEX IF NOT EXISTS idx_warehouses_capacity ON public.warehouses(capacity_tons);
CREATE INDEX IF NOT EXISTS idx_produce_product_name ON public.produce_inventory(product_name);
CREATE INDEX IF NOT EXISTS idx_produce_location ON public.produce_inventory(location);
CREATE INDEX IF NOT EXISTS idx_training_events_county ON public.training_events(county);
CREATE INDEX IF NOT EXISTS idx_training_events_date ON public.training_events(start_date);
CREATE INDEX IF NOT EXISTS idx_transport_requests_status ON public.transport_requests(status);
CREATE INDEX IF NOT EXISTS idx_warehouse_bookings_status ON public.warehouse_bookings(status);
CREATE INDEX IF NOT EXISTS idx_market_linkages_type ON public.market_linkages(linkage_type);

-- Add update triggers for updated_at columns
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_service_providers BEFORE UPDATE ON public.service_providers FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_warehouses BEFORE UPDATE ON public.warehouses FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_produce_inventory BEFORE UPDATE ON public.produce_inventory FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_training_events BEFORE UPDATE ON public.training_events FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_transport_requests BEFORE UPDATE ON public.transport_requests FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_warehouse_bookings BEFORE UPDATE ON public.warehouse_bookings FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_market_linkages BEFORE UPDATE ON public.market_linkages FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
