// src/modules/uploads/controller.js
import { storage } from '../../config/storage.js'

export async function uploadImage(request, reply) {
  const file = await request.file()
  if (!file) return reply.code(400).send({ error: 'Nenhum arquivo enviado.' })
  const { folder = 'posts' } = request.query
  const buffer = await file.toBuffer()
  const url = await storage.uploadImage(buffer, file.mimetype, folder)
  return reply.send({ url })
}

export async function uploadVideo(request, reply) {
  const file = await request.file()
  if (!file) return reply.code(400).send({ error: 'Nenhum arquivo enviado.' })
  const buffer = await file.toBuffer()
  const url = await storage.uploadVideo(buffer, file.mimetype)
  return reply.send({ url })
}

export async function uploadDocument(request, reply) {
  const file = await request.file()
  if (!file) return reply.code(400).send({ error: 'Nenhum arquivo enviado.' })
  const { folder = 'documents' } = request.query
  const buffer = await file.toBuffer()
  const url = await storage.uploadDocument(buffer, file.mimetype, folder)
  return reply.send({ url })
}
