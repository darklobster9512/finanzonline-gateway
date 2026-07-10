REVOKE EXECUTE ON FUNCTION public.get_leads_count() FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_leads_count() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_leads_count() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_leads_count() TO service_role;