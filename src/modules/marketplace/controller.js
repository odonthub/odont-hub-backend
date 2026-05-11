// src/modules/marketplace/controller.js
import { supabase } from '../../config/database.js'
import { randomUUID } from 'crypto'

const PAGE_SIZE = 18

export async function getListings(request, reply) {
  const { page = 1, category, condition, state, search } = request.query
  const offset = (page - 1) * PAGE_SIZE

  let q = supabase
    .from('marketplace_listings')
    .select('*, seller:users(id,name,avatar_url,cro,cro_uf), images:listing_images(*)')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1)

  if (category)  q = q.eq('category', category)
  if (condition) q = q.eq('condition', condition)
  if (state)     q = q.eq('state', state)
  if (search)    q = q.or(`title.ilike.%${search}%,description.ilike.%${search}%`)

  const { data, error } = await q
  if (error) return reply.code(500).send({ error: 'Erro ao buscar anúncios.' })
  return reply.send(data)
}

export async function getListing(request, reply) {
  const { data, error } = await supabase
    .from('marketplace_listings')
    .select('*, seller:users(id,name,avatar_url,cro,cro_uf,phone), images:listing_images(*)')
    .eq('id', request.params.id)
    .single()
  if (!data) return reply.code(404).send({ error: 'Anúncio não encontrado.' })
  return reply.send(data)
}

export async function createListing(request, reply) {
  const { title, description, price, category, condition, city, state, image_urls = [] } = request.body
  if (!title || !price || !category || !condition)
    return reply.code(400).send({ error: 'Campos obrigatórios: título, preço, categoria, estado do produto.' })

  const listingId = randomUUID()
  const { data, error } = await supabase.from('marketplace_listings').insert({
    id: listingId, user_id: request.user.id,
    title, description, price: Number(price),
    category, condition, city, state, status: 'active',
  }).select().single()

  if (error) return reply.code(500).send({ error: 'Erro ao criar anúncio.' })

  if (image_urls.length > 0) {
    await supabase.from('listing_images').insert(
      image_urls.map((url, i) => ({
        id: randomUUID(), listing_id: listingId, url, order_index: i,
      }))
    )
  }

  return reply.code(201).send(data)
}

export async function updateListing(request, reply) {
  const { id } = request.params
  const { data: listing } = await supabase
    .from('marketplace_listings').select('user_id').eq('id', id).single()
  if (!listing) return reply.code(404).send({ error: 'Anúncio não encontrado.' })
  if (listing.user_id !== request.user.id) return reply.code(403).send({ error: 'Sem permissão.' })

  const allowed = ['title','description','price','status','city','state']
  const updates = Object.fromEntries(
    Object.entries(request.body).filter(([k]) => allowed.includes(k))
  )
  const { data } = await supabase.from('marketplace_listings')
    .update({ ...updates, updated_at: new Date() }).eq('id', id).select().single()
  return reply.send(data)
}

export async function deleteListing(request, reply) {
  const { id } = request.params
  const { data: listing } = await supabase
    .from('marketplace_listings').select('user_id').eq('id', id).single()
  if (!listing) return reply.code(404).send({ error: 'Anúncio não encontrado.' })
  if (listing.user_id !== request.user.id) return reply.code(403).send({ error: 'Sem permissão.' })
  await supabase.from('marketplace_listings').delete().eq('id', id)
  return reply.send({ message: 'Anúncio removido.' })
}

// Abre ou retorna sala de chat privada entre comprador e vendedor
export async function expressInterest(request, reply) {
  const { id } = request.params
  const buyerId = request.user.id

  const { data: listing } = await supabase
    .from('marketplace_listings').select('user_id,title').eq('id', id).single()
  if (!listing) return reply.code(404).send({ error: 'Anúncio não encontrado.' })
  if (listing.user_id === buyerId) return reply.code(400).send({ error: 'Você não pode iniciar chat com você mesmo.' })

  // Verifica se já existe sala
  const { data: existing } = await supabase
    .from('chat_rooms')
    .select('*')
    .eq('listing_id', id)
    .eq('buyer_id', buyerId)
    .single()

  if (existing) return reply.send(existing)

  const { data: room } = await supabase.from('chat_rooms').insert({
    id: randomUUID(),
    listing_id: id,
    seller_id: listing.user_id,
    buyer_id: buyerId,
    type: 'marketplace',
  }).select().single()

  return reply.code(201).send(room)
}

export async function getMyConversations(request, reply) {
  const userId = request.user.id
  const { data } = await supabase
    .from('chat_rooms')
    .select(`
      *,
      listing:marketplace_listings(id,title),
      seller:users!chat_rooms_seller_id_fkey(id,name,avatar_url),
      buyer:users!chat_rooms_buyer_id_fkey(id,name,avatar_url),
      last_message:chat_messages(content,created_at)
    `)
    .or(`seller_id.eq.${userId},buyer_id.eq.${userId}`)
    .order('updated_at', { ascending: false })
  return reply.send(data || [])
}
