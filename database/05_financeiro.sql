-- ════════════════════════════════════════════════════════════════════════
--  ODONT HUB — Migração 05: Financeiro do paciente (pagamentos/parcelas)
--  Execute no Supabase do projeto Y (yqmqnczksflncvqvaicn)
-- ════════════════════════════════════════════════════════════════════════

-- ── PAGAMENTOS (1 linha = 1 parcela; vínculo opcional a uma opção do plano)
CREATE TABLE IF NOT EXISTS public.pagamentos (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  paciente_id       UUID NOT NULL REFERENCES public.pacientes(id) ON DELETE CASCADE,
  clinica_id        UUID NOT NULL REFERENCES public.clinicas(id) ON DELETE CASCADE,
  opcao_id          UUID REFERENCES public.tratamento_opcoes(id) ON DELETE SET NULL,
  criado_por        UUID REFERENCES public.users(id) ON DELETE SET NULL,
  descricao         TEXT NOT NULL,
  valor             NUMERIC(10,2) NOT NULL CHECK (valor >= 0),
  vencimento        DATE,
  status            TEXT NOT NULL DEFAULT 'pendente'
                      CHECK (status IN ('pendente','pago')),
  pago_em           TIMESTAMPTZ,
  forma_pagamento   TEXT CHECK (forma_pagamento IS NULL OR forma_pagamento IN
                      ('dinheiro','pix','cartao_credito','cartao_debito',
                       'boleto','transferencia','outro')),
  numero_parcela    INTEGER,
  total_parcelas    INTEGER,
  observacoes       TEXT,
  excluido_em       TIMESTAMPTZ,                       -- soft delete (NULL = ativo)
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pag_paciente_ativos
  ON public.pagamentos(paciente_id, vencimento)
  WHERE excluido_em IS NULL;
CREATE INDEX IF NOT EXISTS idx_pag_clinica
  ON public.pagamentos(clinica_id)
  WHERE excluido_em IS NULL;
CREATE INDEX IF NOT EXISTS idx_pag_opcao
  ON public.pagamentos(opcao_id)
  WHERE opcao_id IS NOT NULL AND excluido_em IS NULL;
-- Já prepara terreno pra Caixa da Clínica (filtra por clínica + status)
CREATE INDEX IF NOT EXISTS idx_pag_clinica_status
  ON public.pagamentos(clinica_id, status, vencimento)
  WHERE excluido_em IS NULL;

DROP TRIGGER IF EXISTS trg_pag_upd ON public.pagamentos;
CREATE TRIGGER trg_pag_upd BEFORE UPDATE ON public.pagamentos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ── RLS deny (safety net — backend usa SERVICE_KEY que bypassa) ──────────
ALTER TABLE public.pagamentos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS pagamentos_deny ON public.pagamentos;
CREATE POLICY pagamentos_deny ON public.pagamentos FOR ALL USING (false);

-- ── Reload schema cache do PostgREST ─────────────────────────────────────
SELECT pg_notify('pgrst', 'reload schema');

-- ── Verificação final (esperado: true) ───────────────────────────────────
SELECT EXISTS(
  SELECT 1 FROM information_schema.tables
  WHERE table_schema='public' AND table_name='pagamentos'
) AS tem_pagamentos;

-- ── Rollback manual ──────────────────────────────────────────────────────
-- DROP TABLE IF EXISTS public.pagamentos;
