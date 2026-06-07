// src/modules/financeiro/routes.js
// FASE 2C — Financeiro do paciente
// Registrado em server.js com prefix "/api" — paths abaixo são absolutos.
import { listar, criar, parcelar, editar, marcarPago, marcarPendente, excluir } from './controller.js'

export default async function financeiroRoutes(app) {
  const auth = { preHandler: [app.authenticate] }

  // Por paciente
  app.get ('/pacientes/:pacienteId/financeiro',          auth, listar)
  app.post('/pacientes/:pacienteId/financeiro',          auth, criar)
  app.post('/pacientes/:pacienteId/financeiro/parcelar', auth, parcelar)

  // Por lançamento
  app.put   ('/financeiro/:id',                 auth, editar)
  app.post  ('/financeiro/:id/marcar-pago',     auth, marcarPago)
  app.post  ('/financeiro/:id/marcar-pendente', auth, marcarPendente)
  app.delete('/financeiro/:id',                 auth, excluir)
}
