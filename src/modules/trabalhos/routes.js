// src/modules/trabalhos/routes.js
// FASE 3 — Trabalhos (feed pessoal de fotos)
// Registrado em server.js com prefix "/api" — paths abaixo são absolutos.
import { listar, criar, excluir } from './controller.js'

export default async function trabalhosRoutes(app) {
  const auth = { preHandler: [app.authenticate] }
  app.get   ('/users/:id/trabalhos',    auth, listar)
  app.post  ('/users/me/trabalhos',     auth, criar)
  app.delete('/users/me/trabalhos/:id', auth, excluir)
}
