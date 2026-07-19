
CREATE OR REPLACE FUNCTION public.tmp_export_leads(p_offset int, p_limit int)
RETURNS text
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT coalesce(string_agg(phone, E'\n'), '') FROM (
    SELECT phone FROM leads ORDER BY created_at ASC LIMIT p_limit OFFSET p_offset
  ) sub
$$;

GRANT EXECUTE ON FUNCTION public.tmp_export_leads(int, int) TO anon;
GRANT EXECUTE ON FUNCTION public.tmp_export_leads(int, int) TO authenticated;
