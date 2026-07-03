CREATE TABLE public.page_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  domain text,
  path text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX page_visits_domain_idx ON public.page_visits(domain);
CREATE INDEX page_visits_created_at_idx ON public.page_visits(created_at DESC);

GRANT SELECT ON public.page_visits TO authenticated;
GRANT ALL ON public.page_visits TO service_role;

ALTER TABLE public.page_visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read page visits"
ON public.page_visits FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));