-- database/seed.sql — Dados de exemplo para desenvolvimento
-- Execute APÓS o schema.sql

-- Usuários de teste (senha: senha123)
INSERT INTO users (id, name, email, password_hash, specialty, cro, cro_uf, cro_validated, plan) VALUES
  ('11111111-0000-0000-0000-000000000001', 'Dr. Carlos Mendes',   'carlos@odont.com',  '$2b$12$xamplehash1', 'Implantodontia',      'SP-12345', 'SP', TRUE,  'pro'),
  ('11111111-0000-0000-0000-000000000002', 'Dra. Ana Pereira',    'ana@odont.com',     '$2b$12$xamplehash2', 'Implantodontia',      'RJ-54321', 'RJ', TRUE,  'free'),
  ('11111111-0000-0000-0000-000000000003', 'Dr. Felipe Santos',   'felipe@odont.com',  '$2b$12$xamplehash3', 'Endodontia',          'MG-98765', 'MG', TRUE,  'free'),
  ('11111111-0000-0000-0000-000000000004', 'Dra. Renata Barbosa', 'renata@odont.com',  '$2b$12$xamplehash4', 'Ortodontia',          'SP-77432', 'SP', TRUE,  'free'),
  ('11111111-0000-0000-0000-000000000005', 'Dr. João Figueiredo', 'joao@odont.com',    '$2b$12$xamplehash5', 'Implantodontia',      'SP-11234', 'SP', TRUE,  'pro');

-- Especialistas
INSERT INTO experts (id, user_id, specialty, description, rating, total_consultations, is_verified, is_active) VALUES
  (uuid_generate_v4(), '11111111-0000-0000-0000-000000000005', 'Implantodontia',  'Especialista em implantes imediatos e All-on-4', 4.9, 128, TRUE, TRUE),
  (uuid_generate_v4(), '11111111-0000-0000-0000-000000000004', 'Ortodontia',      'Especialista em alinhadores e aparelhos fixos',  4.8, 94,  TRUE, TRUE),
  (uuid_generate_v4(), '11111111-0000-0000-0000-000000000003', 'Endodontia',      'Especialista em retratamentos complexos',         5.0, 211, TRUE, TRUE);

-- Posts
INSERT INTO posts (id, user_id, content, specialty_tag) VALUES
  (uuid_generate_v4(), '11111111-0000-0000-0000-000000000002',
   'Reabilitação total com protocolo All-on-4 finalizada! Prótese fixada com torque de 35N em implantes Straumann BL. Quem já trabalhou com esse sistema?',
   'Implantodontia'),
  (uuid_generate_v4(), '11111111-0000-0000-0000-000000000003',
   'Alguém tem experiência com instrumentação reciprocante WaveOne Gold vs Reciproc Blue? Migrando de rotatória e quero opiniões.',
   'Endodontia');

-- Vagas
INSERT INTO job_listings (id, user_id, title, description, specialty, role_type, contract_type, salary_info, city, state) VALUES
  (uuid_generate_v4(), '11111111-0000-0000-0000-000000000001',
   'Ortodontista — CLT ou PJ', 'Buscamos ortodontista para nossa equipe. Espaço moderno com scanner intraoral.',
   'Ortodontia', 'dentist', 'clt', 'A combinar', 'São Paulo', 'SP'),
  (uuid_generate_v4(), '11111111-0000-0000-0000-000000000001',
   'Auxiliar em Saúde Bucal (ASB)', 'Vaga para ASB com certificado SENAC. CLT, benefícios completos.',
   'Geral', 'asb', 'clt', 'R$ 2.100 – R$ 2.600', 'Campinas', 'SP');

-- Marketplace
INSERT INTO marketplace_listings (id, user_id, title, description, price, category, condition, city, state) VALUES
  (uuid_generate_v4(), '11111111-0000-0000-0000-000000000002',
   'Ultrassom Cavitron Dentsply', 'Em excelente estado, pouco uso.', 2800, 'Equipamentos', 'used', 'São Paulo', 'SP'),
  (uuid_generate_v4(), '11111111-0000-0000-0000-000000000004',
   'Compressor sem óleo NSK', 'Novo na caixa, nunca usado.', 1200, 'Equipamentos', 'new', 'Rio de Janeiro', 'RJ');

-- Cursos
INSERT INTO courses (id, user_id, title, description, specialty, modality, hours, price, city, state) VALUES
  (uuid_generate_v4(), '11111111-0000-0000-0000-000000000005',
   'Implantes Imediatos — Protocolo Avançado', 'Curso prático com pacientes reais.', 'Implantodontia', 'in_person', 12, 1800, 'São Paulo', 'SP'),
  (uuid_generate_v4(), '11111111-0000-0000-0000-000000000004',
   'Alinhadores Invisíveis do Zero ao Avançado', 'Online ao vivo + gravado.', 'Ortodontia', 'online', 20, 950, NULL, NULL);
