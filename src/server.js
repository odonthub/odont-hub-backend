// src/server.js — Servidor principal ODONT HUB
import 'dotenv/config'
import Fastify from 'fastify'
import { createServer } from 'http'
import { Server as SocketIO } from 'socket.io'

import corsPlugin    from './plugins/cors.js'
import jwtPlugin     from './plugins/auth.js'
import rateLimitPlugin from './plugins/rate-limit.js'
import uploadPlugin  from './plugins/upload.js'

import authRoutes       from './modules/auth/routes.js'
import userRoutes       from './modules/users/routes.js'
import feedRoutes       from './modules/feed/routes.js'
import marketRoutes     from './modules/marketplace/routes.js'
import jobRoutes        from './modules/jobs/routes.js'
import expertRoutes     from './modules/experts/routes.js'
import courseRoutes     from './modules/courses/routes.js'
import uploadRoutes     from './modules/uploads/routes.js'

import { initSocket }   from './socket/index.js'

const app = Fastify({
  logger: {
    transport: process.env.NODE_ENV === 'development'
      ? { target: 'pino-pretty', options: { colorize: true } }
      : undefined,
  },
})

// ── Plugins globais ────────────────────────────────────────────────────────
await app.register(corsPlugin)
await app.register(jwtPlugin)
await app.register(rateLimitPlugin)
await app.register(uploadPlugin)

// ── Rotas ──────────────────────────────────────────────────────────────────
await app.register(authRoutes,    { prefix: '/api/auth' })
await app.register(userRoutes,    { prefix: '/api/users' })
await app.register(feedRoutes,    { prefix: '/api/feed' })
await app.register(marketRoutes,  { prefix: '/api/marketplace' })
await app.register(jobRoutes,     { prefix: '/api/jobs' })
await app.register(expertRoutes,  { prefix: '/api/experts' })
await app.register(courseRoutes,  { prefix: '/api/courses' })
await app.register(uploadRoutes,  { prefix: '/api/uploads' })

// ── Health check ───────────────────────────────────────────────────────────
app.get('/health', async () => ({ status: 'ok', app: 'ODONT HUB', version: '1.0.0' }))

// ── HTTP server + Socket.io ────────────────────────────────────────────────
const httpServer = createServer(app.server)

const io = new SocketIO(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})

initSocket(io)

// ── Start ──────────────────────────────────────────────────────────────────
const PORT = Number(process.env.PORT) || 3000

try {
  await app.ready()
  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`\n🦷 ODONT HUB API rodando em http://localhost:${PORT}`)
    console.log(`📡 Socket.io ativo`)
    console.log(`🌿 Ambiente: ${process.env.NODE_ENV}\n`)
  })
} catch (err) {
  app.log.error(err)
  process.exit(1)
}
