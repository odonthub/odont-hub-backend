import { supabase } from '../../config/database.js'

export default async function feedRoutes(fastify) {
  // GET feed — público; autenticação opcional para preencher liked_by_me / saved_by_me
  fastify.get('/', async (request, reply) => {
    // Tenta identificar viewer (sem exigir token)
    let viewerId = null
    try {
      await request.jwtVerify()
      viewerId = request.user?.id || request.user?.sub || null
    } catch (_) { /* anônimo OK */ }

    const { page = 1, limit = 10 } = request.query
    const offset = (Number(page) - 1) * Number(limit)

    const { data: posts, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + Number(limit) - 1)

    if (error) return reply.status(500).send({ error: error.message })
    if (!posts?.length) return []

    const postIds = posts.map(p => p.id)
    const userIds = [...new Set(posts.map(p => p.user_id))]

    // Busca autores, likes e comentários em paralelo
    const [
      { data: users },
      { data: likesRows },
      { data: commentsRows },
      { data: meusLikes },
      { data: meusSalvos }
    ] = await Promise.all([
      supabase.from('users').select('id, name, specialty, cro, cro_uf, avatar_url').in('id', userIds),
      supabase.from('post_likes').select('post_id').in('post_id', postIds),
      supabase.from('post_comments').select('post_id').in('post_id', postIds),
      viewerId
        ? supabase.from('post_likes').select('post_id').in('post_id', postIds).eq('user_id', viewerId)
        : Promise.resolve({ data: [] }),
      viewerId
        ? supabase.from('post_saves').select('post_id').in('post_id', postIds).eq('user_id', viewerId)
        : Promise.resolve({ data: [] })
    ])

    const usersMap = {}
    ;(users || []).forEach(u => { usersMap[u.id] = u })

    const likesCount = {}
    ;(likesRows || []).forEach(r => { likesCount[r.post_id] = (likesCount[r.post_id] || 0) + 1 })

    const commentsCount = {}
    ;(commentsRows || []).forEach(r => { commentsCount[r.post_id] = (commentsCount[r.post_id] || 0) + 1 })

    const meusLikesSet = new Set((meusLikes || []).map(r => r.post_id))
    const meusSavesSet = new Set((meusSalvos || []).map(r => r.post_id))

    return posts.map(post => ({
      ...post,
      author: usersMap[post.user_id] || {},
      likes_count:    likesCount[post.id] || 0,
      comments_count: commentsCount[post.id] || 0,
      liked_by_me:    meusLikesSet.has(post.id),
      saved_by_me:    meusSavesSet.has(post.id),
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

  // POST save (favoritar post)
  fastify.post('/:id/save', {
    onRequest: [fastify.authenticate],
    handler: async (request, reply) => {
      const { error } = await supabase.from('post_saves')
        .upsert({ post_id: request.params.id, user_id: request.user.id })
      if (error) return reply.code(500).send({ error: 'Erro ao salvar: ' + error.message })
      return { ok: true }
    }
  })

  // DELETE save
  fastify.delete('/:id/save', {
    onRequest: [fastify.authenticate],
    handler: async (request, reply) => {
      await supabase.from('post_saves').delete().match({ post_id: request.params.id, user_id: request.user.id })
      return { ok: true }
    }
  })

  // GET salvos do user (futura tela "Meus salvos")
  fastify.get('/saved/me', {
    onRequest: [fastify.authenticate],
    handler: async (request, reply) => {
      const { data, error } = await supabase
        .from('post_saves')
        .select('post:posts(*)')
        .eq('user_id', request.user.id)
        .order('created_at', { ascending: false })
        .limit(200)
      if (error) return reply.code(500).send({ error: 'Erro ao listar salvos.' })
      return (data || []).map(r => r.post).filter(Boolean)
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
// GET comentários de um post
  fastify.get('/:id/comments', async (request, reply) => {
    const { data, error } = await supabase
      .from('post_comments')
      .select('*, author:users(id,name,specialty,cro,cro_uf)')
      .eq('post_id', request.params.id)
      .is('parent_id', null)
      .order('created_at', { ascending: true })
    if (error) return reply.status(500).send({ error: error.message })
    return data || []
  })

  // POST comentário
  fastify.post('/:id/comments', {
    onRequest: [fastify.authenticate],
    handler: async (request, reply) => {
      const { content, parent_id } = request.body
      if (!content?.trim()) return reply.status(400).send({ error: 'Comentário vazio.' })
      const { data, error } = await supabase
        .from('post_comments')
        .insert({
          post_id: request.params.id,
          user_id: request.user.id,
          content: content.trim(),
          parent_id: parent_id || null,
        })
        .select('*, author:users(id,name,specialty,cro,cro_uf)')
        .single()
      if (error) return reply.status(500).send({ error: error.message })
      return reply.status(201).send(data)
    }
  })

  // DELETE comentário
  fastify.delete('/:postId/comments/:commentId', {
    onRequest: [fastify.authenticate],
    handler: async (request, reply) => {
      await supabase.from('post_comments')
        .delete()
        .match({ id: request.params.commentId, user_id: request.user.id })
      return { ok: true }
    }
  })
}
