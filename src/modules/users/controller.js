// src/modules/users/controller.js
import { supabase } from '../../config/database.js'
import { storage }  from '../../config/storage.js'

const CAMPOS_PUBLICOS = [
  'id','name','specialty','cro','cro_uf','cro_validated',
  'avatar_url','cover_url','bio','descricao_longa',
  'instagram','site_url','city','state','plan',
  'whatsapp_aberto','telefone_aberto','email_aberto','instagram_aberto','site_aberto',
  'created_at','last_seen'
]

// ── helper ────────────────────────────────────────────────────────────────
function getViewerId(req) {
  return req?.user?.id || req?.user?.sub || null
}

// ══════════════════════════════════════════════════════════════════════════
//  GET /api/users/:id  — perfil básico (mantém compat)
// ══════════════════════════════════════════════════════════════════════════
export async function getProfile(request, reply) {
  const { data: user } = await supabase
    .from('users')
    .select('id,name,email,specialty,cro,cro_uf,cro_validated,avatar_url,bio,plan,created_at,last_seen')
    .eq('id', request.params.id).single()
  if (!user) return reply.code(404).send({ error: 'Usuário não encontrado.' })
  return reply.send(user)
}

// ══════════════════════════════════════════════════════════════════════════
//  GET /api/users/:id/perfil — perfil COMPLETO (FASE 3)
//  - aplica flags de visibilidade (campos privados → null se viewer != dono)
//  - inclui contagens: seguidores, seguindo, trabalhos
//  - inclui viewer_segue: bool (se o viewer segue este perfil)
// ══════════════════════════════════════════════════════════════════════════
export async function getPerfilCompleto(request, reply) {
  const viewerId = getViewerId(request)
  const { id } = request.params

  const cols = [...CAMPOS_PUBLICOS, 'email','phone','whatsapp']
  const { data: u, error } = await supabase
    .from('users').select(cols.join(','))
    .eq('id', id).maybeSingle()
  if (error) return reply.code(500).send({ error: 'Erro ao buscar perfil: ' + error.message })
  if (!u)    return reply.code(404).send({ error: 'Perfil não encontrado.' })

  const isMe = viewerId && viewerId === u.id

  // Aplica flags de visibilidade
  const perfil = { ...u }
  if (!isMe) {
    if (!u.whatsapp_aberto)  perfil.whatsapp  = null
    if (!u.telefone_aberto)  perfil.phone     = null
    if (!u.email_aberto)     perfil.email     = null
    if (!u.instagram_aberto) perfil.instagram = null
    if (!u.site_aberto)      perfil.site_url  = null
  }

  // Contagens
  const [{ count: seguidores }, { count: seguindo }, { count: trabalhos }] = await Promise.all([
    supabase.from('seguidores').select('seguidor_id', { count:'exact', head:true }).eq('seguido_id', id),
    supabase.from('seguidores').select('seguido_id',  { count:'exact', head:true }).eq('seguidor_id', id),
    supabase.from('trabalho_fotos').select('id', { count:'exact', head:true }).eq('user_id', id).is('excluida_em', null)
  ])

  // Viewer segue este perfil?
  let viewer_segue = false
  if (viewerId && !isMe) {
    const { data: rel } = await supabase
      .from('seguidores').select('seguidor_id')
      .eq('seguidor_id', viewerId).eq('seguido_id', id).maybeSingle()
    viewer_segue = !!rel
  }

  return reply.send({
    perfil,
    is_me: !!isMe,
    viewer_segue,
    contagens: {
      seguidores: seguidores || 0,
      seguindo:   seguindo   || 0,
      trabalhos:  trabalhos  || 0
    }
  })
}

// ══════════════════════════════════════════════════════════════════════════
//  PATCH /api/users/me — atualiza perfil próprio (whitelist ampliada)
// ══════════════════════════════════════════════════════════════════════════
export async function updateProfile(request, reply) {
  const allowed = [
    'name','bio','specialty','phone','city','state',
    'cover_url','descricao_longa','instagram','site_url','whatsapp',
    'whatsapp_aberto','telefone_aberto','email_aberto','instagram_aberto','site_aberto'
  ]
  const updates = Object.fromEntries(
    Object.entries(request.body || {}).filter(([k]) => allowed.includes(k))
  )
  // Normaliza strings vazias para null
  for (const k of Object.keys(updates)) {
    if (updates[k] === '') updates[k] = null
  }
  const userId = getViewerId(request)
  const { data, error } = await supabase
    .from('users').update({ ...updates, updated_at: new Date() })
    .eq('id', userId).select().single()
  if (error) return reply.code(500).send({ error: 'Erro ao atualizar perfil: ' + (error.message || error.code) })
  return reply.send(data)
}

// ══════════════════════════════════════════════════════════════════════════
//  POST /api/users/me/avatar — upload de avatar
// ══════════════════════════════════════════════════════════════════════════
export async function uploadAvatar(request, reply) {
  const file = await request.file()
  if (!file) return reply.code(400).send({ error: 'Nenhum arquivo enviado.' })

  const buffer = await file.toBuffer()
  const url = await storage.uploadImage(buffer, file.mimetype, 'avatars')

  const userId = getViewerId(request)
  await supabase.from('users').update({ avatar_url: url }).eq('id', userId)

  return reply.send({ avatar_url: url })
}

// ══════════════════════════════════════════════════════════════════════════
//  POST /api/users/me/cover — upload de capa
// ══════════════════════════════════════════════════════════════════════════
export async function uploadCover(request, reply) {
  const file = await request.file()
  if (!file) return reply.code(400).send({ error: 'Nenhum arquivo enviado.' })

  const buffer = await file.toBuffer()
  const url = await storage.uploadImage(buffer, file.mimetype, 'covers')

  const userId = getViewerId(request)
  await supabase.from('users').update({ cover_url: url }).eq('id', userId)

  return reply.send({ cover_url: url })
}
