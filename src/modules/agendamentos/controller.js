// src/modules/agendamentos/controller.js
// FASE 2D — Agendamentos (consultas).
// Soft delete via `excluido_em`. Status: pendente|confirmado|realizado|faltou|cancelado.

import { supabase } from '../../config/database.js'
import { ensureClinica, getUserId, getPacienteDaClinica } from '../_shared/clinica.js'

const STATUS_VALIDOS = new Set(['pendente','confirmado','realizado','faltou','cancelado'])

function sanitizarData(s) {
  if (!s) return null
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s
  return null
}
function sanitizarHora(s) {
  if (!s) return null
  // Aceita HH:MM ou HH:MM:SS
  const m = String(s).match(/^(\d{2}):(\d{2})(?::(\d{2}))?$/)
  if (!m) return null
  const h = parseInt(m[1],10), mi = parseInt(m[2],10)
  if (h < 0 || h > 23 || mi < 0 || mi > 59) return null
  return `${m[1]}:${m[2]}:00`
}
function sanitizarTexto(v, max = 500) {
  if (v == null) return null
  const s = String(v).trim()
  if (!s) return null
  return s.slice(0, max)
}
function sanitizarDuracao(v) {
  const n = parseInt(v, 10)
  if (!Number.isFinite(n) || n <= 0) return 60
  return Math.min(n, 1440)
}

function montarPayload(body) {
  const out = {}
  if (body.data !== undefined)            out.data = sanitizarData(body.data)
  if (body.hora !== undefined)            out.hora = sanitizarHora(body.hora)
  if (body.duracao_minutos !== undefined) out.duracao_minutos = sanitizarDuracao(body.duracao_minutos)
  if (body.procedimento !== undefined)    out.procedimento = sanitizarTexto(body.procedimento)
  if (body.observacoes !== undefined)     out.observacoes = sanitizarTexto(body.observacoes, 2000)
  if (body.profissional_id !== undefined)   out.profissional_id = sanitizarTexto(body.profissional_id, 100)
  if (body.profissional_nome !== undefined) out.profissional_nome = sanitizarTexto(body.profissional_nome, 200)
  if (body.profissional_cor !== undefined)  out.profissional_cor = sanitizarTexto(body.profissional_cor, 20)
  if (body.status !== undefined && STATUS_VALIDOS.has(body.status)) out.status = body.status
  return out
}

// ══════════════════════════════════════════════════════════════════════════
//  GET /api/pacientes/:pacienteId/agendamentos?futuras=true|false
// ══════════════════════════════════════════════════════════════════════════
export async function listarDoPaciente(request, reply) {
  try {
    const userId = getUserId(request)
    const clinicaId = await ensureClinica(userId)
    const { pacienteId } = request.params

    const pac = await getPacienteDaClinica(pacienteId, clinicaId)
    if (!pac) return reply.code(404).send({ error: 'Paciente não encontrado.' })

    const hoje = new Date().toISOString().slice(0,10)
    const futuras = request.query.futuras

    let qb = supabase.from('agendamentos')
      .select('id,paciente_id,profissional_id,profissional_nome,profissional_cor,data,hora,duracao_minutos,procedimento,observacoes,status,created_at,updated_at')
      .eq('paciente_id', pacienteId).eq('clinica_id', clinicaId)
      .is('excluido_em', null)

    if (futuras === 'true')  qb = qb.gte('data', hoje).order('data', { ascending: true }).order('hora', { ascending: true })
    else if (futuras === 'false') qb = qb.lt('data', hoje).order('data', { ascending: false }).order('hora', { ascending: false })
    else qb = qb.order('data', { ascending: false }).order('hora', { ascending: false })

    qb = qb.limit(500)
    const { data, error } = await qb
    if (error) return reply.code(500).send({ error: 'Erro ao listar agendamentos: ' + error.message })
    return reply.send({ agendamentos: data || [] })
  } catch (e) {
    return reply.code(500).send({ error: e.message || 'Erro ao listar agendamentos.' })
  }
}

// ══════════════════════════════════════════════════════════════════════════
//  POST /api/pacientes/:pacienteId/agendamentos
// ══════════════════════════════════════════════════════════════════════════
export async function criar(request, reply) {
  try {
    const userId = getUserId(request)
    const clinicaId = await ensureClinica(userId)
    const { pacienteId } = request.params
    const body = request.body || {}

    const pac = await getPacienteDaClinica(pacienteId, clinicaId)
    if (!pac) return reply.code(404).send({ error: 'Paciente não encontrado.' })

    const payload = montarPayload(body)
    if (!payload.data) return reply.code(400).send({ error: 'Data inválida (AAAA-MM-DD).' })
    if (!payload.hora) return reply.code(400).send({ error: 'Horário inválido (HH:MM).' })
    if (!payload.duracao_minutos) payload.duracao_minutos = 60
    payload.paciente_id = pacienteId
    payload.clinica_id  = clinicaId
    payload.criado_por  = userId

    const { data, error } = await supabase.from('agendamentos').insert(payload).select().single()
    if (error) return reply.code(500).send({ error: 'Erro ao criar agendamento: ' + error.message })
    return reply.code(201).send({ agendamento: data })
  } catch (e) {
    return reply.code(500).send({ error: e.message || 'Erro ao criar agendamento.' })
  }
}

// ══════════════════════════════════════════════════════════════════════════
//  GET /api/agendamentos?inicio=&fim=&incluir_canceladas=
//  Lista agendamentos da clínica num intervalo (calendário)
// ══════════════════════════════════════════════════════════════════════════
export async function listarDaClinica(request, reply) {
  try {
    const userId = getUserId(request)
    const clinicaId = await ensureClinica(userId)
    const inicio = sanitizarData(request.query.inicio)
    const fim    = sanitizarData(request.query.fim)
    const incluirCanc = String(request.query.incluir_canceladas || '').toLowerCase() === 'true'

    let qb = supabase.from('agendamentos')
      .select('id,paciente_id,profissional_id,profissional_nome,profissional_cor,data,hora,duracao_minutos,procedimento,observacoes,status,created_at,updated_at')
      .eq('clinica_id', clinicaId)
      .is('excluido_em', null)

    if (inicio) qb = qb.gte('data', inicio)
    if (fim)    qb = qb.lte('data', fim)
    if (!incluirCanc) qb = qb.neq('status', 'cancelado')

    qb = qb.order('data', { ascending: true }).order('hora', { ascending: true }).limit(2000)
    const { data, error } = await qb
    if (error) return reply.code(500).send({ error: 'Erro ao listar agendamentos: ' + error.message })

    // Anexa nome do paciente (uma query extra com IN)
    const ids = Array.from(new Set((data||[]).map(a => a.paciente_id)))
    let pacientesById = {}
    if (ids.length > 0) {
      const { data: pacs } = await supabase
        .from('pacientes').select('id,nome_completo,telefone_whatsapp')
        .in('id', ids).eq('clinica_id', clinicaId)
      ;(pacs || []).forEach(p => { pacientesById[p.id] = { nome: p.nome_completo, whatsapp: p.telefone_whatsapp || null } })
    }
    const result = (data || []).map(a => ({
      ...a,
      paciente_nome:     pacientesById[a.paciente_id]?.nome || null,
      paciente_whatsapp: pacientesById[a.paciente_id]?.whatsapp || null
    }))
    return reply.send({ agendamentos: result })
  } catch (e) {
    return reply.code(500).send({ error: e.message || 'Erro ao listar agendamentos.' })
  }
}

// ══════════════════════════════════════════════════════════════════════════
//  PUT /api/agendamentos/:id
// ══════════════════════════════════════════════════════════════════════════
export async function editar(request, reply) {
  try {
    const userId = getUserId(request)
    const clinicaId = await ensureClinica(userId)
    const { id } = request.params
    const body = request.body || {}

    const { data: atual, error: e1 } = await supabase
      .from('agendamentos').select('id,clinica_id,excluido_em')
      .eq('id', id).eq('clinica_id', clinicaId).maybeSingle()
    if (e1 || !atual) return reply.code(404).send({ error: 'Agendamento não encontrado.' })
    if (atual.excluido_em) return reply.code(404).send({ error: 'Agendamento já excluído.' })

    const payload = montarPayload(body)
    if (Object.keys(payload).length === 0) {
      return reply.send({ agendamento: atual })
    }
    if (payload.data === null) return reply.code(400).send({ error: 'Data inválida.' })
    if (payload.hora === null) return reply.code(400).send({ error: 'Hora inválida.' })

    const { data, error } = await supabase
      .from('agendamentos').update(payload)
      .eq('id', id).eq('clinica_id', clinicaId)
      .select().single()
    if (error) return reply.code(500).send({ error: 'Erro ao editar agendamento: ' + error.message })
    return reply.send({ agendamento: data })
  } catch (e) {
    return reply.code(500).send({ error: e.message || 'Erro ao editar agendamento.' })
  }
}

// ── Helper para mudanças de status ──────────────────────────────────────
async function mudarStatus(request, reply, novoStatus) {
  try {
    const userId = getUserId(request)
    const clinicaId = await ensureClinica(userId)
    const { id } = request.params

    const { data, error } = await supabase
      .from('agendamentos').update({ status: novoStatus })
      .eq('id', id).eq('clinica_id', clinicaId).is('excluido_em', null)
      .select().maybeSingle()
    if (error) return reply.code(500).send({ error: 'Erro ao atualizar status: ' + error.message })
    if (!data)  return reply.code(404).send({ error: 'Agendamento não encontrado.' })
    return reply.send({ agendamento: data })
  } catch (e) {
    return reply.code(500).send({ error: e.message || 'Erro ao atualizar status.' })
  }
}

export const confirmar = (req, rep) => mudarStatus(req, rep, 'confirmado')
export const cancelar  = (req, rep) => mudarStatus(req, rep, 'cancelado')
export const realizar  = (req, rep) => mudarStatus(req, rep, 'realizado')
export const faltar    = (req, rep) => mudarStatus(req, rep, 'faltou')

// ══════════════════════════════════════════════════════════════════════════
//  DELETE /api/agendamentos/:id  (soft delete)
// ══════════════════════════════════════════════════════════════════════════
export async function excluir(request, reply) {
  try {
    const userId = getUserId(request)
    const clinicaId = await ensureClinica(userId)
    const { id } = request.params

    const { data, error } = await supabase
      .from('agendamentos')
      .update({ excluido_em: new Date().toISOString() })
      .eq('id', id).eq('clinica_id', clinicaId).is('excluido_em', null)
      .select('id').maybeSingle()
    if (error) return reply.code(500).send({ error: 'Erro ao excluir: ' + error.message })
    if (!data)  return reply.code(404).send({ error: 'Agendamento não encontrado.' })
    return reply.send({ ok: true })
  } catch (e) {
    return reply.code(500).send({ error: e.message || 'Erro ao excluir agendamento.' })
  }
}
