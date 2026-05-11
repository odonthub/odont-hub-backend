// src/modules/users/controller.js
import { supabase } from '../../config/database.js'
import { storage }  from '../../config/storage.js'

export async function getProfile(request, reply) {
  const { data: user } = await supabase
    .from('users')
    .select('id,name,email,specialty,cro,cro_uf,cro_validated,avatar_url,bio,plan,created_at,last_seen')
    .eq('id', request.params.id).single()
  if (!user) return reply.code(404).send({ error: 'Usuário não encontrado.' })
  return reply.send(user)
}

export async function updateProfile(request, reply) {
  const allowed = ['name','bio','specialty','phone','city','state']
  const updates = Object.fromEntries(
    Object.entries(request.body).filter(([k]) => allowed.includes(k))
  )
  const { data, error } = await supabase
    .from('users').update({ ...updates, updated_at: new Date() })
    .eq('id', request.user.id).select().single()
  if (error) return reply.code(500).send({ error: 'Erro ao atualizar perfil.' })
  return reply.send(data)
}

export async function uploadAvatar(request, reply) {
  const file = await request.file()
  if (!file) return reply.code(400).send({ error: 'Nenhum arquivo enviado.' })

  const buffer = await file.toBuffer()
  const url = await storage.uploadImage(buffer, file.mimetype, 'avatars')

  await supabase.from('users')
    .update({ avatar_url: url }).eq('id', request.user.id)

  return reply.send({ avatar_url: url })
}
