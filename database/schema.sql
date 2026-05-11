-- ══════════════════════════════════════════════════════════════════════════
--  ODONT HUB — Schema Completo do Banco de Dados
--  Execute no Supabase: Dashboard → SQL Editor → New Query → Run
-- ══════════════════════════════════════════════════════════════════════════

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";   -- busca full-text
CREATE EXTENSION IF NOT EXISTS "unaccent";  -- busca sem acento

-- ── ENUM types ─────────────────────────────────────────────────────────────
CREATE TYPE plan_type       AS ENUM ('free', 'pro', 'clinic');
CREATE TYPE contract_type   AS ENUM ('clt', 'pj', 'production', 'partnership');
CREATE TYPE condition_type  AS ENUM ('new', 'used', 'refurbished');
CREATE TYPE listing_status  AS ENUM ('active', 'sold', 'reserved', 'inactive');
CREATE TYPE job_status      AS ENUM ('open', 'closed', 'paused');
CREATE TYPE app_status      AS ENUM ('pending', 'viewed', 'accepted', 'rejected');
CREATE TYPE chat_type       AS ENUM ('marketplace', 'expert');
CREATE TYPE msg_type        AS ENUM ('text', 'image', 'video', 'document');
CREATE TYPE modality_type   AS ENUM ('in_person', 'online', 'hybrid');
CREATE TYPE course_status   AS ENUM ('active', 'cancelled', 'completed');

-- ══════════════════════════════════════════════════════════════════════════
--  USERS
-- ══════════════════════════════════════════════════════════════════════════
CREATE TABLE users (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name           TEXT NOT NULL,
  email          TEXT NOT NULL UNIQUE,
  password_hash  TEXT NOT NULL,
  phone          TEXT,
  bio            TEXT,
  specialty      TEXT,
  cro            TEXT,
  cro_uf         CHAR(2),
  cro_validated  BOOLEAN DEFAULT FALSE,
  avatar_url     TEXT,
  plan           plan_type DEFAULT 'free',
  city           TEXT,
  state          CHAR(2),
  last_seen      TIMESTAMPTZ DEFAULT NOW(),
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email     ON users(email);
CREATE INDEX idx_users_specialty ON users(specialty);
CREATE INDEX idx_users_cro       ON users(cro);

-- ══════════════════════════════════════════════════════════════════════════
--  FEED — Posts, Mídias, Likes, Comentários
-- ══════════════════════════════════════════════════════════════════════════
CREATE TABLE posts (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content       TEXT NOT NULL CHECK (char_length(content) <= 5000),
  specialty_tag TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created ON posts(created_at DESC);
CREATE INDEX idx_posts_specialty ON posts(specialty_tag);
CREATE INDEX idx_posts_content_fts ON posts USING gin(to_tsvector('portuguese', content));

CREATE TABLE post_media (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id     UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  type        TEXT NOT NULL CHECK (type IN ('image','video','document')),
  order_index INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE post_likes (
  post_id    UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (post_id, user_id)
);

CREATE TABLE post_comments (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id    UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  parent_id  UUID REFERENCES post_comments(id) ON DELETE CASCADE,
  content    TEXT NOT NULL CHECK (char_length(content) <= 2000),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_comments_post_id ON post_comments(post_id);

-- ══════════════════════════════════════════════════════════════════════════
--  MARKETPLACE
-- ══════════════════════════════════════════════════════════════════════════
CREATE TABLE marketplace_listings (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  price       NUMERIC(12,2) NOT NULL,
  category    TEXT NOT NULL,
  condition   condition_type NOT NULL,
  city        TEXT,
  state       CHAR(2),
  status      listing_status DEFAULT 'active',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_listings_user    ON marketplace_listings(user_id);
CREATE INDEX idx_listings_status  ON marketplace_listings(status);
CREATE INDEX idx_listings_state   ON marketplace_listings(state);
CREATE INDEX idx_listings_cat     ON marketplace_listings(category);
CREATE INDEX idx_listings_fts     ON marketplace_listings USING gin(to_tsvector('portuguese', title || ' ' || COALESCE(description,'')));

CREATE TABLE listing_images (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id  UUID NOT NULL REFERENCES marketplace_listings(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  order_index INTEGER DEFAULT 0
);

-- ══════════════════════════════════════════════════════════════════════════
--  VAGAS & OPORTUNIDADES
-- ══════════════════════════════════════════════════════════════════════════
CREATE TABLE job_listings (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  description   TEXT,
  specialty     TEXT NOT NULL,
  role_type     TEXT NOT NULL,   -- dentist, asb, usg, prosthetist, receptionist
  contract_type contract_type NOT NULL,
  salary_info   TEXT,
  requirements  TEXT,
  city          TEXT,
  state         CHAR(2),
  status        job_status DEFAULT 'open',
  expires_at    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_jobs_specialty ON job_listings(specialty);
CREATE INDEX idx_jobs_status    ON job_listings(status);
CREATE INDEX idx_jobs_state     ON job_listings(state);
CREATE INDEX idx_jobs_role      ON job_listings(role_type);

CREATE TABLE job_applications (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id       UUID NOT NULL REFERENCES job_listings(id) ON DELETE CASCADE,
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cover_letter TEXT,
  resume_url   TEXT,
  status       app_status DEFAULT 'pending',
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(job_id, user_id)
);

CREATE TABLE available_profiles (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  specialty     TEXT NOT NULL,
  contract_type contract_type,
  bio           TEXT,
  resume_url    TEXT,
  city          TEXT,
  state         CHAR(2),
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ══════════════════════════════════════════════════════════════════════════
--  ESPECIALISTAS (Ajuda do Especialista)
-- ══════════════════════════════════════════════════════════════════════════
CREATE TABLE experts (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  specialty   TEXT NOT NULL,
  description TEXT,
  rating      NUMERIC(3,2) DEFAULT 5.0,
  total_consultations INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_experts_specialty ON experts(specialty);
CREATE INDEX idx_experts_rating    ON experts(rating DESC);

-- ══════════════════════════════════════════════════════════════════════════
--  CHAT — Salas e Mensagens (Marketplace + Especialistas)
-- ══════════════════════════════════════════════════════════════════════════
CREATE TABLE chat_rooms (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type           chat_type NOT NULL,
  -- Marketplace
  listing_id     UUID REFERENCES marketplace_listings(id) ON DELETE SET NULL,
  seller_id      UUID REFERENCES users(id) ON DELETE SET NULL,
  buyer_id       UUID REFERENCES users(id) ON DELETE SET NULL,
  -- Especialistas
  expert_id      UUID REFERENCES experts(id) ON DELETE SET NULL,
  expert_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  patient_id     UUID REFERENCES users(id) ON DELETE SET NULL,
  -- Geral
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE chat_messages (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id    UUID NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
  sender_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content    TEXT,
  type       msg_type DEFAULT 'text',
  file_url   TEXT,
  read_at    TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_room ON chat_messages(room_id, created_at DESC);

-- ══════════════════════════════════════════════════════════════════════════
--  CURSOS
-- ══════════════════════════════════════════════════════════════════════════
CREATE TABLE courses (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  description  TEXT,
  specialty    TEXT NOT NULL,
  modality     modality_type NOT NULL,
  hours        INTEGER,
  price        NUMERIC(12,2) DEFAULT 0,
  city         TEXT,
  state        CHAR(2),
  start_date   DATE,
  max_students INTEGER,
  cover_url    TEXT,
  status       course_status DEFAULT 'active',
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_courses_specialty ON courses(specialty);
CREATE INDEX idx_courses_status    ON courses(status);
CREATE INDEX idx_courses_modality  ON courses(modality);

CREATE TABLE course_enrollments (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id  UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status     TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(course_id, user_id)
);

-- ══════════════════════════════════════════════════════════════════════════
--  NOTIFICAÇÕES
-- ══════════════════════════════════════════════════════════════════════════
CREATE TABLE notifications (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type       TEXT NOT NULL,  -- like, comment, message, job_apply, etc.
  title      TEXT NOT NULL,
  body       TEXT,
  data       JSONB,
  read_at    TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notif_user   ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notif_unread ON notifications(user_id) WHERE read_at IS NULL;

-- ══════════════════════════════════════════════════════════════════════════
--  ROW LEVEL SECURITY (RLS) — Supabase
--  Garante que cada usuário só acesse seus próprios dados sensíveis
-- ══════════════════════════════════════════════════════════════════════════
ALTER TABLE users            ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications    ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages    ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- Usuários só veem suas próprias notificações
CREATE POLICY "notif_own" ON notifications
  FOR ALL USING (user_id = auth.uid());

-- Usuários só enviam/recebem mensagens de salas que participam
CREATE POLICY "msg_room_access" ON chat_messages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM chat_rooms r WHERE r.id = room_id
      AND (r.buyer_id = auth.uid() OR r.seller_id = auth.uid()
        OR r.patient_id = auth.uid() OR r.expert_user_id = auth.uid())
    )
  );

-- Candidaturas: só o candidato e o criador da vaga
CREATE POLICY "app_own" ON job_applications
  FOR ALL USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM job_listings j WHERE j.id = job_id AND j.user_id = auth.uid())
  );

-- ══════════════════════════════════════════════════════════════════════════
--  TRIGGER: atualiza updated_at automaticamente
-- ══════════════════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_upd        BEFORE UPDATE ON users            FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_posts_upd        BEFORE UPDATE ON posts            FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_listings_upd     BEFORE UPDATE ON marketplace_listings FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_jobs_upd         BEFORE UPDATE ON job_listings      FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_courses_upd      BEFORE UPDATE ON courses           FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_rooms_upd        BEFORE UPDATE ON chat_rooms        FOR EACH ROW EXECUTE FUNCTION update_updated_at();
