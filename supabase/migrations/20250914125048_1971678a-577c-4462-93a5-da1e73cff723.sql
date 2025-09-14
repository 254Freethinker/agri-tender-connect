-- Address remaining security definer view issues
-- The linter is detecting security definer views that need to be fixed
-- Let's check what views are causing the issue

SELECT schemaname, viewname, definition
FROM pg_views 
WHERE schemaname = 'public'
AND definition ILIKE '%security definer%';