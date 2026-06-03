-- ══════════════════════════════════════════════════════════════════════════
--  ODONT HUB — Migração 02: Clínicas + Pacientes (FASE 1 do módulo clínico)
--  Execute no Supabase: Dashboard → SQL Editor → New Query → Run
-- ══════════════════════════════════════════════════════════════════════════

-- ── CLÍNICAS ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS clinicas (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome        TEXT NOT NULL,
  criado_por  UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_clinicas_upd ON clinicas;
CREATE TRIGGER trg_clinicas_upd BEFORE UPDATE ON clinicas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── USERS.clinica_id (nullable, não quebra login atual) ───────────────────
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS clinica_id UUID REFERENCES clinicas(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_users_clinica ON users(clinica_id);

-- ── PACIENTES ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pacientes (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinica_id          UUID NOT NULL REFERENCES clinicas(id) ON DELETE CASCADE,
  criado_por          UUID REFERENCES users(id) ON DELETE SET NULL,
  nome_completo       TEXT NOT NULL,
  apelido             TEXT,
  data_nascimento     DATE,
  sexo                TEXT,
  cpf                 TEXT,
  rg                  TEXT,
  estado_civil        TEXT,
  telefone_whatsapp   TEXT,
  telefone_fixo       TEXT,
  email               TEXT,
  convenio            TEXT,
  profissao           TEXT,
  cep                 TEXT,
  endereco            TEXT,
  numero              TEXT,
  complemento         TEXT,
  bairro              TEXT,
  cidade              TEXT,
  uf                  CHAR(2),
  observacoes         TEXT,
  ativo               BOOLEAN NOT NULL DEFAULT TRUE,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pacientes_clinica ON pacientes(clinica_id);
CREATE INDEX IF NOT EXISTS idx_pacientes_ativo   ON pacientes(clinica_id, ativo);
CREATE INDEX IF NOT EXISTS idx_pacientes_nome_trgm
  ON pacientes USING gin (lower(nome_completo) gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_pacientes_cpf
  ON pacientes(cpf) WHERE cpf IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS uq_pacientes_clinica_cpf
  ON pacientes(clinica_id, cpf) WHERE cpf IS NOT NULL AND cpf <> '';

DROP TRIGGER IF EXISTS trg_pacientes_upd ON pacientes;
CREATE TRIGGER trg_pacientes_upd BEFORE UPDATE ON pacientes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── RLS: defesa em profundidade ───────────────────────────────────────────
-- O backend usa SUPABASE_SERVICE_KEY (bypass total das policies).
-- A segurança real está no backend filtrando WHERE clinica_id = USER.clinica_id.
-- As policies abaixo bloqueiam qualquer acesso via anon/authenticated key
-- (safety net se alguém vazar a anon key e tentar consultar direto).
ALTER TABLE clinicas  ENABLE ROW LEVEL SECURITY;
ALTER TABLE pacientes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS clinicas_deny  ON clinicas;
DROP POLICY IF EXISTS pacientes_deny ON pacientes;
CREATE POLICY clinicas_deny  ON clinicas  FOR ALL USING (false);
CREATE POLICY pacientes_deny ON pacientes FOR ALL USING (false);

-- ══════════════════════════════════════════════════════════════════════════
--  ROLLBACK (para reverter manualmente, na ordem)
-- ══════════════════════════════════════════════════════════════════════════
-- DROP TABLE IF EXISTS pacientes;
-- ALTER TABLE users DROP COLUMN IF EXISTS clinica_id;
-- DROP TABLE IF EXISTS clinicas;
