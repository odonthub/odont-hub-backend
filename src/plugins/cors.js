// src/plugins/cors.js
import cors from '@fastify/cors'
import fp from 'fastify-plugin'

export default fp(async (app) => {
  await app.register(cors, {
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      /\.odont-hub\.com\.br$/,
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
})
