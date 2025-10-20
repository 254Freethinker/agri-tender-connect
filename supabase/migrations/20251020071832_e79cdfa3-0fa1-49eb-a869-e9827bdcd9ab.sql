-- Add tables for carbon credit providers and farmer warnings
CREATE TABLE IF NOT EXISTS public.carbon_credit_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  provider_name TEXT NOT NULL,
  provider_type TEXT NOT NULL CHECK (provider_type IN ('aggregator', 'buyer', 'verifier', 'consultant')),
  registration_number TEXT,
  contact_person TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  physical_address TEXT NOT NULL,
  county TEXT NOT NULL,
  description TEXT,
  services_offered TEXT[],
  pricing_model TEXT,
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  trust_score DECIMAL(3,2) DEFAULT 0.0 CHECK (trust_score >= 0 AND trust_score <= 5.0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.farmer_protection_warnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  warning_type TEXT NOT NULL CHECK (warning_type IN ('scam_alert', 'price_manipulation', 'contract_violation', 'fake_buyer', 'other')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  affected_regions TEXT[],
  reported_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  verified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'investigating')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add transport fields to food_rescue_listings
ALTER TABLE public.food_rescue_listings 
  ADD COLUMN IF NOT EXISTS transport_provided BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS transport_details TEXT,
  ADD COLUMN IF NOT EXISTS pickup_deadline TIMESTAMPTZ;

-- Enable RLS
ALTER TABLE public.carbon_credit_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmer_protection_warnings ENABLE ROW LEVEL SECURITY;

-- Policies for carbon_credit_providers
CREATE POLICY "Providers are viewable by everyone"
  ON public.carbon_credit_providers FOR SELECT
  USING (true);

CREATE POLICY "Users can register as providers"
  ON public.carbon_credit_providers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their provider profile"
  ON public.carbon_credit_providers FOR UPDATE
  USING (auth.uid() = user_id);

-- Policies for farmer_protection_warnings
CREATE POLICY "Warnings are viewable by everyone"
  ON public.farmer_protection_warnings FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can report warnings"
  ON public.farmer_protection_warnings FOR INSERT
  WITH CHECK (auth.uid() = reported_by);

-- Triggers for updated_at
CREATE TRIGGER update_carbon_credit_providers_updated_at
  BEFORE UPDATE ON public.carbon_credit_providers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_farmer_protection_warnings_updated_at
  BEFORE UPDATE ON public.farmer_protection_warnings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes for performance
CREATE INDEX idx_carbon_providers_verification ON public.carbon_credit_providers(verification_status);
CREATE INDEX idx_carbon_providers_county ON public.carbon_credit_providers(county);
CREATE INDEX idx_warnings_status ON public.farmer_protection_warnings(status);
CREATE INDEX idx_warnings_severity ON public.farmer_protection_warnings(severity);