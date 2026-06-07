-- ════════════════════════════════════════════════════════════════════════
--  ODONT HUB — Migração 07: Marketplace ganha coluna `whatsapp`
--  Execute no Supabase do projeto Y (yqmqnczksflncvqvaicn)
-- ════════════════════════════════════════════════════════════════════════

ALTER TABLE public.marketplace_listings
  ADD COLUMN IF NOT EXISTS whatsapp TEXT;

-- Reload schema cache do PostgREST
SELECT pg_notify('pgrst', 'reload schema');

-- Verificação final (esperado: true)
SELECT EXISTS(
  SELECT 1 FROM information_schema.columns
  WHERE table_schema='public'
    AND table_name='marketplace_listings'
    AND column_name='whatsapp'
) AS tem_whatsapp;

-- Rollback manual
-- ALTER TABLE public.marketplace_listings DROP COLUMN IF EXISTS whatsapp;
