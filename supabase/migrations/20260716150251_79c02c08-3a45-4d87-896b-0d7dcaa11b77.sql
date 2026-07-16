
CREATE INDEX IF NOT EXISTS idx_ip_blocklist_base_mask ON public.ip_blocklist (base_int, mask_int);

CREATE OR REPLACE FUNCTION public.check_ip_blocked(p_ip_int bigint)
RETURNS TABLE(source text, cidr text)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT source, cidr FROM public.ip_blocklist
  WHERE (p_ip_int & mask_int) = base_int
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.check_ip_blocked(bigint) TO service_role;
