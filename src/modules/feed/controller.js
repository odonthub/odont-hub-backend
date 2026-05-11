// src/modules/feed/controller.js
import { supabase } from '../../config/database.js'
import { cache }    from '../../config/redis.js'
import { randomUUID } from 'crypto'

const PAGE_SIZE = 20

// ── GET /api/feed?page=1&specialty=Implantodontia ──────────────────────────
export async function getPosts(request, reply) {
  const { page = 1, specialty, search } = request.query
  const offset = (page - 1) * PAGE_SIZE
  const cacheKey = `feed:page:${page}:${specialty||'all'}:${search||''}`

  const cached = await cache.get(cacheKey)
  if (cached) return reply.send(cached)

  let query = supabase
    .from('posts')
    .select(`
      *,
      author:users(id, name, specialty, cro, cro_uf, avatar_url),
      likes_count:post_likes(count),
      comments_count:post_comments(count),
      media:post_media(*)
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1)

  if (specialty) query = query.eq('specialty_tag', specialty)
  if (search)    query = query.ilike('content', `%${search}%`)

  const { data: posts, error } = await query
  if (error) return reply.code(500).send({ error: 'Erro ao buscar posts.' })

  // Marca se o usuário atual curtiu cada post
  const userId = request.user.id
  const { data: myLikes } = await supabase
    .from('post_likes')
    .select('post_id')
    .eq('user_id', userId)
    .in('post_id', posts.map(p => p.id))

  const likedSet = new Set(myLikes?.map(l => l.post_id) || [])
  const result = posts.map(p => ({ ...p, liked_by_me: likedSet.has(p.id) }))

  await cache.set(cacheKey, result, 60) // cache 1 minuto
  return reply.send(result)
}

// ── POST /api/feed ─────────────────────────────────────────────────────────
export async function createPost(request, reply) {
  const { content, specialty_tag, media_urls = [] } = request.body
  const userId = request.user.id

  if (!content?.trim()) return reply.code(400).send({ error: 'Conteúdo é obrigatório.' })
  if (content.length > 5000) return reply.code(400).send({ error: 'Post muito longo (máx 5000 chars).' })

  const postId = randomUUID()

  const { data: post, error } = await supabase.from('posts').insert({
    id: postId, user_id: userId, content: content.trim(), specialty_tag,
  }).select().single()

  if (error) return reply.code(500).send({ error: 'Erro ao criar post.' })

  // Salva mídias associadas
  if (media_urls.length > 0) {
    await supabase.from('post_media').insert(
      media_urls.map((url, i) => ({
        id: randomUUID(), post_id: postId,
        url, order_index: i,
        type: url.match(/\.(mp4|webm|mov)$/i) ? 'video' : url.endsWith('.pdf') ? 'document' : 'image',
      }))
    )
  }

  await cache.invalidatePattern('feed:page:*')
  return reply.code(201).send(post)
}

// ── DELETE /api/feed/:id ───────────────────────────────────────────────────
export async function deletePost(request, reply) {
  const { id } = request.params
  const { data: post } = await supabase
    .from('posts').select('user_id').eq('id', id).single()

  if (!post) return reply.code(404).send({ error: 'Post não encontrado.' })
  if (post.user_id !== request.user.id) return reply.code(403).send({ error: 'Sem permissão.' })

  await supabase.from('posts').delete().eq('id', id)
  await cache.invalidatePattern('feed:page:*')
  return reply.send({ message: 'Post removido.' })
}

// ── POST /api/feed/:id/like ────────────────────────────────────────────────
export async function likePost(request, reply) {
  const { id } = request.params
  const userId = request.user.id
  await supabase.from('post_likes').upsert(
    { post_id: id, user_id: userId },
    { onConflict: 'post_id,user_id', ignoreDuplicates: true }
  )
  await cache.invalidatePattern('feed:page:*')
  return reply.send({ liked: true })
}

// ── DELETE /api/feed/:id/like ──────────────────────────────────────────────
export async function unlikePost(request, reply) {
  const { id } = request.params
  await supabase.from('post_likes')
    .delete().eq('post_id', id).eq('user_id', request.user.id)
  await cache.invalidatePattern('feed:page:*')
  return reply.send({ liked: false })
}

// ── GET /api/feed/:id/comments ─────────────────────────────────────────────
export async function getComments(request, reply) {
  const { id } = request.params
  const { data } = await supabase
    .from('post_comments')
    .select('*, author:users(id,name,avatar_url,cro)')
    .eq('post_id', id)
    .order('created_at', { ascending: true })
  return reply.send(data || [])
}

// ── POST /api/feed/:id/comments ────────────────────────────────────────────
export async function createComment(request, reply) {
  const { id }       = request.params
  const { content, parent_id } = request.body
  if (!content?.trim()) return reply.code(400).send({ error: 'Comentário vazio.' })

  const { data, error } = await supabase.from('post_comments').insert({
    id: randomUUID(), post_id: id,
    user_id: request.user.id,
    content: content.trim(),
    parent_id: parent_id || null,
  }).select('*, author:users(id,name,avatar_url,cro)').single()

  if (error) return reply.code(500).send({ error: 'Erro ao comentar.' })
  await cache.invalidatePattern('feed:page:*')
  return reply.code(201).send(data)
}

// ── DELETE /api/feed/comments/:id ─────────────────────────────────────────
export async function deleteComment(request, reply) {
  const { id } = request.params
  const { data: comment } = await supabase
    .from('post_comments').select('user_id').eq('id', id).single()
  if (!comment) return reply.code(404).send({ error: 'Comentário não encontrado.' })
  if (comment.user_id !== request.user.id) return reply.code(403).send({ error: 'Sem permissão.' })
  await supabase.from('post_comments').delete().eq('id', id)
  return reply.send({ message: 'Comentário removido.' })
}
