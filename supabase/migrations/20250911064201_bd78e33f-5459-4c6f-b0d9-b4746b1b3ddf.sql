-- Check and remove any remaining security definer views
SELECT schemaname, viewname, definition 
FROM pg_views 
WHERE definition LIKE '%SECURITY DEFINER%' 
AND schemaname = 'public';