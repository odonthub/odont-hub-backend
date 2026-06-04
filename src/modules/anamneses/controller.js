// src/modules/anamneses/controller.js
// FASE 2A — 1 anamnese por paciente, com respostas em JSONB.

import { supabase } from '../../config/database.js'
import { ensureClinica, getUserId, getPacienteDaClinica } from '../_shared/clinica.js'

function payloadValido(body) {
  if (body == null || typeof body !== 'object') return false
  if (body.respostas !== undefined && typeof body.respostas !== 'object') return false
  return true
}

// GET /api/anamneses/paciente/:pacienteId
// Retorna { anamnese } ou { anamnese: null } se ainda não existe.
export async function porPaciente(request, reply) {
  try {
    const userId = getUserId(request)
    const clinicaId = await ensureClinica(userId)
    const { pacienteId } = request.params

    const pac = await getPacienteDaClinica(pacienteId, clinicaId)
    if (!pac) return reply.code(404).send({ error: 'Paciente não encontrado.' })

    const { data, error } = await supabase
      .from('anamneses').select('*')
      .eq('paciente_id', pacienteId).eq('clinica_id', clinicaId)
      .maybeSingle()
    if (error) return reply.code(500).send({ error: 'Erro ao buscar anamnese: ' + error.message })
    return reply.send({ anamnese: data || null })
  } catch (e) {
    return reply.code(500).send({ error: e.message || 'Erro ao buscar anamnese.' })
  }
}

// PUT /api/anamneses/paciente/:pacienteId  — upsert (cria se não existe)
export async function salvar(request, reply) {
  try {
    const userId = getUserId(request)
    const clinicaId = await ensureClinica(userId)
    const { pacienteId } = request.params
    const body = request.body || {}

    const pac = await getPacienteDaClinica(pacienteId, clinicaId)
    if (!pac) return reply.code(404).send({ error: 'Paciente não encontrado.' })

    if (!payloadValido(body)) {
      return reply.code(400).send({ error: 'Corpo inválido.' })
    }

    const respostas   = body.respostas   ?? {}
    const observacoes = body.observacoes ?? null

    // Upsert manual: tenta atualizar; se não existir, insere.
    const { data: existente } = await supabase
      .from('anamneses').select('id')
      .eq('paciente_id', pacienteId).eq('clinica_id', clinicaId).maybeSingle()

    let res
    if (existente) {
      res = await supabase.from('anamneses').update({
        respostas, observacoes, atualizada_por: userId
      }).eq('id', existente.id).eq('clinica_id', clinicaId).select().single()
    } else {
      res = await supabase.from('anamneses').insert({
        paciente_id: pacienteId, clinica_id: clinicaId,
        atualizada_por: userId, respostas, observacoes
      }).select().single()
    }

    if (res.error) return reply.code(500).send({ error: 'Erro ao salvar anamnese: ' + res.error.message })
    return reply.send({ anamnese: res.data })
  } catch (e) {
    return reply.code(500).send({ error: e.message || 'Erro ao salvar anamnese.' })
  }
}
