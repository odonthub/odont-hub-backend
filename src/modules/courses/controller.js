// src/modules/courses/controller.js
import { supabase } from '../../config/database.js'
import { randomUUID } from 'crypto'

export async function getCourses(request, reply) {
  const { specialty, modality, state, search, page = 1 } = request.query
  const offset = (page - 1) * 18
  let q = supabase
    .from('courses')
    .select('id,user_id,title,description,specialty,modality,hours,price,city,state,start_date,cover_url,whatsapp,status,created_at, instructor:users(id,name,avatar_url,cro)')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .range(offset, offset + 17)
  if (specialty) q = q.eq('specialty', specialty)
  if (modality)  q = q.eq('modality', modality)
  if (state)     q = q.eq('state', state)
  if (search)    q = q.ilike('title', `%${search}%`)
  const { data, error } = await q
  if (error) return reply.code(500).send({ error: 'Erro ao buscar cursos.' })
  return reply.send(data)
}

export async function getCourse(request, reply) {
  const { data } = await supabase
    .from('courses')
    .select('*, instructor:users(id,name,avatar_url,cro,cro_uf,specialty)')
    .eq('id', request.params.id).single()
  if (!data) return reply.code(404).send({ error: 'Curso não encontrado.' })
  return reply.send(data)
}

export async function createCourse(request, reply) {
  const {
    title, description, specialty, modality, hours, price,
    city, state, start_date, max_students, cover_url, whatsapp,
  } = request.body
  if (!title || !specialty || !modality)
    return reply.code(400).send({ error: 'Título, especialidade e modalidade são obrigatórios.' })
  const { data, error } = await supabase.from('courses').insert({
    id: randomUUID(), user_id: request.user.id,
    title, description, specialty, modality,
    hours: Number(hours) || null,
    price: price ? Number(price) : 0,
    city, state, start_date, max_students, cover_url,
    whatsapp: whatsapp || null,
    status: 'active',
  }).select().single()
  if (error) return reply.code(500).send({ error: 'Erro ao publicar curso.' })
  return reply.code(201).send(data)
}

export async function updateCourse(request, reply) {
  const { id } = request.params
  const { data: course } = await supabase
    .from('courses').select('user_id').eq('id', id).single()
  if (!course) return reply.code(404).send({ error: 'Curso não encontrado.' })
  if (course.user_id !== request.user.id) return reply.code(403).send({ error: 'Sem permissão.' })
  const allowed = ['title','description','price','city','state','start_date','status','max_students','cover_url','whatsapp']
  const updates = Object.fromEntries(Object.entries(request.body).filter(([k]) => allowed.includes(k)))
  const { data } = await supabase.from('courses')
    .update({ ...updates, updated_at: new Date() }).eq('id', id).select().single()
  return reply.send(data)
}

export async function deleteCourse(request, reply) {
  const { id } = request.params
  const { data: course } = await supabase
    .from('courses').select('user_id').eq('id', id).single()
  if (!course) return reply.code(404).send({ error: 'Curso não encontrado.' })
  if (course.user_id !== request.user.id) return reply.code(403).send({ error: 'Sem permissão.' })
  await supabase.from('courses').delete().eq('id', id)
  return reply.send({ message: 'Curso removido.' })
}

export async function enrollCourse(request, reply) {
  const { id } = request.params
  const { data: course } = await supabase
    .from('courses').select('user_id,status,max_students').eq('id', id).single()
  if (!course) return reply.code(404).send({ error: 'Curso não encontrado.' })
  if (course.status !== 'active') return reply.code(400).send({ error: 'Curso indisponível.' })
  const { data, error } = await supabase.from('course_enrollments').upsert({
    id: randomUUID(), course_id: id, user_id: request.user.id, status: 'pending',
  }, { onConflict: 'course_id,user_id', ignoreDuplicates: true }).select().single()
  if (error) return reply.code(500).send({ error: 'Erro ao se inscrever.' })
  return reply.code(201).send(data)
}
