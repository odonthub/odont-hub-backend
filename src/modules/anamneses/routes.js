// src/modules/anamneses/routes.js
// FASE 2A — Anamnese (1 por paciente)
import { porPaciente, salvar } from './controller.js'

export default async function anamnesesRoutes(app) {
  const auth = { preHandler: [app.authenticate] }
  app.get('/paciente/:pacienteId', auth, porPaciente)
  app.put('/paciente/:pacienteId', auth, salvar)
}
