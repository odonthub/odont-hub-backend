// src/modules/auth/routes.js
import { register, login, refreshToken, forgotPassword, resetPassword, me } from './controller.js'

export default async function authRoutes(app) {
  // POST /api/auth/register
  app.post('/register', register)

  // POST /api/auth/login
  app.post('/login', login)

  // POST /api/auth/refresh
  app.post('/refresh', refreshToken)

  // POST /api/auth/forgot-password
  app.post('/forgot-password', forgotPassword)

  // POST /api/auth/reset-password
  app.post('/reset-password', resetPassword)

  // GET /api/auth/me  (rota protegida)
  app.get('/me', { preHandler: [app.authenticate] }, me)
}
