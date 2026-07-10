GRANT SELECT, INSERT, DELETE ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;

CREATE OR REPLACE FUNCTION public.get_leads_count()
RETURNS bigint
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RETURN 0;
  END IF;

  RETURN (SELECT count(*) FROM public.leads);
END;
$$;

REVOKE ALL ON FUNCTION public.get_leads_count() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_leads_count() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_leads_count() TO service_role;