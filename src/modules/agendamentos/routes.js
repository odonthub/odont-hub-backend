// src/modules/agendamentos/routes.js
// FASE 2D — Agendamentos
// Registrado em server.js com prefix "/api" — paths abaixo são absolutos.
import { listarDoPaciente, criar, listarDaClinica, editar, confirmar, cancelar, realizar, faltar, excluir } from './controller.js'

export default async function agendamentosRoutes(app) {
  const auth = { preHandler: [app.authenticate] }

  // Por paciente
  app.get ('/pacientes/:pacienteId/agendamentos', auth, listarDoPaciente)
  app.post('/pacientes/:pacienteId/agendamentos', auth, criar)

  // Lista da clínica (calendário)
  app.get ('/agendamentos', auth, listarDaClinica)

  // Por agendamento
  app.put   ('/agendamentos/:id',           auth, editar)
  app.post  ('/agendamentos/:id/confirmar', auth, confirmar)
  app.post  ('/agendamentos/:id/cancelar',  auth, cancelar)
  app.post  ('/agendamentos/:id/realizar',  auth, realizar)
  app.post  ('/agendamentos/:id/faltar',    auth, faltar)
  app.delete('/agendamentos/:id',           auth, excluir)
}
