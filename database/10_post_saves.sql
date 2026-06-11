-- ════════════════════════════════════════════════════════════════════════
--  ODONT HUB — Migração 10: Salvar posts (post_saves)
--  Execute no Supabase do projeto Y (yqmqnczksflncvqvaicn)
-- ════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.post_saves (
  post_id    UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (post_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_psaves_user ON public.post_saves(user_id, created_at DESC);

-- RLS deny (safety net — backend usa SERVICE_KEY que bypassa)
ALTER TABLE public.post_saves ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS psaves_deny ON public.post_saves;
CREATE POLICY psaves_deny ON public.post_saves FOR ALL USING (false);

SELECT pg_notify('pgrst', 'reload schema');

-- Verificação (esperado: true)
SELECT EXISTS(
  SELECT 1 FROM information_schema.tables
  WHERE table_schema='public' AND table_name='post_saves'
) AS tem_post_saves;

-- Rollback manual
-- DROP TABLE IF EXISTS public.post_saves;
