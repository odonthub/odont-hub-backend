-- ════════════════════════════════════════════════════════════════════════
--  ODONT HUB — Migração 06: Agendamentos (consultas)
--  Execute no Supabase do projeto Y (yqmqnczksflncvqvaicn)
-- ════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.agendamentos (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  paciente_id        UUID NOT NULL REFERENCES public.pacientes(id) ON DELETE CASCADE,
  clinica_id         UUID NOT NULL REFERENCES public.clinicas(id) ON DELETE CASCADE,
  criado_por         UUID REFERENCES public.users(id) ON DELETE SET NULL,
  -- Profissional (PROFISSIONAIS ainda vive em localStorage no MVP)
  profissional_id    TEXT,
  profissional_nome  TEXT,
  profissional_cor   TEXT,
  data               DATE NOT NULL,
  hora               TIME NOT NULL,
  duracao_minutos    INTEGER NOT NULL DEFAULT 60 CHECK (duracao_minutos > 0),
  procedimento       TEXT,
  observacoes        TEXT,
  status             TEXT NOT NULL DEFAULT 'pendente'
                       CHECK (status IN ('pendente','confirmado','realizado','faltou','cancelado')),
  excluido_em        TIMESTAMPTZ,    -- soft delete (NULL = ativo)
  created_at         TIMESTAMPTZ DEFAULT NOW(),
  updated_at         TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agend_paciente_ativos
  ON public.agendamentos(paciente_id, data, hora)
  WHERE excluido_em IS NULL;
CREATE INDEX IF NOT EXISTS idx_agend_clinica_data
  ON public.agendamentos(clinica_id, data, hora)
  WHERE excluido_em IS NULL;
CREATE INDEX IF NOT EXISTS idx_agend_clinica_status
  ON public.agendamentos(clinica_id, status)
  WHERE excluido_em IS NULL;

DROP TRIGGER IF EXISTS trg_agend_upd ON public.agendamentos;
CREATE TRIGGER trg_agend_upd BEFORE UPDATE ON public.agendamentos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE public.agendamentos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS agend_deny ON public.agendamentos;
CREATE POLICY agend_deny ON public.agendamentos FOR ALL USING (false);

SELECT pg_notify('pgrst', 'reload schema');

-- Verificação final (esperado: true)
SELECT EXISTS(
  SELECT 1 FROM information_schema.tables
  WHERE table_schema='public' AND table_name='agendamentos'
) AS tem_agendamentos;

-- Rollback
-- DROP TABLE IF EXISTS public.agendamentos;
