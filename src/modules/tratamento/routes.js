// src/modules/tratamento/routes.js
// FASE 2B — Plano de tratamento
// Registrado em server.js com prefix "/api" — paths abaixo são absolutos.
import { listar, criar, editar, aprovar, reabrir, excluir } from './controller.js'

export default async function tratamentoRoutes(app) {
  const auth = { preHandler: [app.authenticate] }

  // Paciente
  app.get  ('/pacientes/:pacienteId/tratamento', auth, listar)
  app.post ('/pacientes/:pacienteId/tratamento', auth, criar)

  // Opção
  app.put   ('/tratamento/opcoes/:opcaoId',          auth, editar)
  app.post  ('/tratamento/opcoes/:opcaoId/aprovar',  auth, aprovar)
  app.post  ('/tratamento/opcoes/:opcaoId/reabrir',  auth, reabrir)
  app.delete('/tratamento/opcoes/:opcaoId',          auth, excluir)
}
