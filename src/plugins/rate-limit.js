// src/plugins/rate-limit.js
import rateLimit from '@fastify/rate-limit'
import fp from 'fastify-plugin'
import { redis } from '../config/redis.js'

export default fp(async (app) => {
  await app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
    redis,
    keyGenerator: (req) => req.user?.id || req.ip,
    errorResponseBuilder: () => ({
      error: 'Muitas requisições. Aguarde 1 minuto.',
    }),
  })
})
