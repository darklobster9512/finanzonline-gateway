
CREATE TABLE public.ip_blocklist (
  id bigint generated always as identity primary key,
  base_int bigint not null,
  mask_int bigint not null,
  cidr text not null,
  source text not null,
  created_at timestamptz not null default now()
);

CREATE UNIQUE INDEX idx_ip_blocklist_cidr_source ON public.ip_blocklist(cidr, source);
CREATE INDEX idx_ip_blocklist_source ON public.ip_blocklist(source);

GRANT SELECT ON public.ip_blocklist TO authenticated;
GRANT ALL ON public.ip_blocklist TO service_role;

ALTER TABLE public.ip_blocklist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view ip_blocklist"
ON public.ip_blocklist FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));
