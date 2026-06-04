// src/modules/evolucoes/routes.js
// FASE 2A — Evoluções clínicas (linha do tempo)
import { listar, criar, editar, excluir } from './controller.js'

export default async function evolucoesRoutes(app) {
  const auth = { preHandler: [app.authenticate] }
  app.get   ('/paciente/:pacienteId', auth, listar)
  app.post  ('/paciente/:pacienteId', auth, criar)
  app.put   ('/:id',                  auth, editar)
  app.delete('/:id',                  auth, excluir)
}
