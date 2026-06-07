// src/modules/seguidores/routes.js
// FASE 3 — Seguidores
// Registrado em server.js com prefix "/api" — paths abaixo são absolutos.
import { seguir, desseguir, listarSeguidores, listarSeguindo } from './controller.js'

export default async function seguidoresRoutes(app) {
  const auth = { preHandler: [app.authenticate] }
  app.post  ('/users/:id/seguir',     auth, seguir)
  app.delete('/users/:id/seguir',     auth, desseguir)
  app.get   ('/users/:id/seguidores', auth, listarSeguidores)
  app.get   ('/users/:id/seguindo',   auth, listarSeguindo)
}
