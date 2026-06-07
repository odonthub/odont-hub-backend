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
import pacientesRoutes from "./modules/pacientes/routes.js"
import anamnesesRoutes from "./modules/anamneses/routes.js"
import evolucoesRoutes from "./modules/evolucoes/routes.js"
import tratamentoRoutes from "./modules/tratamento/routes.js"
import financeiroRoutes from "./modules/financeiro/routes.js"
import agendamentosRoutes from "./modules/agendamentos/routes.js"
import seguidoresRoutes from "./modules/seguidores/routes.js"
import trabalhosRoutes from "./modules/trabalhos/routes.js"
import { initSocket } from "./socket/index.js"

const app = Fastify({ logger: true })

await app.register(rateLimit, {
  global: true,
  max: 100,
  timeWindow: '1 minute',
  errorResponseBuilder: () => ({
    error: 'Muitas requisições. Tente novamente em 1 minuto.'
  })
})

app.addHook('onSend', async (req, reply) => {
  reply.header('X-Content-Type-Options', 'nosniff')
  reply.header('X-Frame-Options', 'DENY')
  reply.header('X-XSS-Protection', '1; mode=block')
  reply.header('Referrer-Policy', 'strict-origin-when-cross-origin')
})

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

await app.register(corsPlugin)
await app.register(jwtPlugin)
await app.register(uploadPlugin)

await app.register(authRoutes, { prefix: "/api/auth" })
await app.register(userRoutes, { prefix: "/api/users" })
await app.register(feedRoutes, { prefix: "/api/feed" })
await app.register(marketRoutes, { prefix: "/api/marketplace" })
await app.register(jobRoutes, { prefix: "/api/jobs" })
await app.register(expertRoutes, { prefix: "/api/experts" })
await app.register(courseRoutes, { prefix: "/api/courses" })
await app.register(uploadRoutes, { prefix: "/api/uploads" })
await app.register(pacientesRoutes, { prefix: "/api/pacientes" })
await app.register(anamnesesRoutes, { prefix: "/api/anamneses" })
await app.register(evolucoesRoutes, { prefix: "/api/evolucoes" })
await app.register(tratamentoRoutes, { prefix: "/api" })
await app.register(financeiroRoutes, { prefix: "/api" })
await app.register(agendamentosRoutes, { prefix: "/api" })
await app.register(seguidoresRoutes,   { prefix: "/api" })
await app.register(trabalhosRoutes,    { prefix: "/api" })

app.get("/health", async () => ({ status: "ok", app: "ODONT HUB", version: "1.0.0" }))

const PORT = Number(process.env.PORT) || 3000
await app.listen({ port: PORT, host: "0.0.0.0" })

const io = new SocketIO(app.server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
})
initSocket(io)

console.log(`[ODONT HUB] API rodando na porta ${PORT} ✅`)
