// src/modules/experts/controller.js
import { supabase } from '../../config/database.js'
import { randomUUID } from 'crypto'

export async function getExperts(request, reply) {
  const { specialty, search } = request.query

  let q = supabase
    .from('experts')
    .select('*, user:users(id,name,avatar_url,cro,cro_uf,phone)')
    .eq('is_active', true)
    .order('rating', { ascending: false })

  if (specialty) q = q.eq('specialty', specialty)
  if (search)    q = q.ilike('users.name', `%${search}%`)

  const { data, error } = await q
  if (error) return reply.code(500).send({ error: 'Erro ao buscar especialistas.' })
  return reply.send(data)
}

export async function getExpert(request, reply) {
  const { data } = await supabase
    .from('experts')
    .select('*, user:users(id,name,avatar_url,cro,cro_uf,phone,specialty)')
    .eq('id', request.params.id).single()
  if (!data) return reply.code(404).send({ error: 'Especialista não encontrado.' })
  return reply.send(data)
}

// Abre sala de chat interna para consulta com especialista
export async function startConsultation(request, reply) {
  const { id } = request.params
  const patientId = request.user.id

  const { data: expert } = await supabase
    .from('experts').select('user_id').eq('id', id).single()
  if (!expert) return reply.code(404).send({ error: 'Especialista não encontrado.' })

  // Verifica se já existe sala ativa
  const { data: existing } = await supabase
    .from('chat_rooms')
    .select('*')
    .eq('expert_id', id)
    .eq('patient_id', patientId)
    .eq('type', 'expert')
    .single()

  if (existing) return reply.send(existing)

  const { data: room } = await supabase.from('chat_rooms').insert({
    id: randomUUID(),
    expert_id: id,
    expert_user_id: expert.user_id,
    patient_id: patientId,
    type: 'expert',
  }).select().single()

  return reply.code(201).send(room)
}

// Retorna link wa.me/ para contato via WhatsApp
export async function getWhatsappLink(request, reply) {
  const { id } = request.params
  const { data: expert } = await supabase
    .from('experts')
    .select('user:users(phone)')
    .eq('id', id).single()

  if (!expert?.user?.phone)
    return reply.code(404).send({ error: 'Especialista sem WhatsApp cadastrado.' })

  const phone = expert.user.phone.replace(/\D/g, '')
  const link  = `https://wa.me/55${phone}?text=${encodeURIComponent('Olá! Vim pelo ODONT HUB e gostaria de uma consulta.')}`
  return reply.send({ whatsapp_url: link })
}
