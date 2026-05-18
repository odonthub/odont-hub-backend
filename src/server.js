import "dotenv/config"
import Fastify from "fastify"
import { Server as SocketIO } from "socket.io"
import corsPlugin from "./plugins/cors.js"
import jwtPlugin from "./plugins/auth.js"
import uploadPlugin from "./plugins/upload.js"
import rateLimit from "@fastify/rate-limit"
import authRoutes from "./modules/auth/routes.js"
import userRoutes from "./modules/users/routes.js"
import feedRoutes from "./modules/feed/routes.js"
import marketRoutes from "./modules/marketplace/routes.js"
import jobRoutes from "./modules/jobs/routes.js"
import expertRoutes from "./modules/experts/routes.js"
import courseRoutes from "./modules/courses/routes.js"
import uploadRoutes from "./modules/uploads/routes.js"
import { initSocket } from "./socket/index.js"

const app = Fastify({ logger: true })

// ===== SEGURANÇA: Rate Limiting Global =====
await app.register(rateLimit, {
  global: true,
  max: 100,
  timeWindow: '1 minute',
  errorResponseBuilder: () => ({
    error: 'Muitas requisições. Tente novamente em 1 minuto.'
  })
})

// ===== SEGURANÇA: Headers de proteção =====
app.addHook('onSend', async (req, reply) => {
  reply.header('X-Content-Type-Options', 'nosniff')
  reply.header('X-Frame-Options', 'DENY')
  reply.header('X-XSS-Protection', '1; mode=block')
  reply.header('Referrer-Policy', 'strict-origin-when-cross-origin')
})

// ===== SEGURANÇA: Sanitização de inputs =====
app.addHook('preHandler', async (req) => {
  if (req.body && typeof req.body === 'object') {
    const sanitize = (obj) => {
      Object.keys(obj).forEach(k => {
        if (typeof obj[k] === 'string') {
          obj[k] = obj[k]
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/javascript:/gi, '')
            .trim()
            .substring(0, 10000)
        } else if (obj[k] && typeof obj[k] === 'object') {
          sanitize(obj[k])
        }
      })
    }
    sanitize(req.body)
  }
})

// ===== SEGURANÇA: Log de tentativas suspeitas =====
app.addHook('preHandler', async (req) => {
  const suspicious = ['<script', 'javascript:', '../', 'DROP TABLE', 'UNION SELECT']
  const body = JSON.stringify(req.body || '')
  const found = suspicious.find(s => body.toUpperCase().includes(s.toUpperCase()))
  if (found) {
    app.log.warn(`[SECURITY] Padrão suspeito "${found}" de IP ${req.ip} em ${req.url}`)
  }
})

await app.register(corsPlugin)
await app.register(jwtPlugin)
await app.register(uploadPlugin)

// Rate limit extra no login
await app.register(authRoutes, {
  prefix: "/api/auth",
  rateLimit: { max: 10, timeWindow: '15 minutes' }
})

await app.register(userRoutes, { prefix: "/api/users" })
await app.register(feedRoutes, { prefix: "/api/feed" })
await app.register(marketRoutes, { prefix: "/api/marketplace" })
await app.register(jobRoutes, { prefix: "/api/jobs" })
await app.register(expertRoutes, { prefix: "/api/experts" })
await app.register(courseRoutes, { prefix: "/api/courses" })
await app.register(uploadRoutes, { prefix: "/api/uploads" })

app.get("/health", async () => ({ status: "ok", app: "ODONT HUB", version: "1.0.0" }))

const PORT = Number(process.env.PORT) || 3000
await app.listen({ port: PORT, host: "0.0.0.0" })

const io = new SocketIO(app.server, {
  cors: { origin: process.env.FRONTEND_URL || "https://odonthub.com.br", methods: ["GET", "POST"] }
})
initSocket(io)
console.log(`[ODONT HUB] API segura rodando na porta ${PORT} ✅`)
