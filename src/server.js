import "dotenv/config"
import Fastify from "fastify"
import { Server as SocketIO } from "socket.io"

import corsPlugin from "./plugins/cors.js"
import jwtPlugin from "./plugins/auth.js"
import uploadPlugin from "./plugins/upload.js"

import authRoutes from "./modules/auth/routes.js"
import userRoutes from "./modules/users/routes.js"
import feedRoutes from "./modules/feed/routes.js"
import marketRoutes from "./modules/marketplace/routes.js"
import jobRoutes from "./modules/jobs/routes.js"
import expertRoutes from "./modules/experts/routes.js"
import courseRoutes from "./modules/courses/routes.js"
import uploadRoutes from "./modules/uploads/routes.js"
import { initSocket } from "./socket/index.js"

const app = Fastify({ logger: false })

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

app.get("/health", async () => ({ status: "ok", app: "ODONT HUB", version: "1.0.0" }))

const PORT = Number(process.env.PORT) || 3000

await app.listen({ port: PORT, host: "0.0.0.0" })

const io = new SocketIO(app.server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
})
initSocket(io)

console.log("ODONT HUB API rodando em http://0.0.0.0:" + PORT)
