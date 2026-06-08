// src/modules/mensagens/routes.js
// FASE 4 — Chat privado + bloqueio + denúncia
// Registrado em server.js com prefix "/api" — paths abaixo são absolutos.
import {
  listarConversas, historico, enviar, marcarLidas, excluir, naoLidasTotal,
  bloquear, desbloquear, meusBloqueados, denunciar
} from './controller.js'

export default async function mensagensRoutes(app) {
  const auth = { preHandler: [app.authenticate] }

  // Conversas / chat
  app.get   ('/mensagens/conversas',         auth, listarConversas)
  app.get   ('/mensagens/nao-lidas',         auth, naoLidasTotal)
  app.get   ('/mensagens/com/:userId',       auth, historico)
  app.post  ('/mensagens/com/:userId',       auth, enviar)
  app.post  ('/mensagens/com/:userId/ler',   auth, marcarLidas)
  app.delete('/mensagens/:id',               auth, excluir)

  // Bloqueio
  app.post  ('/usuarios/:id/bloquear',       auth, bloquear)
  app.delete('/usuarios/:id/bloquear',       auth, desbloquear)
  app.get   ('/usuarios/me/bloqueados',      auth, meusBloqueados)

  // Denúncia
  app.post  ('/denuncias',                   auth, denunciar)
}
