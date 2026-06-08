-- ════════════════════════════════════════════════════════════════════════
--  ODONT HUB — Migração 09: Chat privado + Proteções (bloqueio/denúncia)
--  Execute no Supabase do projeto Y (yqmqnczksflncvqvaicn)
-- ════════════════════════════════════════════════════════════════════════

-- ── 1) MENSAGENS PRIVADAS (DM 1:1, só texto, soft delete) ────────────────
CREATE TABLE IF NOT EXISTS public.mensagens_privadas (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  de_user_id    UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  para_user_id  UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  conteudo      TEXT NOT NULL CHECK (char_length(conteudo) > 0 AND char_length(conteudo) <= 4000),
  lida_em       TIMESTAMPTZ,
  excluida_em   TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  CHECK (de_user_id <> para_user_id)
);

-- Índice para buscar conversas entre 2 users em qualquer ordem.
-- Usa LEAST/GREATEST como par canônico — IMMUTABLE, ok pra índice.
CREATE INDEX IF NOT EXISTS idx_msg_par
  ON public.mensagens_privadas(
    LEAST(de_user_id, para_user_id),
    GREATEST(de_user_id, para_user_id),
    created_at DESC
  );

-- Índice para inbox (não lidas do destinatário)
CREATE INDEX IF NOT EXISTS idx_msg_inbox
  ON public.mensagens_privadas(para_user_id, lida_em, created_at DESC);

-- ── 2) BLOQUEIOS ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.bloqueios (
  bloqueador_id  UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  bloqueado_id   UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (bloqueador_id, bloqueado_id),
  CHECK (bloqueador_id <> bloqueado_id)
);
CREATE INDEX IF NOT EXISTS idx_bloq_bloqueador ON public.bloqueios(bloqueador_id);
CREATE INDEX IF NOT EXISTS idx_bloq_bloqueado  ON public.bloqueios(bloqueado_id);

-- ── 3) DENÚNCIAS ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.denuncias (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  denunciante_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  denunciado_id      UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  mensagem_id        UUID REFERENCES public.mensagens_privadas(id) ON DELETE SET NULL,
  categoria          TEXT NOT NULL DEFAULT 'outro'
                       CHECK (categoria IN ('spam','assedio','conteudo_improprio','golpe','outro')),
  descricao          TEXT,
  status             TEXT NOT NULL DEFAULT 'aberta'
                       CHECK (status IN ('aberta','em_analise','resolvida','arquivada')),
  resolvido_por      UUID REFERENCES public.users(id) ON DELETE SET NULL,
  resolvido_em       TIMESTAMPTZ,
  created_at         TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_denuncias_status ON public.denuncias(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_denuncias_denunciado ON public.denuncias(denunciado_id);

-- ── 4) RLS deny (safety net) ─────────────────────────────────────────────
ALTER TABLE public.mensagens_privadas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bloqueios          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.denuncias          ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS msg_deny  ON public.mensagens_privadas;
DROP POLICY IF EXISTS bloq_deny ON public.bloqueios;
DROP POLICY IF EXISTS den_deny  ON public.denuncias;
CREATE POLICY msg_deny  ON public.mensagens_privadas FOR ALL USING (false);
CREATE POLICY bloq_deny ON public.bloqueios          FOR ALL USING (false);
CREATE POLICY den_deny  ON public.denuncias          FOR ALL USING (false);

SELECT pg_notify('pgrst', 'reload schema');

-- ── Verificação final (esperado: true, true, true) ───────────────────────
SELECT
  EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='mensagens_privadas') AS tem_msg,
  EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='bloqueios')          AS tem_bloq,
  EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='denuncias')          AS tem_den;

-- Rollback manual:
-- DROP TABLE IF EXISTS public.denuncias;
-- DROP TABLE IF EXISTS public.bloqueios;
-- DROP TABLE IF EXISTS public.mensagens_privadas;
