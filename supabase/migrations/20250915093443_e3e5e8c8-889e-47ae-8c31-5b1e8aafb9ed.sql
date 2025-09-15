-- Fix remaining security definer view issues
-- Drop and recreate views without SECURITY DEFINER

-- Drop existing views if they exist
DROP VIEW IF EXISTS public_input_suppliers;
DROP VIEW IF EXISTS public_service_providers;

-- Recreate views with SECURITY INVOKER (default)
CREATE VIEW public_input_suppliers AS
SELECT 
  id,
  name,
  location,
  contact,
  products
FROM input_suppliers
WHERE status = 'active';

CREATE VIEW public_service_providers AS
SELECT 
  id,
  name,
  services,
  location,
  contact,
  rating
FROM service_providers
WHERE status = 'active';