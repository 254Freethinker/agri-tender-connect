-- Update Android security config by removing security definer functions that are causing linter errors
-- First let's check what security definer functions exist
SELECT proname, prosrc 
FROM pg_proc p 
JOIN pg_namespace n ON p.pronamespace = n.oid 
WHERE n.nspname = 'public' 
AND prosecdef = true;