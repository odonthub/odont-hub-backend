// src/modules/evolucoes/controller.js
// FASE 2A — Evoluções clínicas (várias por paciente, linha do tempo)
// Soft delete via coluna `excluida_em` (NULL = ativa).

import { supabase } from '../../config/database.js'
import { ensureClinica, getUserId, getUserName, getPacienteDaClinica } from '../_shared/clinica.js'

function sanitizarDescricao(s) {
  return String(s || '').trim()
}

function sanitizarData(s) {
  if (!s) return null
  // Aceita ISO yyyy-mm-dd
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s
  return null
}

// GET /api/evolucoes/paciente/:pacienteId
export async function listar(request, reply) {
  try {
    const userId = getUserId(request)
    const clinicaId = await ensureClinica(userId)
    const { pacienteId } = request.params

    const pac = await getPacienteDaClinica(pacienteId, clinicaId)
    if (!pac) return reply.code(404).send({ error: 'Paciente não encontrado.' })

    const { data, error } = await supabase
      .from('evolucoes')
      .select('id,paciente_id,autor_id,autor_nome,data,descricao,created_at,updated_at')
      .eq('paciente_id', pacienteId).eq('clinica_id', clinicaId)
      .is('excluida_em', null)
      .order('data', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(500)

    if (error) return reply.code(500).send({ error: 'Erro ao listar evoluções: ' + error.message })
    return reply.send({ evolucoes: data || [] })
  } catch (e) {
    return reply.code(500).send({ error: e.message || 'Erro ao listar evoluções.' })
  }
}

// POST /api/evolucoes/paciente/:pacienteId
export async function criar(request, reply) {
  try {
    const userId = getUserId(request)
    const clinicaId = await ensureClinica(userId)
    const { pacienteId } = request.params
    const body = request.body || {}

    const pac = await getPacienteDaClinica(pacienteId, clinicaId)
    if (!pac) return reply.code(404).send({ error: 'Paciente não encontrado.' })

    const descricao = sanitizarDescricao(body.descricao)
    if (!descricao) return reply.code(400).send({ error: 'Descrição é obrigatória.' })

    const data = sanitizarData(body.data) || new Date().toISOString().slice(0, 10)
    const autor_nome = getUserName(request)

    const { data: inserted, error } = await supabase.from('evolucoes').insert({
      paciente_id: pacienteId,
      clinica_id:  clinicaId,
      autor_id:    userId,
      autor_nome,
      data,
      descricao
    }).select().single()

    if (error) return reply.code(500).send({ error: 'Erro ao criar evolução: ' + error.message })
    return reply.code(201).send({ evolucao: inserted })
  } catch (e) {
    return reply.code(500).send({ error: e.message || 'Erro ao criar evolução.' })
  }
}

// PUT /api/evolucoes/:id
export async function editar(request, reply) {
  try {
    const userId = getUserId(request)
    const clinicaId = await ensureClinica(userId)
    const { id } = request.params
    const body = request.body || {}

    // Verifica posse antes de editar (clinica + não excluída)
    const { data: atual, error: e1 } = await supabase
      .from('evolucoes').select('id,clinica_id,excluida_em')
      .eq('id', id).eq('clinica_id', clinicaId).maybeSingle()
    if (e1 || !atual) return reply.code(404).send({ error: 'Evolução não encontrada.' })
    if (atual.excluida_em) return reply.code(404).send({ error: 'Evolução já excluída.' })

    const update = {}
    if (body.descricao !== undefined) {
      const d = sanitizarDescricao(body.descricao)
      if (!d) return reply.code(400).send({ error: 'Descrição é obrigatória.' })
      update.descricao = d
    }
    if (body.data !== undefined) {
      const d = sanitizarData(body.data)
      if (!d) return reply.code(400).send({ error: 'Data inválida (use AAAA-MM-DD).' })
      update.data = d
    }
    // Atualiza snapshot do autor da última edição
    update.autor_id = userId
    const nome = getUserName(request)
    if (nome) update.autor_nome = nome

    const { data, error } = await supabase
      .from('evolucoes').update(update)
      .eq('id', id).eq('clinica_id', clinicaId)
      .select().single()

    if (error) return reply.code(500).send({ error: 'Erro ao editar: ' + error.message })
    return reply.send({ evolucao: data })
  } catch (e) {
    return reply.code(500).send({ error: e.message || 'Erro ao editar evolução.' })
  }
}

// DELETE /api/evolucoes/:id  (soft: marca excluida_em)
export async function excluir(request, reply) {
  try {
    const userId = getUserId(request)
    const clinicaId = await ensureClinica(userId)
    const { id } = request.params

    const { data, error } = await supabase
      .from('evolucoes').update({ excluida_em: new Date().toISOString() })
      .eq('id', id).eq('clinica_id', clinicaId).is('excluida_em', null)
      .select('id').maybeSingle()

    if (error)   return reply.code(500).send({ error: 'Erro ao excluir: ' + error.message })
    if (!data)   return reply.code(404).send({ error: 'Evolução não encontrada.' })
    return reply.send({ ok: true })
  } catch (e) {
    return reply.code(500).send({ error: e.message || 'Erro ao excluir evolução.' })
  }
}
