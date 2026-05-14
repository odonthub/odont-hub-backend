import { supabase } from '../../config/database.js'

export default async function feedRoutes(fastify) {
  // GET feed — público
  fastify.get('/', async (request, reply) => {
    const { page = 1, limit = 10 } = request.query
    const offset = (Number(page) - 1) * Number(limit)

    const { data: posts, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + Number(limit) - 1)

    if (error) return reply.status(500).send({ error: error.message })
    if (!posts?.length) return []

    // Busca autores separadamente
    const userIds = [...new Set(posts.map(p => p.user_id))]
    const { data: users } = await supabase
      .from('users')
      .select('id, name, specialty, cro, cro_uf')
      .in('id', userIds)

    const usersMap = {}
    users?.forEach(u => { usersMap[u.id] = u })

    return posts.map(post => ({
      ...post,
      author: usersMap[post.user_id] || {},
      likes_count: 0,
      comments_count: 0,
      liked_by_me: false,
    }))
  })

  // POST — criar post (autenticado)
  fastify.post('/', {
    onRequest: [fastify.authenticate],
    handler: async (request, reply) => {
      const { content, specialty_tag, image_url } = request.body
      if (!content?.trim()) return reply.status(400).send({ error: 'Conteúdo obrigatório.' })

      const { data, error } = await supabase
        .from('posts')
        .insert({ user_id: request.user.id, content, specialty_tag, image_url })
        .select()
        .single()

      if (error) return reply.status(500).send({ error: error.message })
      return data
    }
  })

  // POST like
  fastify.post('/:id/like', {
    onRequest: [fastify.authenticate],
    handler: async (request, reply) => {
      await supabase.from('post_likes').upsert({ post_id: request.params.id, user_id: request.user.id })
      return { ok: true }
    }
  })

  // DELETE like
  fastify.delete('/:id/like', {
    onRequest: [fastify.authenticate],
    handler: async (request, reply) => {
      await supabase.from('post_likes').delete().match({ post_id: request.params.id, user_id: request.user.id })
      return { ok: true }
    }
  })

  // DELETE post
  fastify.delete('/:id', {
    onRequest: [fastify.authenticate],
    handler: async (request, reply) => {
      await supabase.from('posts').delete().match({ id: request.params.id, user_id: request.user.id })
      return { ok: true }
    }
  })
  // PUT - editar post
  fastify.put('/:id', {
    onRequest: [fastify.authenticate],
    handler: async (request, reply) => {
      const { content } = request.body
      if (!content || !content.trim()) return reply.status(400).send({ error: 'Conteudo obrigatorio.' })
      const { data, error } = await supabase
        .from('posts')
        .update({ content: content.trim() })
        .match({ id: request.params.id, user_id: request.user.id })
        .select()
        .single()
      if (error) return reply.status(500).send({ error: error.message })
      return data
    }
  })

}
