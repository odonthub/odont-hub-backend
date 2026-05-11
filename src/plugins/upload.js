// src/plugins/upload.js
import multipart from '@fastify/multipart'
import fp from 'fastify-plugin'

export default fp(async (app) => {
  await app.register(multipart, {
    limits: {
      fileSize: 200 * 1024 * 1024, // 200MB max
      files: 10,
    },
  })
})
