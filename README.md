# 🦷 ODONT HUB — Backend

API REST + WebSocket para o ecossistema ODONT HUB.

---

## ⚡ Como rodar em 10 passos

### 1. Instalar Node.js 20+
Baixe em https://nodejs.org → versão LTS

### 2. Criar conta no Supabase (banco de dados)
1. Acesse https://supabase.com → "Start for free"
2. Crie um novo projeto (guarde a senha do banco)
3. Vá em **Settings → API** e copie:
   - `Project URL` → `SUPABASE_URL`
   - `anon public` → `SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_KEY`
4. Vá em **SQL Editor → New Query**
5. Copie e execute o conteúdo de `database/schema.sql`
6. (Opcional) Execute `database/seed.sql` para dados de teste

### 3. Criar banco Redis no Upstash
1. Acesse https://upstash.com → "Create Database"
2. Escolha Redis → tipo "Regional" → região São Paulo
3. Copie a `REDIS_URL` (começa com `rediss://`)

### 4. Criar bucket no Cloudflare R2
1. Acesse https://dash.cloudflare.com → R2
2. Crie um bucket chamado `odont-hub-media`
3. Vá em **R2 → Manage R2 API tokens** e crie um token com permissão de leitura e escrita
4. Copie Account ID, Access Key e Secret Key

### 5. Criar API key no Resend (e-mails)
1. Acesse https://resend.com → "Add API Key"
2. Copie a chave `re_...`

### 6. Clonar e instalar dependências
```bash
git clone <seu-repositorio>
cd odont-hub-backend
npm install
```

### 7. Configurar variáveis de ambiente
```bash
cp .env.example .env
# Edite o .env com seus valores reais
```

### 8. Rodar em desenvolvimento
```bash
npm run dev
```
API disponível em: http://localhost:3000

### 9. Verificar saúde da API
```bash
curl http://localhost:3000/health
# Resposta: {"status":"ok","app":"ODONT HUB","version":"1.0.0"}
```

### 10. Conectar o frontend
No projeto frontend, configure a URL base da API:
```
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```

---

## 📡 Endpoints disponíveis

### Autenticação
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/auth/register` | Criar conta |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Renovar token |
| POST | `/api/auth/forgot-password` | Esqueci a senha |
| POST | `/api/auth/reset-password` | Redefinir senha |
| GET  | `/api/auth/me` | Dados do usuário logado |

### Usuários
| Método | Rota | Descrição |
|--------|------|-----------|
| GET   | `/api/users/:id` | Ver perfil |
| PATCH | `/api/users/me` | Editar perfil |
| POST  | `/api/users/me/avatar` | Upload de foto |

### Feed / Comunidade
| Método | Rota | Descrição |
|--------|------|-----------|
| GET    | `/api/feed` | Listar posts (paginado) |
| POST   | `/api/feed` | Criar post |
| DELETE | `/api/feed/:id` | Deletar post |
| POST   | `/api/feed/:id/like` | Curtir |
| DELETE | `/api/feed/:id/like` | Descurtir |
| GET    | `/api/feed/:id/comments` | Comentários |
| POST   | `/api/feed/:id/comments` | Comentar |
| DELETE | `/api/feed/comments/:id` | Apagar comentário |

### Marketplace
| Método | Rota | Descrição |
|--------|------|-----------|
| GET    | `/api/marketplace` | Listar anúncios |
| GET    | `/api/marketplace/:id` | Ver anúncio |
| POST   | `/api/marketplace` | Criar anúncio |
| PATCH  | `/api/marketplace/:id` | Editar anúncio |
| DELETE | `/api/marketplace/:id` | Remover anúncio |
| POST   | `/api/marketplace/:id/interest` | Iniciar chat |
| GET    | `/api/marketplace/conversations/me` | Minhas conversas |

### Vagas
| Método | Rota | Descrição |
|--------|------|-----------|
| GET    | `/api/jobs` | Listar vagas |
| GET    | `/api/jobs/:id` | Ver vaga |
| POST   | `/api/jobs` | Publicar vaga |
| PATCH  | `/api/jobs/:id` | Editar vaga |
| DELETE | `/api/jobs/:id` | Remover vaga |
| POST   | `/api/jobs/:id/apply` | Candidatar |
| GET    | `/api/jobs/applications/me` | Minhas candidaturas |
| GET    | `/api/jobs/profiles/available` | Perfis disponíveis |
| POST   | `/api/jobs/profiles/me` | Criar perfil disponível |
| PATCH  | `/api/jobs/profiles/me` | Editar perfil |

### Ajuda do Especialista
| Método | Rota | Descrição |
|--------|------|-----------|
| GET    | `/api/experts` | Listar especialistas |
| GET    | `/api/experts/:id` | Ver especialista |
| POST   | `/api/experts/:id/consult` | Iniciar consulta (chat) |
| GET    | `/api/experts/:id/whatsapp` | Link do WhatsApp |

### Cursos
| Método | Rota | Descrição |
|--------|------|-----------|
| GET    | `/api/courses` | Listar cursos |
| GET    | `/api/courses/:id` | Ver curso |
| POST   | `/api/courses` | Publicar curso |
| PATCH  | `/api/courses/:id` | Editar curso |
| DELETE | `/api/courses/:id` | Remover curso |
| POST   | `/api/courses/:id/enroll` | Inscrever-se |

### Uploads
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/uploads/image` | Upload de foto |
| POST | `/api/uploads/video` | Upload de vídeo |
| POST | `/api/uploads/document` | Upload de PDF |

---

## 🔌 Socket.io — Eventos do Chat

### Frontend envia:
| Evento | Payload | Descrição |
|--------|---------|-----------|
| `room:join` | `{ roomId }` | Entrar na sala |
| `room:leave` | `{ roomId }` | Sair da sala |
| `message:send` | `{ roomId, content, type?, file_url? }` | Enviar mensagem |
| `message:typing` | `{ roomId }` | Iniciou a digitar |
| `message:stop_typing` | `{ roomId }` | Parou de digitar |

### Backend emite:
| Evento | Payload | Descrição |
|--------|---------|-----------|
| `room:history` | `[messages]` | Histórico ao entrar na sala |
| `message:new` | `message` | Nova mensagem recebida |
| `message:typing` | `{ userId, userName }` | Alguém digitando |
| `message:stop_typing` | `{ userId }` | Parou de digitar |
| `user:online` | `{ userId }` | Usuário ficou online |
| `user:offline` | `{ userId }` | Usuário desconectou |

---

## 🚀 Deploy em produção (Railway)

1. Acesse https://railway.app → "New Project"
2. Conecte seu repositório GitHub
3. Em **Variables**, cole todas as variáveis do `.env`
4. Railway faz o deploy automaticamente
5. Copie a URL gerada (ex: `https://odont-hub.up.railway.app`)
6. Atualize `FRONTEND_URL` no `.env` do Railway

---

## 🗂️ Estrutura do projeto

```
odont-hub-backend/
├── src/
│   ├── server.js              # Entrada principal
│   ├── config/
│   │   ├── database.js        # Supabase
│   │   ├── redis.js           # Upstash Redis
│   │   └── storage.js         # Cloudflare R2
│   ├── plugins/
│   │   ├── auth.js            # JWT
│   │   ├── cors.js            # CORS
│   │   ├── rate-limit.js      # Rate limiting
│   │   └── upload.js          # Multipart
│   ├── modules/
│   │   ├── auth/              # Login, registro, CRO
│   │   ├── users/             # Perfis
│   │   ├── feed/              # Posts, likes, comentários
│   │   ├── marketplace/       # Anúncios, chat privado
│   │   ├── jobs/              # Vagas, candidaturas
│   │   ├── experts/           # Especialistas, consultas
│   │   ├── courses/           # Cursos
│   │   └── uploads/           # Upload de mídia
│   └── socket/
│       └── index.js           # Chat em tempo real
├── database/
│   ├── schema.sql             # Estrutura do banco
│   └── seed.sql               # Dados de exemplo
├── .env.example               # Variáveis necessárias
├── package.json
└── README.md
```
