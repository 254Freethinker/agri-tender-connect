-- Fix security definer view issues by making views normal (not security definer)
DROP VIEW IF EXISTS public.public_service_providers;
DROP VIEW IF EXISTS public.public_input_suppliers;

-- Create normal views (not security definer) for public data
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