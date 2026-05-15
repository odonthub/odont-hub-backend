import { uploadImage } from '../../config/cloudinary.js'

export default async function uploadsRoutes(fastify) {
  fastify.post('/image', {
    onRequest: [fastify.authenticate],
    handler: async (request, reply) => {
      const data = await request.file()
      if (!data) return reply.status(400).send({ error: 'Nenhum arquivo enviado' })

      const buffer = await data.toBuffer()
      const result = await uploadImage(buffer, 'odont-hub/posts')

      return {
        url: result.secure_url,
        public_id: result.public_id,
        width: result.width,
        height: result.height,
      }
    }
  })
  // POST base64 — alternativo para Safari
  fastify.post('/base64', {
    onRequest: [fastify.authenticate],
    handler: async (request, reply) => {
      const { image, type } = request.body
      if (!image) return reply.status(400).send({ error: 'Imagem obrigatoria' })
      const buffer = Buffer.from(image, 'base64')
      const result = await uploadImage(buffer, 'odont-hub/posts')
      return { url: result.secure_url, public_id: result.public_id }
    }
  })

}
