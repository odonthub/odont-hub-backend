// src/plugins/auth.js
import jwt from '@fastify/jwt'
import fp from 'fastify-plugin'

export default fp(async (app) => {
  await app.register(jwt, {
    secret: process.env.JWT_SECRET,
    sign: { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
  })

  // Decorator: protege rotas com autenticação
  app.decorate('authenticate', async (request, reply) => {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.code(401).send({ error: 'Token inválido ou expirado. Faça login novamente.' })
    }
  })

  // Decorator: verifica CRO validado (dentistas)
  app.decorate('requireCro', async (request, reply) => {
    await request.jwtVerify()
    if (!request.user.cro_validated) {
      reply.code(403).send({ error: 'CRO não validado. Complete seu cadastro.' })
    }
  })
})
