-- ════════════════════════════════════════════════════════════════════════
--  ODONT HUB — Migração 03: Anamneses + Evoluções clínicas (FASE 2A)
--  Execute no Supabase do projeto Y (yqmqnczksflncvqvaicn)
-- ════════════════════════════════════════════════════════════════════════

-- ── ANAMNESES (1 por paciente) ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.anamneses (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  paciente_id     UUID NOT NULL UNIQUE REFERENCES public.pacientes(id) ON DELETE CASCADE,
  clinica_id      UUID NOT NULL REFERENCES public.clinicas(id) ON DELETE CASCADE,
  atualizada_por  UUID REFERENCES public.users(id) ON DELETE SET NULL,
  respostas       JSONB NOT NULL DEFAULT '{}'::jsonb,
  observacoes     TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_anamneses_clinica ON public.anamneses(clinica_id);

DROP TRIGGER IF EXISTS trg_anamneses_upd ON public.anamneses;
CREATE TRIGGER trg_anamneses_upd BEFORE UPDATE ON public.anamneses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ── EVOLUÇÕES (várias por paciente, com soft delete) ─────────────────────
CREATE TABLE IF NOT EXISTS public.evolucoes (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  paciente_id  UUID NOT NULL REFERENCES public.pacientes(id) ON DELETE CASCADE,
  clinica_id   UUID NOT NULL REFERENCES public.clinicas(id) ON DELETE CASCADE,
  autor_id     UUID REFERENCES public.users(id) ON DELETE SET NULL,
  autor_nome   TEXT,                          -- snapshot do nome no momento do registro
  data         DATE NOT NULL DEFAULT CURRENT_DATE,
  descricao    TEXT NOT NULL,
  excluida_em  TIMESTAMPTZ,                   -- soft delete (NULL = ativa)
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_evolucoes_paciente_ativas
  ON public.evolucoes(paciente_id, data DESC, created_at DESC)
  WHERE excluida_em IS NULL;
CREATE INDEX IF NOT EXISTS idx_evolucoes_clinica ON public.evolucoes(clinica_id);

DROP TRIGGER IF EXISTS trg_evolucoes_upd ON public.evolucoes;
CREATE TRIGGER trg_evolucoes_upd BEFORE UPDATE ON public.evolucoes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ── RLS deny (safety net — backend usa SERVICE_KEY que bypassa) ──────────
ALTER TABLE public.anamneses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evolucoes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS anamneses_deny ON public.anamneses;
DROP POLICY IF EXISTS evolucoes_deny ON public.evolucoes;
CREATE POLICY anamneses_deny ON public.anamneses FOR ALL USING (false);
CREATE POLICY evolucoes_deny ON public.evolucoes FOR ALL USING (false);

-- ── Reload schema cache do PostgREST ─────────────────────────────────────
SELECT pg_notify('pgrst', 'reload schema');

-- ── Verificação final (esperado: true, true) ─────────────────────────────
SELECT
  EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='anamneses') AS tem_anamneses,
  EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='evolucoes') AS tem_evolucoes;

-- ── Rollback manual (ordem) ──────────────────────────────────────────────
-- DROP TABLE IF EXISTS public.evolucoes;
-- DROP TABLE IF EXISTS public.anamneses;
