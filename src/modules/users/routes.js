// src/modules/users/routes.js
import { getProfile, getPerfilCompleto, updateProfile, uploadAvatar, uploadCover } from './controller.js'

export default async function userRoutes(app) {
  const auth = { preHandler: [app.authenticate] }
  app.get  ('/:id',        auth, getProfile)
  app.get  ('/:id/perfil', auth, getPerfilCompleto)   // FASE 3
  app.patch('/me',         auth, updateProfile)
  app.post ('/me/avatar',  auth, uploadAvatar)
  app.post ('/me/cover',   auth, uploadCover)         // FASE 3
}
