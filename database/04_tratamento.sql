-- ════════════════════════════════════════════════════════════════════════
--  ODONT HUB — Migração 04: Plano de tratamento (opções + itens)
--  Execute no Supabase do projeto Y (yqmqnczksflncvqvaicn)
-- ════════════════════════════════════════════════════════════════════════

-- ── OPÇÕES (alternativas; soft delete via excluida_em) ───────────────────
CREATE TABLE IF NOT EXISTS public.tratamento_opcoes (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  paciente_id   UUID NOT NULL REFERENCES public.pacientes(id) ON DELETE CASCADE,
  clinica_id    UUID NOT NULL REFERENCES public.clinicas(id) ON DELETE CASCADE,
  criado_por    UUID REFERENCES public.users(id) ON DELETE SET NULL,
  titulo        TEXT NOT NULL,
  descricao     TEXT,
  status        TEXT NOT NULL DEFAULT 'proposta'
                  CHECK (status IN ('proposta','aprovada','recusada')),
  aprovada_em   TIMESTAMPTZ,
  ordem         INTEGER NOT NULL DEFAULT 0,
  excluida_em   TIMESTAMPTZ,                       -- soft delete (NULL = ativa)
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_trat_opcoes_paciente_ativas
  ON public.tratamento_opcoes(paciente_id, ordem)
  WHERE excluida_em IS NULL;
CREATE INDEX IF NOT EXISTS idx_trat_opcoes_clinica
  ON public.tratamento_opcoes(clinica_id);
-- Apenas 1 aprovada ATIVA por paciente
CREATE UNIQUE INDEX IF NOT EXISTS uq_trat_opcoes_paciente_aprovada
  ON public.tratamento_opcoes(paciente_id)
  WHERE status = 'aprovada' AND excluida_em IS NULL;

DROP TRIGGER IF EXISTS trg_trat_opcoes_upd ON public.tratamento_opcoes;
CREATE TRIGGER trg_trat_opcoes_upd BEFORE UPDATE ON public.tratamento_opcoes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ── ITENS (vinculados à opção; CASCADE no DELETE da opção) ───────────────
CREATE TABLE IF NOT EXISTS public.tratamento_itens (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  opcao_id        UUID NOT NULL REFERENCES public.tratamento_opcoes(id) ON DELETE CASCADE,
  clinica_id      UUID NOT NULL REFERENCES public.clinicas(id) ON DELETE CASCADE,
  procedimento    TEXT NOT NULL,
  dente           TEXT,
  quantidade      INTEGER NOT NULL DEFAULT 1 CHECK (quantidade > 0),
  valor_unitario  NUMERIC(10,2) NOT NULL CHECK (valor_unitario >= 0),
  ordem           INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_trat_itens_opcao   ON public.tratamento_itens(opcao_id, ordem);
CREATE INDEX IF NOT EXISTS idx_trat_itens_clinica ON public.tratamento_itens(clinica_id);

-- ── RLS deny (safety net — backend usa SERVICE_KEY que bypassa) ──────────
ALTER TABLE public.tratamento_opcoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tratamento_itens  ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS trat_opcoes_deny ON public.tratamento_opcoes;
DROP POLICY IF EXISTS trat_itens_deny  ON public.tratamento_itens;
CREATE POLICY trat_opcoes_deny ON public.tratamento_opcoes FOR ALL USING (false);
CREATE POLICY trat_itens_deny  ON public.tratamento_itens  FOR ALL USING (false);

-- ── Reload schema cache do PostgREST ─────────────────────────────────────
SELECT pg_notify('pgrst', 'reload schema');

-- ── Verificação final (esperado: true, true) ─────────────────────────────
SELECT
  EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='tratamento_opcoes') AS tem_opcoes,
  EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='tratamento_itens')  AS tem_itens;

-- ── Rollback manual ──────────────────────────────────────────────────────
-- DROP TABLE IF EXISTS public.tratamento_itens;
-- DROP TABLE IF EXISTS public.tratamento_opcoes;
