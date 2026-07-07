
CREATE TABLE public.leads_extraction_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  extracted_count integer NOT NULL,
  chunk_size integer NOT NULL,
  backup_count integer NOT NULL DEFAULT 0,
  zip_path text,
  backup_path text,
  source text NOT NULL DEFAULT 'web',
  telegram_chat_id text
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads_extraction_history TO authenticated;
GRANT ALL ON public.leads_extraction_history TO service_role;
ALTER TABLE public.leads_extraction_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "authenticated manage history" ON public.leads_extraction_history FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "authenticated read leads-exports" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'leads-exports');
CREATE POLICY "authenticated write leads-exports" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'leads-exports');
CREATE POLICY "authenticated update leads-exports" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'leads-exports');
CREATE POLICY "authenticated delete leads-exports" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'leads-exports');
