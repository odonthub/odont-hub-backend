// src/modules/pacientes/routes.js
// FASE 1 — Cadastro de pacientes (multi-clínica)
import { listar, detalhe, criar, editar, inativar } from './controller.js'

export default async function pacientesRoutes(app) {
  const auth = { preHandler: [app.authenticate] }
  app.get   ('/',     auth, listar)
  app.get   ('/:id',  auth, detalhe)
  app.post  ('/',     auth, criar)
  app.put   ('/:id',  auth, editar)
  app.delete('/:id',  auth, inativar)
}
