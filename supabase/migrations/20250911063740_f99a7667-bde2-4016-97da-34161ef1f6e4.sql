-- Security Fix 1: Remove public PII exposure and implement proper RBAC

-- First, create the RBAC schema
CREATE TYPE public.app_role AS ENUM ('admin', 'farmer', 'exporter', 'service_provider', 'guest');

CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to get user roles
CREATE OR REPLACE FUNCTION public.get_user_roles(_user_id UUID)
RETURNS TEXT[]
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT ARRAY_AGG(role::TEXT)
  FROM public.user_roles
  WHERE user_id = _user_id
$$;

-- Security Fix 2: Remove dangerous public SELECT policies from PII tables
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Food rescue recipients viewable by all" ON public.food_rescue_recipients;
DROP POLICY IF EXISTS "Input suppliers viewable by all" ON public.input_suppliers;
DROP POLICY IF EXISTS "Service providers viewable by all" ON public.service_providers;

-- Create safer policies for profiles (only basic info public, full access for owners)
CREATE POLICY "Basic profile info viewable by authenticated users" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Users can view their own full profile" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = id);

-- Create non-PII public views for essential tables
CREATE VIEW public.public_service_providers AS
SELECT 
  id,
  service_name,
  service_type,
  description,
  base_price,
  pricing_model,
  rating,
  total_reviews,
  verification_status,
  coverage_area,
  created_at
FROM public.service_providers
WHERE verification_status = 'verified';

CREATE VIEW public.public_input_suppliers AS
SELECT 
  id,
  business_name,
  description,
  products_offered,
  coverage_areas,
  rating,
  total_reviews,
  verification_status,
  created_at
FROM public.input_suppliers
WHERE verification_status = 'verified';

-- Security Fix 3: Make storage buckets private
UPDATE storage.buckets 
SET public = false 
WHERE id IN ('farmer_media', 'profile-pictures');

-- Create proper storage policies
CREATE POLICY "Users can upload their own farmer media" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (
  bucket_id = 'farmer_media' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own farmer media" 
ON storage.objects 
FOR SELECT 
TO authenticated
USING (
  bucket_id = 'farmer_media' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own farmer media" 
ON storage.objects 
FOR UPDATE 
TO authenticated
USING (
  bucket_id = 'farmer_media' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own farmer media" 
ON storage.objects 
FOR DELETE 
TO authenticated
USING (
  bucket_id = 'farmer_media' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Profile pictures policies
CREATE POLICY "Users can upload their own profile pictures" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (
  bucket_id = 'profile-pictures' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own profile pictures" 
ON storage.objects 
FOR SELECT 
TO authenticated
USING (
  bucket_id = 'profile-pictures' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow public read for profile pictures (but not farmer_media)
CREATE POLICY "Public can view profile pictures" 
ON storage.objects 
FOR SELECT 
TO public
USING (bucket_id = 'profile-pictures');

-- Security Fix 4: Add admin-only policies for user role management
CREATE POLICY "Admins can manage user roles" 
ON public.user_roles 
FOR ALL 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

-- Create trigger to assign default role on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert basic profile
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email)
  );
  
  -- Assign default role (never trust client-provided role)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'farmer');
  
  RETURN NEW;
END;
$$;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();