// src/modules/users/routes.js
import { getProfile, updateProfile, uploadAvatar } from './controller.js'

export default async function userRoutes(app) {
  const auth = { preHandler: [app.authenticate] }
  app.get('/:id',        auth, getProfile)
  app.patch('/me',       auth, updateProfile)
  app.post('/me/avatar', auth, uploadAvatar)
}
