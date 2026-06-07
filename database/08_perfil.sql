-- ════════════════════════════════════════════════════════════════════════
--  ODONT HUB — Migração 08: Perfil profissional (FASE 3)
--  Execute no Supabase do projeto Y (yqmqnczksflncvqvaicn)
-- ════════════════════════════════════════════════════════════════════════

-- ── 1) USERS — colunas novas (todas opcionais) ───────────────────────────
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS cover_url           TEXT,
  ADD COLUMN IF NOT EXISTS descricao_longa     TEXT,        -- "Sobre / Currículo"
  ADD COLUMN IF NOT EXISTS instagram           TEXT,
  ADD COLUMN IF NOT EXISTS site_url            TEXT,
  ADD COLUMN IF NOT EXISTS whatsapp            TEXT,         -- separado do `phone`
  ADD COLUMN IF NOT EXISTS whatsapp_aberto     BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS telefone_aberto     BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS email_aberto        BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS instagram_aberto    BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS site_aberto         BOOLEAN NOT NULL DEFAULT TRUE;

-- ── 2) SEGUIDORES ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.seguidores (
  seguidor_id  UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  seguido_id   UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (seguidor_id, seguido_id),
  CHECK (seguidor_id <> seguido_id)
);
CREATE INDEX IF NOT EXISTS idx_seg_seguido  ON public.seguidores(seguido_id);
CREATE INDEX IF NOT EXISTS idx_seg_seguidor ON public.seguidores(seguidor_id);

-- ── 3) TRABALHO_FOTOS (1 foto por post, soft delete) ─────────────────────
CREATE TABLE IF NOT EXISTS public.trabalho_fotos (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  image_url    TEXT NOT NULL,
  titulo       TEXT,
  descricao    TEXT,
  excluida_em  TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_trab_user_ativas
  ON public.trabalho_fotos(user_id, created_at DESC)
  WHERE excluida_em IS NULL;

-- ── 4) RLS deny (safety net) ─────────────────────────────────────────────
ALTER TABLE public.seguidores     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trabalho_fotos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS seg_deny  ON public.seguidores;
DROP POLICY IF EXISTS trab_deny ON public.trabalho_fotos;
CREATE POLICY seg_deny  ON public.seguidores      FOR ALL USING (false);
CREATE POLICY trab_deny ON public.trabalho_fotos  FOR ALL USING (false);

-- ── 5) Reload schema cache do PostgREST ──────────────────────────────────
SELECT pg_notify('pgrst', 'reload schema');

-- ── 6) Verificação final (esperado: true, true, true) ────────────────────
SELECT
  EXISTS(SELECT 1 FROM information_schema.tables
         WHERE table_schema='public' AND table_name='seguidores')      AS tem_seguidores,
  EXISTS(SELECT 1 FROM information_schema.tables
         WHERE table_schema='public' AND table_name='trabalho_fotos')  AS tem_trabalhos,
  EXISTS(SELECT 1 FROM information_schema.columns
         WHERE table_schema='public' AND table_name='users' AND column_name='cover_url') AS tem_cover;

-- ── Rollback manual ──────────────────────────────────────────────────────
-- DROP TABLE IF EXISTS public.trabalho_fotos;
-- DROP TABLE IF EXISTS public.seguidores;
-- ALTER TABLE public.users
--   DROP COLUMN IF EXISTS cover_url, DROP COLUMN IF EXISTS descricao_longa,
--   DROP COLUMN IF EXISTS instagram, DROP COLUMN IF EXISTS site_url,
--   DROP COLUMN IF EXISTS whatsapp, DROP COLUMN IF EXISTS whatsapp_aberto,
--   DROP COLUMN IF EXISTS telefone_aberto, DROP COLUMN IF EXISTS email_aberto,
--   DROP COLUMN IF EXISTS instagram_aberto, DROP COLUMN IF EXISTS site_aberto;
