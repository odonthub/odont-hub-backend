import { uploadImage } from '../../config/cloudinary.js'

export default async function uploadsRoutes(fastify) {
  fastify.post('/api/uploads/image', {
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
}
