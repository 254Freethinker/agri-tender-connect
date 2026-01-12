-- =====================================================
-- Farmer-Exporter Collaboration Tables
-- =====================================================

-- Table: farmer_exporter_collaborations
-- Purpose: Farmers seeking export partnerships
CREATE TABLE public.farmer_exporter_collaborations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    farmer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    exporter_id UUID REFERENCES auth.users(id),
    
    -- Farmer Information
    farmer_name TEXT NOT NULL,
    farmer_phone TEXT NOT NULL,
    farmer_email TEXT,
    farmer_location TEXT NOT NULL,
    farmer_county TEXT NOT NULL,
    farmer_coordinates JSONB,
    farm_size_acres NUMERIC,
    
    -- Commodity Information
    commodity_name TEXT NOT NULL,
    commodity_variety TEXT,
    estimated_quantity NUMERIC NOT NULL,
    unit TEXT NOT NULL DEFAULT 'kg',
    quality_grade TEXT,
    harvest_date DATE,
    availability_period TEXT,
    
    -- Farmer Profile
    farmer_experience_years INTEGER,
    has_export_documentation BOOLEAN NOT NULL DEFAULT false,
    documentation_needs TEXT[],
    farmer_profile_description TEXT,
    
    -- Collaboration Details
    collaboration_type TEXT NOT NULL DEFAULT 'supply_partnership',
    target_markets TEXT[],
    pricing_expectations TEXT,
    special_requirements TEXT[],
    farmer_certifications TEXT[],
    
    -- Status
    collaboration_status TEXT NOT NULL DEFAULT 'seeking_exporter',
    is_active BOOLEAN NOT NULL DEFAULT true,
    expires_at TIMESTAMPTZ,
    notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table: exporter_profiles
-- Purpose: Registered exporters who can partner with farmers
CREATE TABLE public.exporter_profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    
    -- Company Information
    company_name TEXT NOT NULL,
    company_registration_number TEXT,
    business_license_number TEXT,
    export_license_number TEXT,
    company_description TEXT,
    
    -- Contact Information
    contact_person_name TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    office_location TEXT NOT NULL,
    office_county TEXT NOT NULL,
    office_coordinates JSONB,
    website_url TEXT,
    
    -- Business Details
    years_in_business INTEGER,
    export_markets TEXT[] NOT NULL DEFAULT '{}',
    commodities_handled TEXT[] NOT NULL DEFAULT '{}',
    services_offered TEXT[] NOT NULL DEFAULT '{}',
    minimum_quantity_tons NUMERIC,
    maximum_quantity_tons NUMERIC,
    certifications TEXT[],
    
    -- Services Flags
    documentation_services BOOLEAN NOT NULL DEFAULT true,
    logistics_services BOOLEAN NOT NULL DEFAULT false,
    quality_assurance_services BOOLEAN NOT NULL DEFAULT false,
    financing_services BOOLEAN NOT NULL DEFAULT false,
    
    -- Reputation
    rating NUMERIC NOT NULL DEFAULT 0,
    total_collaborations INTEGER NOT NULL DEFAULT 0,
    successful_exports INTEGER NOT NULL DEFAULT 0,
    
    -- Verification
    is_verified BOOLEAN NOT NULL DEFAULT false,
    verification_documents TEXT[],
    is_active BOOLEAN NOT NULL DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.farmer_exporter_collaborations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exporter_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for farmer_exporter_collaborations
CREATE POLICY "Anyone can view active collaborations"
ON public.farmer_exporter_collaborations
FOR SELECT
USING (is_active = true);

CREATE POLICY "Farmers can create their own collaborations"
ON public.farmer_exporter_collaborations
FOR INSERT
WITH CHECK (auth.uid() = farmer_id);

CREATE POLICY "Farmers can update their own collaborations"
ON public.farmer_exporter_collaborations
FOR UPDATE
USING (auth.uid() = farmer_id);

CREATE POLICY "Farmers can delete their own collaborations"
ON public.farmer_exporter_collaborations
FOR DELETE
USING (auth.uid() = farmer_id);

-- RLS Policies for exporter_profiles
CREATE POLICY "Anyone can view active exporter profiles"
ON public.exporter_profiles
FOR SELECT
USING (is_active = true);

CREATE POLICY "Users can create their own exporter profile"
ON public.exporter_profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own exporter profile"
ON public.exporter_profiles
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own exporter profile"
ON public.exporter_profiles
FOR DELETE
USING (auth.uid() = user_id);

-- Triggers for updated_at
CREATE TRIGGER update_farmer_exporter_collaborations_updated_at
BEFORE UPDATE ON public.farmer_exporter_collaborations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_exporter_profiles_updated_at
BEFORE UPDATE ON public.exporter_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes for performance
CREATE INDEX idx_farmer_exporter_collab_farmer ON public.farmer_exporter_collaborations(farmer_id);
CREATE INDEX idx_farmer_exporter_collab_status ON public.farmer_exporter_collaborations(collaboration_status);
CREATE INDEX idx_farmer_exporter_collab_commodity ON public.farmer_exporter_collaborations(commodity_name);
CREATE INDEX idx_farmer_exporter_collab_county ON public.farmer_exporter_collaborations(farmer_county);
CREATE INDEX idx_exporter_profiles_user ON public.exporter_profiles(user_id);
CREATE INDEX idx_exporter_profiles_county ON public.exporter_profiles(office_county);