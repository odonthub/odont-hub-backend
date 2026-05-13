import { supabase } from '../../config/database.js'

export default async function feedRoutes(fastify) {
  // GET feed — público (sem autenticação)
  fastify.get('/api/feed', async (request, reply) => {
    const { page = 1, limit = 10 } = request.query
    const offset = (page - 1) * limit

    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:users(id, name, specialty, cro, cro_uf),
        likes_count:post_likes(count),
        comments_count:post_comments(count)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw new Error('Erro ao buscar posts.')
    return data || []
  })

  // POST — criar post (autenticado)
  fastify.post('/api/feed', {
    onRequest: [fastify.authenticate],
    handler: async (request, reply) => {
      const { content, specialty_tag, image_url } = request.body
      if (!content?.trim()) return reply.status(400).send({ error: 'Conteúdo obrigatório.' })

      const { data, error } = await supabase
        .from('posts')
        .insert({ user_id: request.user.id, content, specialty_tag, image_url })
        .select()
        .single()

      if (error) throw new Error('Erro ao criar post.')
      return data
    }
  })

  // POST like
  fastify.post('/api/feed/:id/like', {
    onRequest: [fastify.authenticate],
    handler: async (request, reply) => {
      await supabase.from('post_likes').upsert({ post_id: request.params.id, user_id: request.user.id })
      return { ok: true }
    }
  })

  // DELETE like
  fastify.delete('/api/feed/:id/like', {
    onRequest: [fastify.authenticate],
    handler: async (request, reply) => {
      await supabase.from('post_likes').delete().match({ post_id: request.params.id, user_id: request.user.id })
      return { ok: true }
    }
  })

  // DELETE post
  fastify.delete('/api/feed/:id', {
    onRequest: [fastify.authenticate],
    handler: async (request, reply) => {
      await supabase.from('posts').delete().match({ id: request.params.id, user_id: request.user.id })
      return { ok: true }
    }
  })
}
