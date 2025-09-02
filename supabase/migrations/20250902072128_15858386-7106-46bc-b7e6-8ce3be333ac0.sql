-- Complete Agricultural Supply Chain Database Schema
-- This creates all tables needed for the platform

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles table (core user data)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  location TEXT,
  user_type TEXT CHECK (user_type IN ('farmer', 'buyer', 'agent', 'transporter', 'service_provider', 'admin')),
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. City Market Products
CREATE TABLE public.city_market_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID NOT NULL REFERENCES public.profiles(id),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  quantity DECIMAL NOT NULL,
  unit TEXT NOT NULL,
  price_per_unit DECIMAL NOT NULL,
  status TEXT DEFAULT 'fresh' CHECK (status IN ('fresh', 'near_expiry', 'spoilt', 'donated', 'sold')),
  expiry_date TIMESTAMPTZ,
  harvest_date TIMESTAMPTZ,
  location TEXT,
  images TEXT[],
  posted_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Product Auctions
CREATE TABLE public.product_auctions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID NOT NULL REFERENCES public.profiles(id),
  product_id UUID REFERENCES public.city_market_products(id),
  title TEXT NOT NULL,
  description TEXT,
  starting_price DECIMAL NOT NULL,
  current_highest_bid DECIMAL DEFAULT 0,
  reserve_price DECIMAL,
  auction_end_time TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'ended', 'cancelled')),
  winner_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Auction Bids
CREATE TABLE public.auction_bids (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auction_id UUID NOT NULL REFERENCES public.product_auctions(id),
  bidder_id UUID NOT NULL REFERENCES public.profiles(id),
  bid_amount DECIMAL NOT NULL,
  bid_time TIMESTAMPTZ DEFAULT NOW(),
  is_winning_bid BOOLEAN DEFAULT FALSE
);

-- 5. Food Rescue Recipients
CREATE TABLE public.food_rescue_recipients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('children_home', 'food_bank', 'charity', 'community_center')),
  contact_person TEXT,
  phone TEXT,
  email TEXT,
  address TEXT NOT NULL,
  capacity_description TEXT,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Food Rescue Listings
CREATE TABLE public.food_rescue_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_id UUID NOT NULL REFERENCES public.profiles(id),
  product_name TEXT NOT NULL,
  quantity DECIMAL NOT NULL,
  unit TEXT NOT NULL,
  expiry_date TIMESTAMPTZ,
  pickup_location TEXT NOT NULL,
  pickup_time_start TIMESTAMPTZ,
  pickup_time_end TIMESTAMPTZ,
  description TEXT,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'claimed', 'picked_up', 'expired')),
  recipient_id UUID REFERENCES public.food_rescue_recipients(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Food Rescue Matches
CREATE TABLE public.food_rescue_matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES public.food_rescue_listings(id),
  recipient_id UUID NOT NULL REFERENCES public.food_rescue_recipients(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  pickup_scheduled_time TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Export Opportunities
CREATE TABLE public.export_opportunities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_by UUID REFERENCES public.profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  opportunity_type TEXT DEFAULT 'buy' CHECK (opportunity_type IN ('buy', 'sell')),
  product_category TEXT NOT NULL,
  quantity_needed DECIMAL,
  unit TEXT,
  target_price DECIMAL,
  delivery_location TEXT,
  deadline TIMESTAMPTZ,
  specifications JSONB,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Export Documentation
CREATE TABLE public.export_documentation (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  opportunity_id UUID NOT NULL REFERENCES public.export_opportunities(id),
  uploaded_by UUID NOT NULL REFERENCES public.profiles(id),
  document_type TEXT NOT NULL,
  document_url TEXT NOT NULL,
  document_name TEXT NOT NULL,
  file_size INTEGER,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Farmer Consolidations
CREATE TABLE public.farmer_consolidations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  consolidator_id UUID NOT NULL REFERENCES public.profiles(id),
  opportunity_id UUID NOT NULL REFERENCES public.export_opportunities(id),
  farmers_involved UUID[] NOT NULL,
  total_quantity DECIMAL NOT NULL,
  agreed_price DECIMAL,
  consolidation_fee DECIMAL,
  status TEXT DEFAULT 'forming' CHECK (status IN ('forming', 'confirmed', 'delivered', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Group Input Orders
CREATE TABLE public.group_input_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coordinator_id UUID NOT NULL REFERENCES public.profiles(id),
  input_type TEXT NOT NULL,
  description TEXT,
  target_quantity DECIMAL NOT NULL,
  unit TEXT NOT NULL,
  target_price_per_unit DECIMAL,
  delivery_location TEXT,
  order_deadline TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed', 'ordered', 'delivered')),
  supplier_id UUID REFERENCES public.profiles(id),
  final_price_per_unit DECIMAL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Group Order Participants
CREATE TABLE public.group_order_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.group_input_orders(id),
  farmer_id UUID NOT NULL REFERENCES public.profiles(id),
  quantity_needed DECIMAL NOT NULL,
  commitment_status TEXT DEFAULT 'interested' CHECK (commitment_status IN ('interested', 'committed', 'paid')),
  joined_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. F2C Subscription Plans
CREATE TABLE public.f2c_subscription_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  frequency TEXT NOT NULL CHECK (frequency IN ('weekly', 'bi_weekly', 'monthly')),
  price DECIMAL NOT NULL,
  box_size TEXT CHECK (box_size IN ('small', 'medium', 'large')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. F2C Subscriptions
CREATE TABLE public.f2c_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  consumer_id UUID NOT NULL REFERENCES public.profiles(id),
  plan_id UUID NOT NULL REFERENCES public.f2c_subscription_plans(id),
  delivery_address TEXT NOT NULL,
  delivery_instructions TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled')),
  next_delivery_date TIMESTAMPTZ,
  payment_method TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. F2C Deliveries
CREATE TABLE public.f2c_deliveries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscription_id UUID NOT NULL REFERENCES public.f2c_subscriptions(id),
  farmer_id UUID REFERENCES public.profiles(id),
  delivery_date TIMESTAMPTZ NOT NULL,
  contents JSONB,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'packed', 'in_transit', 'delivered', 'failed')),
  tracking_number TEXT,
  delivery_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. Service Providers
CREATE TABLE public.service_providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES public.profiles(id),
  service_type TEXT NOT NULL CHECK (service_type IN ('transport', 'storage', 'processing', 'certification', 'consultation')),
  service_name TEXT NOT NULL,
  description TEXT,
  coverage_area TEXT[],
  pricing_model TEXT,
  base_price DECIMAL,
  availability_schedule JSONB,
  contact_info JSONB,
  rating DECIMAL DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  total_reviews INTEGER DEFAULT 0,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. Service Bookings
CREATE TABLE public.service_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id UUID NOT NULL REFERENCES public.service_providers(id),
  client_id UUID NOT NULL REFERENCES public.profiles(id),
  booking_date TIMESTAMPTZ NOT NULL,
  service_date TIMESTAMPTZ NOT NULL,
  details JSONB,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  total_cost DECIMAL,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. Contract Farming
CREATE TABLE public.contract_farming (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id UUID NOT NULL REFERENCES public.profiles(id),
  farmer_id UUID REFERENCES public.profiles(id),
  crop_type TEXT NOT NULL,
  quantity DECIMAL NOT NULL,
  unit TEXT NOT NULL,
  price_per_unit DECIMAL NOT NULL,
  contract_start_date DATE NOT NULL,
  expected_harvest_date DATE NOT NULL,
  delivery_terms TEXT,
  quality_standards TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'accepted', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. Contract Documents
CREATE TABLE public.contract_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contract_id UUID NOT NULL REFERENCES public.contract_farming(id),
  document_type TEXT NOT NULL,
  document_url TEXT NOT NULL,
  uploaded_by UUID NOT NULL REFERENCES public.profiles(id),
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. Contract Reviews
CREATE TABLE public.contract_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contract_id UUID NOT NULL REFERENCES public.contract_farming(id),
  reviewer_id UUID NOT NULL REFERENCES public.profiles(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 21. Farm Statistics Tables
CREATE TABLE public.farm_yields (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID NOT NULL,
  planting_date TIMESTAMPTZ NOT NULL,
  crop_type TEXT NOT NULL,
  expected_yield DECIMAL NOT NULL,
  actual_yield DECIMAL,
  yield_unit TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.resource_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID NOT NULL,
  resource_type TEXT NOT NULL,
  usage_date TIMESTAMPTZ NOT NULL,
  quantity DECIMAL NOT NULL,
  unit TEXT NOT NULL,
  total_cost DECIMAL NOT NULL,
  efficiency_score DECIMAL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.farm_budget (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID NOT NULL,
  category TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  planned_amount DECIMAL NOT NULL,
  actual_amount DECIMAL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.weather_impact (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  temperature DECIMAL NOT NULL,
  rainfall DECIMAL NOT NULL,
  soil_moisture DECIMAL NOT NULL,
  impact_score DECIMAL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 22. Input Suppliers
CREATE TABLE public.input_suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id UUID NOT NULL REFERENCES public.profiles(id),
  business_name TEXT NOT NULL,
  description TEXT,
  products_offered TEXT[],
  coverage_areas TEXT[],
  contact_info JSONB,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  rating DECIMAL DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 23. Input Products
CREATE TABLE public.input_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id UUID NOT NULL REFERENCES public.input_suppliers(id),
  product_name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  unit TEXT NOT NULL,
  current_price DECIMAL NOT NULL,
  stock_quantity DECIMAL,
  quality_grade TEXT,
  specifications JSONB,
  images TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_profiles_user_type ON public.profiles(user_type);
CREATE INDEX idx_city_market_products_status ON public.city_market_products(status);
CREATE INDEX idx_city_market_products_agent_id ON public.city_market_products(agent_id);
CREATE INDEX idx_export_opportunities_status ON public.export_opportunities(status);
CREATE INDEX idx_export_opportunities_type ON public.export_opportunities(opportunity_type);
CREATE INDEX idx_food_rescue_listings_status ON public.food_rescue_listings(status);
CREATE INDEX idx_group_input_orders_status ON public.group_input_orders(status);
CREATE INDEX idx_service_providers_type ON public.service_providers(service_type);

-- Create update timestamp trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_city_market_products_updated_at BEFORE UPDATE ON public.city_market_products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_farm_yields_updated_at BEFORE UPDATE ON public.farm_yields FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_resource_usage_updated_at BEFORE UPDATE ON public.resource_usage FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_farm_budget_updated_at BEFORE UPDATE ON public.farm_budget FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_weather_impact_updated_at BEFORE UPDATE ON public.weather_impact FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_input_products_updated_at BEFORE UPDATE ON public.input_products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();