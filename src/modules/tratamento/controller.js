// src/modules/tratamento/controller.js
// FASE 2B — Plano de tratamento: opções (alternativas) + itens.
// Apenas UMA opção ativa pode estar 'aprovada' por paciente (índice parcial único).
// Soft delete via coluna `excluida_em` em tratamento_opcoes.

import { supabase } from '../../config/database.js'
import { ensureClinica, getUserId, getPacienteDaClinica } from '../_shared/clinica.js'

// ── Helpers ──────────────────────────────────────────────────────────────
function sanitizarItens(itensRaw) {
  if (!Array.isArray(itensRaw)) return []
  const out = []
  itensRaw.forEach((it, idx) => {
    if (!it || typeof it !== 'object') return
    const procedimento = String(it.procedimento || '').trim()
    if (!procedimento) return
    const qtd = Math.max(1, parseInt(it.quantidade, 10) || 1)
    const vl  = Math.max(0, Number(it.valor_unitario) || 0)
    out.push({
      procedimento,
      dente:          it.dente ? String(it.dente).trim() : null,
      quantidade:     qtd,
      valor_unitario: vl,
      ordem:          Number.isFinite(it.ordem) ? Number(it.ordem) : idx
    })
  })
  return out
}

function calcularTotal(itens) {
  return (itens || []).reduce((s, it) => s + Number(it.valor_unitario||0) * Number(it.quantidade||0), 0)
}

// Buscar uma opção da clínica (não excluída por padrão)
async function getOpcao(opcaoId, clinicaId, { incluirExcluida = false } = {}) {
  let qb = supabase.from('tratamento_opcoes')
    .select('id,paciente_id,clinica_id,status,excluida_em')
    .eq('id', opcaoId).eq('clinica_id', clinicaId)
  const { data, error } = await qb.maybeSingle()
  if (error || !data) return null
  if (!incluirExcluida && data.excluida_em) return null
  return data
}

// ══════════════════════════════════════════════════════════════════════════
//  GET /api/pacientes/:pacienteId/tratamento
//  Lista opções ativas + itens + total calculado por opção
// ══════════════════════════════════════════════════════════════════════════
export async function listar(request, reply) {
  try {
    const userId = getUserId(request)
    const clinicaId = await ensureClinica(userId)
    const { pacienteId } = request.params

    const pac = await getPacienteDaClinica(pacienteId, clinicaId)
    if (!pac) return reply.code(404).send({ error: 'Paciente não encontrado.' })

    const { data: opcoes, error: e1 } = await supabase
      .from('tratamento_opcoes')
      .select('id,titulo,descricao,status,aprovada_em,ordem,created_at,updated_at')
      .eq('paciente_id', pacienteId).eq('clinica_id', clinicaId)
      .is('excluida_em', null)
      .order('ordem', { ascending: true })
      .order('created_at', { ascending: true })

    if (e1) return reply.code(500).send({ error: 'Erro ao listar opções: ' + e1.message })

    if (!opcoes || opcoes.length === 0) {
      return reply.send({ opcoes: [] })
    }

    const ids = opcoes.map(o => o.id)
    const { data: itens, error: e2 } = await supabase
      .from('tratamento_itens')
      .select('id,opcao_id,procedimento,dente,quantidade,valor_unitario,ordem')
      .in('opcao_id', ids)
      .eq('clinica_id', clinicaId)
      .order('ordem', { ascending: true })
    if (e2) return reply.code(500).send({ error: 'Erro ao listar itens: ' + e2.message })

    const porOpcao = {}
    ;(itens || []).forEach(it => {
      if (!porOpcao[it.opcao_id]) porOpcao[it.opcao_id] = []
      porOpcao[it.opcao_id].push(it)
    })

    const resposta = opcoes.map(o => {
      const its = porOpcao[o.id] || []
      return { ...o, itens: its, total: calcularTotal(its) }
    })
    return reply.send({ opcoes: resposta })
  } catch (e) {
    return reply.code(500).send({ error: e.message || 'Erro ao listar tratamento.' })
  }
}

// ══════════════════════════════════════════════════════════════════════════
//  POST /api/pacientes/:pacienteId/tratamento
//  Cria nova opção (status='proposta') + itens
// ══════════════════════════════════════════════════════════════════════════
export async function criar(request, reply) {
  try {
    const userId = getUserId(request)
    const clinicaId = await ensureClinica(userId)
    const { pacienteId } = request.params
    const body = request.body || {}

    const pac = await getPacienteDaClinica(pacienteId, clinicaId)
    if (!pac) return reply.code(404).send({ error: 'Paciente não encontrado.' })

    const titulo = String(body.titulo || '').trim()
    if (!titulo) return reply.code(400).send({ error: 'Título é obrigatório.' })

    const descricao = body.descricao ? String(body.descricao).trim() : null
    const itens = sanitizarItens(body.itens)

    // Próxima `ordem`
    const { data: ult } = await supabase
      .from('tratamento_opcoes').select('ordem')
      .eq('paciente_id', pacienteId).eq('clinica_id', clinicaId)
      .is('excluida_em', null)
      .order('ordem', { ascending: false }).limit(1).maybeSingle()
    const proximaOrdem = (ult?.ordem ?? -1) + 1

    const { data: opcao, error: eOp } = await supabase
      .from('tratamento_opcoes').insert({
        paciente_id: pacienteId,
        clinica_id:  clinicaId,
        criado_por:  userId,
        titulo, descricao,
        status:      'proposta',
        ordem:       proximaOrdem
      }).select().single()
    if (eOp) return reply.code(500).send({ error: 'Erro ao criar opção: ' + eOp.message })

    if (itens.length > 0) {
      const rowsItens = itens.map(it => ({ ...it, opcao_id: opcao.id, clinica_id: clinicaId }))
      const { error: eIt } = await supabase.from('tratamento_itens').insert(rowsItens)
      if (eIt) {
        // Rollback manual: remover a opção criada se itens falharem
        await supabase.from('tratamento_opcoes').delete().eq('id', opcao.id)
        return reply.code(500).send({ error: 'Erro ao gravar itens: ' + eIt.message })
      }
    }

    // Retorna a opção com itens + total
    const opcaoFinal = { ...opcao, itens, total: calcularTotal(itens) }
    return reply.code(201).send({ opcao: opcaoFinal })
  } catch (e) {
    return reply.code(500).send({ error: e.message || 'Erro ao criar opção.' })
  }
}

// ══════════════════════════════════════════════════════════════════════════
//  PUT /api/tratamento/opcoes/:opcaoId
//  Edita título/descrição e SUBSTITUI todos os itens.
//  Bloqueia se opção já estiver aprovada (sua spec: precisa Reabrir primeiro).
// ══════════════════════════════════════════════════════════════════════════
export async function editar(request, reply) {
  try {
    const userId = getUserId(request)
    const clinicaId = await ensureClinica(userId)
    const { opcaoId } = request.params
    const body = request.body || {}

    const atual = await getOpcao(opcaoId, clinicaId)
    if (!atual) return reply.code(404).send({ error: 'Opção não encontrada.' })
    if (atual.status === 'aprovada') {
      return reply.code(409).send({ error: 'Opção já aprovada. Use "Reabrir" antes de editar.' })
    }

    const update = {}
    if (body.titulo !== undefined) {
      const t = String(body.titulo || '').trim()
      if (!t) return reply.code(400).send({ error: 'Título é obrigatório.' })
      update.titulo = t
    }
    if (body.descricao !== undefined) {
      update.descricao = body.descricao ? String(body.descricao).trim() : null
    }

    if (Object.keys(update).length > 0) {
      const { error: eUp } = await supabase
        .from('tratamento_opcoes').update(update)
        .eq('id', opcaoId).eq('clinica_id', clinicaId)
      if (eUp) return reply.code(500).send({ error: 'Erro ao editar opção: ' + eUp.message })
    }

    // Substitui itens (DELETE + INSERT)
    const novos = sanitizarItens(body.itens)
    const { error: eDel } = await supabase
      .from('tratamento_itens').delete()
      .eq('opcao_id', opcaoId).eq('clinica_id', clinicaId)
    if (eDel) return reply.code(500).send({ error: 'Erro ao limpar itens antigos: ' + eDel.message })

    if (novos.length > 0) {
      const rows = novos.map(it => ({ ...it, opcao_id: opcaoId, clinica_id: clinicaId }))
      const { error: eIns } = await supabase.from('tratamento_itens').insert(rows)
      if (eIns) return reply.code(500).send({ error: 'Erro ao gravar itens: ' + eIns.message })
    }

    // Retorna a opção atualizada com itens e total
    const { data: opFinal, error: eFin } = await supabase
      .from('tratamento_opcoes').select('*')
      .eq('id', opcaoId).eq('clinica_id', clinicaId).single()
    if (eFin) return reply.code(500).send({ error: 'Erro ao recuperar opção: ' + eFin.message })

    const { data: itens } = await supabase
      .from('tratamento_itens')
      .select('id,opcao_id,procedimento,dente,quantidade,valor_unitario,ordem')
      .eq('opcao_id', opcaoId).eq('clinica_id', clinicaId)
      .order('ordem', { ascending: true })

    return reply.send({ opcao: { ...opFinal, itens: itens || [], total: calcularTotal(itens || []) } })
  } catch (e) {
    return reply.code(500).send({ error: e.message || 'Erro ao editar opção.' })
  }
}

// ══════════════════════════════════════════════════════════════════════════
//  POST /api/tratamento/opcoes/:opcaoId/aprovar
//  Marca esta opção como 'aprovada' + as outras do paciente como 'recusada'.
//  O índice UNIQUE parcial garante que só haja 1 aprovada ativa por paciente.
// ══════════════════════════════════════════════════════════════════════════
export async function aprovar(request, reply) {
  try {
    const userId = getUserId(request)
    const clinicaId = await ensureClinica(userId)
    const { opcaoId } = request.params

    const atual = await getOpcao(opcaoId, clinicaId)
    if (!atual) return reply.code(404).send({ error: 'Opção não encontrada.' })

    const pacienteId = atual.paciente_id

    // 1) Recusar todas as OUTRAS opções ativas do paciente (que estão aprovada
    //    ou proposta) — não toca em recusadas nem excluídas.
    const { error: e1 } = await supabase
      .from('tratamento_opcoes')
      .update({ status: 'recusada', aprovada_em: null })
      .eq('paciente_id', pacienteId)
      .eq('clinica_id', clinicaId)
      .is('excluida_em', null)
      .neq('id', opcaoId)
      .in('status', ['aprovada','proposta'])
    if (e1) return reply.code(500).send({ error: 'Erro ao recusar outras opções: ' + e1.message })

    // 2) Aprovar esta opção
    const { error: e2 } = await supabase
      .from('tratamento_opcoes')
      .update({ status: 'aprovada', aprovada_em: new Date().toISOString() })
      .eq('id', opcaoId).eq('clinica_id', clinicaId)
    if (e2) return reply.code(500).send({ error: 'Erro ao aprovar opção: ' + e2.message })

    return reply.send({ ok: true })
  } catch (e) {
    return reply.code(500).send({ error: e.message || 'Erro ao aprovar opção.' })
  }
}

// ══════════════════════════════════════════════════════════════════════════
//  POST /api/tratamento/opcoes/:opcaoId/reabrir
//  Volta uma opção 'aprovada' para 'proposta' (permite re-editar).
// ══════════════════════════════════════════════════════════════════════════
export async function reabrir(request, reply) {
  try {
    const userId = getUserId(request)
    const clinicaId = await ensureClinica(userId)
    const { opcaoId } = request.params

    const atual = await getOpcao(opcaoId, clinicaId)
    if (!atual) return reply.code(404).send({ error: 'Opção não encontrada.' })
    if (atual.status !== 'aprovada') {
      return reply.code(409).send({ error: 'Só é possível reabrir uma opção aprovada.' })
    }

    const { error } = await supabase
      .from('tratamento_opcoes')
      .update({ status: 'proposta', aprovada_em: null })
      .eq('id', opcaoId).eq('clinica_id', clinicaId)
    if (error) return reply.code(500).send({ error: 'Erro ao reabrir opção: ' + error.message })
    return reply.send({ ok: true })
  } catch (e) {
    return reply.code(500).send({ error: e.message || 'Erro ao reabrir opção.' })
  }
}

// ══════════════════════════════════════════════════════════════════════════
//  DELETE /api/tratamento/opcoes/:opcaoId  (soft delete via excluida_em)
// ══════════════════════════════════════════════════════════════════════════
export async function excluir(request, reply) {
  try {
    const userId = getUserId(request)
    const clinicaId = await ensureClinica(userId)
    const { opcaoId } = request.params

    const { data, error } = await supabase
      .from('tratamento_opcoes')
      .update({ excluida_em: new Date().toISOString() })
      .eq('id', opcaoId).eq('clinica_id', clinicaId).is('excluida_em', null)
      .select('id').maybeSingle()
    if (error) return reply.code(500).send({ error: 'Erro ao excluir: ' + error.message })
    if (!data)  return reply.code(404).send({ error: 'Opção não encontrada.' })
    return reply.send({ ok: true })
  } catch (e) {
    return reply.code(500).send({ error: e.message || 'Erro ao excluir opção.' })
  }
}
