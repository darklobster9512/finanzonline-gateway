REVOKE SELECT, INSERT, UPDATE, DELETE ON public.leads FROM anon;
REVOKE ALL ON public.leads FROM PUBLIC;
GRANT SELECT, INSERT, DELETE ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;

NOTIFY pgrst, 'reload schema';