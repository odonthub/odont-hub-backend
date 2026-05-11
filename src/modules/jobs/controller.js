// src/modules/jobs/controller.js
import { supabase } from '../../config/database.js'
import { randomUUID } from 'crypto'

const PAGE_SIZE = 20

// ── VAGAS ──────────────────────────────────────────────────────────────────
export async function getJobs(request, reply) {
  const { page = 1, specialty, contract_type, state, role_type } = request.query
  const offset = (page - 1) * PAGE_SIZE

  let q = supabase
    .from('job_listings')
    .select('*, clinic:users(id,name,avatar_url,cro_uf)')
    .eq('status', 'open')
    .order('created_at', { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1)

  if (specialty)      q = q.eq('specialty', specialty)
  if (contract_type)  q = q.eq('contract_type', contract_type)
  if (state)          q = q.eq('state', state)
  if (role_type)      q = q.eq('role_type', role_type)

  const { data, error } = await q
  if (error) return reply.code(500).send({ error: 'Erro ao buscar vagas.' })
  return reply.send(data)
}

export async function getJob(request, reply) {
  const { data } = await supabase
    .from('job_listings')
    .select('*, clinic:users(id,name,avatar_url,phone,cro_uf)')
    .eq('id', request.params.id).single()
  if (!data) return reply.code(404).send({ error: 'Vaga não encontrada.' })
  return reply.send(data)
}

export async function createJob(request, reply) {
  const {
    title, description, specialty, role_type,
    contract_type, salary_info, city, state, requirements,
  } = request.body

  if (!title || !specialty || !role_type || !contract_type)
    return reply.code(400).send({ error: 'Campos obrigatórios: título, especialidade, tipo de vaga e contrato.' })

  const { data, error } = await supabase.from('job_listings').insert({
    id: randomUUID(), user_id: request.user.id,
    title, description, specialty, role_type,
    contract_type, salary_info, city, state,
    requirements, status: 'open',
    expires_at: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 dias
  }).select().single()

  if (error) return reply.code(500).send({ error: 'Erro ao publicar vaga.' })
  return reply.code(201).send(data)
}

export async function updateJob(request, reply) {
  const { id } = request.params
  const { data: job } = await supabase
    .from('job_listings').select('user_id').eq('id', id).single()
  if (!job) return reply.code(404).send({ error: 'Vaga não encontrada.' })
  if (job.user_id !== request.user.id) return reply.code(403).send({ error: 'Sem permissão.' })

  const allowed = ['title','description','salary_info','status','expires_at']
  const updates = Object.fromEntries(Object.entries(request.body).filter(([k]) => allowed.includes(k)))
  const { data } = await supabase.from('job_listings')
    .update({ ...updates, updated_at: new Date() }).eq('id', id).select().single()
  return reply.send(data)
}

export async function deleteJob(request, reply) {
  const { id } = request.params
  const { data: job } = await supabase
    .from('job_listings').select('user_id').eq('id', id).single()
  if (!job) return reply.code(404).send({ error: 'Vaga não encontrada.' })
  if (job.user_id !== request.user.id) return reply.code(403).send({ error: 'Sem permissão.' })
  await supabase.from('job_listings').delete().eq('id', id)
  return reply.send({ message: 'Vaga removida.' })
}

// ── CANDIDATURAS ───────────────────────────────────────────────────────────
export async function applyToJob(request, reply) {
  const { id } = request.params
  const { cover_letter, resume_url } = request.body

  const { data: job } = await supabase
    .from('job_listings').select('user_id,status').eq('id', id).single()
  if (!job) return reply.code(404).send({ error: 'Vaga não encontrada.' })
  if (job.status !== 'open') return reply.code(400).send({ error: 'Vaga não está mais disponível.' })
  if (job.user_id === request.user.id) return reply.code(400).send({ error: 'Você não pode se candidatar à sua própria vaga.' })

  const { data, error } = await supabase.from('job_applications').upsert({
    id: randomUUID(), job_id: id, user_id: request.user.id,
    cover_letter, resume_url, status: 'pending',
  }, { onConflict: 'job_id,user_id', ignoreDuplicates: false }).select().single()

  if (error) return reply.code(500).send({ error: 'Erro ao candidatar.' })
  return reply.code(201).send(data)
}

export async function getMyApplications(request, reply) {
  const { data } = await supabase
    .from('job_applications')
    .select('*, job:job_listings(id,title,specialty,city,state,clinic:users(name,avatar_url))')
    .eq('user_id', request.user.id)
    .order('created_at', { ascending: false })
  return reply.send(data || [])
}

// ── PERFIS DISPONÍVEIS ─────────────────────────────────────────────────────
export async function getProfiles(request, reply) {
  const { specialty, contract_type, state } = request.query

  let q = supabase
    .from('available_profiles')
    .select('*, user:users(id,name,avatar_url,specialty,cro,cro_uf)')
    .eq('is_active', true)

  if (specialty)     q = q.eq('specialty', specialty)
  if (contract_type) q = q.eq('contract_type', contract_type)
  if (state)         q = q.eq('state', state)

  const { data } = await q.order('created_at', { ascending: false })
  return reply.send(data || [])
}

export async function createProfile(request, reply) {
  const { specialty, contract_type, bio, city, state, resume_url } = request.body

  const { data, error } = await supabase.from('available_profiles').upsert({
    id: randomUUID(), user_id: request.user.id,
    specialty, contract_type, bio, city, state, resume_url,
    is_active: true,
  }, { onConflict: 'user_id' }).select().single()

  if (error) return reply.code(500).send({ error: 'Erro ao criar perfil.' })
  return reply.code(201).send(data)
}

export async function updateProfile(request, reply) {
  const allowed = ['specialty','contract_type','bio','city','state','resume_url','is_active']
  const updates = Object.fromEntries(Object.entries(request.body).filter(([k]) => allowed.includes(k)))
  const { data } = await supabase.from('available_profiles')
    .update(updates).eq('user_id', request.user.id).select().single()
  return reply.send(data)
}
