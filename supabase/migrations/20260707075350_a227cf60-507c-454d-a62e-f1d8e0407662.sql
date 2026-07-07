CREATE TABLE public.domain_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  domain text NOT NULL UNIQUE,
  luxuryhost_id text,
  status text NOT NULL DEFAULT 'pending',
  last_message text,
  connected_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.domain_connections TO authenticated;
GRANT ALL ON public.domain_connections TO service_role;

ALTER TABLE public.domain_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read domain_connections"
  ON public.domain_connections FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert domain_connections"
  ON public.domain_connections FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update domain_connections"
  ON public.domain_connections FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete domain_connections"
  ON public.domain_connections FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_domain_connections_updated_at
  BEFORE UPDATE ON public.domain_connections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();