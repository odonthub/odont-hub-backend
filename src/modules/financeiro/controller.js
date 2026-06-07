// src/modules/financeiro/controller.js
// FASE 2C — Financeiro do paciente: lançamentos (1 linha = 1 parcela)
// com soft delete (excluido_em). Vínculo a opção do plano é opcional.

import { supabase } from '../../config/database.js'
import { ensureClinica, getUserId, getPacienteDaClinica } from '../_shared/clinica.js'

const FORMAS_VALIDAS = new Set([
  'dinheiro','pix','cartao_credito','cartao_debito',
  'boleto','transferencia','outro'
])

function n2(v) { return Math.round(Number(v||0) * 100) / 100 }

function sanitizarForma(f) {
  if (f === undefined || f === null || f === '') return null
  const v = String(f).trim().toLowerCase()
  return FORMAS_VALIDAS.has(v) ? v : null
}

function sanitizarData(s) {
  if (!s) return null
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s
  return null
}

// Confirma que opcao_id pertence à mesma clínica/paciente (ou retorna null se opcao_id é null)
async function validarOpcao(opcaoId, pacienteId, clinicaId) {
  if (!opcaoId) return { ok: true, value: null }
  const { data, error } = await supabase
    .from('tratamento_opcoes').select('id,paciente_id,clinica_id,excluida_em')
    .eq('id', opcaoId).eq('clinica_id', clinicaId).maybeSingle()
  if (error) return { ok: false, msg: 'Erro ao validar opção: ' + error.message }
  if (!data || data.excluida_em || data.paciente_id !== pacienteId) {
    return { ok: false, msg: 'Opção do plano não encontrada para este paciente.' }
  }
  return { ok: true, value: opcaoId }
}

// Soma 1 mês de forma consistente (YYYY-MM-DD)
function somarMesesISO(dataIso, n) {
  const [y, m, d] = dataIso.split('-').map(Number)
  const target = new Date(Date.UTC(y, m - 1 + n, 1))
  // Última data válida do mês
  const ultDia = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate()
  const dia = Math.min(d, ultDia)
  target.setUTCDate(dia)
  return target.toISOString().slice(0, 10)
}

// ══════════════════════════════════════════════════════════════════════════
//  GET /api/pacientes/:pacienteId/financeiro
//  Lista lançamentos ativos + resumo
// ══════════════════════════════════════════════════════════════════════════
export async function listar(request, reply) {
  try {
    const userId = getUserId(request)
    const clinicaId = await ensureClinica(userId)
    const { pacienteId } = request.params

    const pac = await getPacienteDaClinica(pacienteId, clinicaId)
    if (!pac) return reply.code(404).send({ error: 'Paciente não encontrado.' })

    const { data, error } = await supabase
      .from('pagamentos')
      .select('id,paciente_id,opcao_id,descricao,valor,vencimento,status,pago_em,forma_pagamento,numero_parcela,total_parcelas,observacoes,created_at,updated_at')
      .eq('paciente_id', pacienteId).eq('clinica_id', clinicaId)
      .is('excluido_em', null)
      .order('vencimento', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: true })
      .limit(1000)
    if (error) return reply.code(500).send({ error: 'Erro ao listar pagamentos: ' + error.message })

    const lancamentos = data || []
    let totalPrevisto = 0, totalPago = 0
    let qtdPendente = 0, qtdPago = 0
    lancamentos.forEach(l => {
      totalPrevisto += Number(l.valor||0)
      if (l.status === 'pago') { totalPago += Number(l.valor||0); qtdPago++ }
      else { qtdPendente++ }
    })

    return reply.send({
      lancamentos,
      resumo: {
        total_previsto:  n2(totalPrevisto),
        total_pago:      n2(totalPago),
        total_a_receber: n2(totalPrevisto - totalPago),
        qtd_pendente:    qtdPendente,
        qtd_pago:        qtdPago
      }
    })
  } catch (e) {
    return reply.code(500).send({ error: e.message || 'Erro ao listar financeiro.' })
  }
}

// ══════════════════════════════════════════════════════════════════════════
//  POST /api/pacientes/:pacienteId/financeiro
//  Cria UM lançamento (avulso ou vinculado a opção)
// ══════════════════════════════════════════════════════════════════════════
export async function criar(request, reply) {
  try {
    const userId = getUserId(request)
    const clinicaId = await ensureClinica(userId)
    const { pacienteId } = request.params
    const body = request.body || {}

    const pac = await getPacienteDaClinica(pacienteId, clinicaId)
    if (!pac) return reply.code(404).send({ error: 'Paciente não encontrado.' })

    const descricao = String(body.descricao || '').trim()
    if (!descricao) return reply.code(400).send({ error: 'Descrição é obrigatória.' })

    const valor = n2(body.valor)
    if (!(valor >= 0)) return reply.code(400).send({ error: 'Valor inválido.' })

    const vencimento = sanitizarData(body.vencimento)

    const opcVal = await validarOpcao(body.opcao_id, pacienteId, clinicaId)
    if (!opcVal.ok) return reply.code(400).send({ error: opcVal.msg })

    const statusInicial = body.status === 'pago' ? 'pago' : 'pendente'
    const forma = sanitizarForma(body.forma_pagamento)
    if (statusInicial === 'pago' && !forma) {
      return reply.code(400).send({ error: 'Forma de pagamento obrigatória ao registrar como pago.' })
    }

    const pagoEm = statusInicial === 'pago'
      ? (body.pago_em ? new Date(body.pago_em).toISOString() : new Date().toISOString())
      : null

    const { data, error } = await supabase.from('pagamentos').insert({
      paciente_id:     pacienteId,
      clinica_id:      clinicaId,
      opcao_id:        opcVal.value,
      criado_por:      userId,
      descricao,
      valor,
      vencimento,
      status:          statusInicial,
      pago_em:         pagoEm,
      forma_pagamento: forma,
      observacoes:     body.observacoes ? String(body.observacoes).trim() : null
    }).select().single()

    if (error) return reply.code(500).send({ error: 'Erro ao criar lançamento: ' + error.message })
    return reply.code(201).send({ lancamento: data })
  } catch (e) {
    return reply.code(500).send({ error: e.message || 'Erro ao criar lançamento.' })
  }
}

// ══════════════════════════════════════════════════════════════════════════
//  POST /api/pacientes/:pacienteId/financeiro/parcelar
//  Gera N parcelas (todas pendentes), espaçamento mensal,
//  divide valor_total / quantidade — última parcela ajusta centavos.
// ══════════════════════════════════════════════════════════════════════════
export async function parcelar(request, reply) {
  try {
    const userId = getUserId(request)
    const clinicaId = await ensureClinica(userId)
    const { pacienteId } = request.params
    const body = request.body || {}

    const pac = await getPacienteDaClinica(pacienteId, clinicaId)
    if (!pac) return reply.code(404).send({ error: 'Paciente não encontrado.' })

    const descricaoBase = String(body.descricao || '').trim()
    if (!descricaoBase) return reply.code(400).send({ error: 'Descrição é obrigatória.' })

    const valorTotal = n2(body.valor_total)
    if (!(valorTotal > 0)) return reply.code(400).send({ error: 'Valor total deve ser maior que zero.' })

    const qtd = parseInt(body.quantidade, 10)
    if (!(qtd >= 1 && qtd <= 60)) return reply.code(400).send({ error: 'Quantidade entre 1 e 60.' })

    const primeira = sanitizarData(body.primeira_data)
    if (!primeira) return reply.code(400).send({ error: 'Data da primeira parcela inválida (AAAA-MM-DD).' })

    const forma = sanitizarForma(body.forma_pagamento) // opcional pra pendentes
    const opcVal = await validarOpcao(body.opcao_id, pacienteId, clinicaId)
    if (!opcVal.ok) return reply.code(400).send({ error: opcVal.msg })

    // Divisão: cada parcela = floor(valor_total / qtd, 2 casas); última ajusta resto
    const cents = Math.round(valorTotal * 100)
    const baseCents = Math.floor(cents / qtd)
    const restoCents = cents - baseCents * qtd
    const valorBase = baseCents / 100
    const valorUltima = (baseCents + restoCents) / 100

    const rows = []
    for (let i = 1; i <= qtd; i++) {
      const valorParcela = (i === qtd) ? valorUltima : valorBase
      rows.push({
        paciente_id:     pacienteId,
        clinica_id:      clinicaId,
        opcao_id:        opcVal.value,
        criado_por:      userId,
        descricao:       descricaoBase + ' (' + i + '/' + qtd + ')',
        valor:           valorParcela,
        vencimento:      somarMesesISO(primeira, i - 1),
        status:          'pendente',
        forma_pagamento: forma,
        numero_parcela:  i,
        total_parcelas:  qtd
      })
    }

    const { data, error } = await supabase.from('pagamentos').insert(rows).select()
    if (error) return reply.code(500).send({ error: 'Erro ao gerar parcelas: ' + error.message })
    return reply.code(201).send({ lancamentos: data || [] })
  } catch (e) {
    return reply.code(500).send({ error: e.message || 'Erro ao parcelar.' })
  }
}

// ══════════════════════════════════════════════════════════════════════════
//  PUT /api/financeiro/:id  — edita campos básicos (não muda status)
// ══════════════════════════════════════════════════════════════════════════
export async function editar(request, reply) {
  try {
    const userId = getUserId(request)
    const clinicaId = await ensureClinica(userId)
    const { id } = request.params
    const body = request.body || {}

    const { data: atual, error: eAtu } = await supabase
      .from('pagamentos').select('id,clinica_id,excluido_em,paciente_id')
      .eq('id', id).eq('clinica_id', clinicaId).maybeSingle()
    if (eAtu || !atual) return reply.code(404).send({ error: 'Lançamento não encontrado.' })
    if (atual.excluido_em) return reply.code(404).send({ error: 'Lançamento já excluído.' })

    const update = {}
    if (body.descricao !== undefined) {
      const d = String(body.descricao||'').trim()
      if (!d) return reply.code(400).send({ error: 'Descrição é obrigatória.' })
      update.descricao = d
    }
    if (body.valor !== undefined) {
      const v = n2(body.valor)
      if (!(v >= 0)) return reply.code(400).send({ error: 'Valor inválido.' })
      update.valor = v
    }
    if (body.vencimento !== undefined) update.vencimento = sanitizarData(body.vencimento)
    if (body.observacoes !== undefined) update.observacoes = body.observacoes ? String(body.observacoes).trim() : null
    if (body.forma_pagamento !== undefined) update.forma_pagamento = sanitizarForma(body.forma_pagamento)
    if (body.opcao_id !== undefined) {
      const opcVal = await validarOpcao(body.opcao_id, atual.paciente_id, clinicaId)
      if (!opcVal.ok) return reply.code(400).send({ error: opcVal.msg })
      update.opcao_id = opcVal.value
    }

    const { data, error } = await supabase
      .from('pagamentos').update(update)
      .eq('id', id).eq('clinica_id', clinicaId).select().single()
    if (error) return reply.code(500).send({ error: 'Erro ao editar: ' + error.message })
    return reply.send({ lancamento: data })
  } catch (e) {
    return reply.code(500).send({ error: e.message || 'Erro ao editar lançamento.' })
  }
}

// ══════════════════════════════════════════════════════════════════════════
//  POST /api/financeiro/:id/marcar-pago
//  Body: { forma_pagamento (obrigatório), pago_em? }
// ══════════════════════════════════════════════════════════════════════════
export async function marcarPago(request, reply) {
  try {
    const userId = getUserId(request)
    const clinicaId = await ensureClinica(userId)
    const { id } = request.params
    const body = request.body || {}

    const forma = sanitizarForma(body.forma_pagamento)
    if (!forma) return reply.code(400).send({ error: 'Forma de pagamento obrigatória.' })
    const pagoEm = body.pago_em ? new Date(body.pago_em).toISOString() : new Date().toISOString()

    const { data, error } = await supabase
      .from('pagamentos')
      .update({ status: 'pago', forma_pagamento: forma, pago_em: pagoEm })
      .eq('id', id).eq('clinica_id', clinicaId).is('excluido_em', null)
      .select().maybeSingle()
    if (error) return reply.code(500).send({ error: 'Erro ao marcar pago: ' + error.message })
    if (!data)  return reply.code(404).send({ error: 'Lançamento não encontrado.' })
    return reply.send({ lancamento: data })
  } catch (e) {
    return reply.code(500).send({ error: e.message || 'Erro ao marcar pago.' })
  }
}

// ══════════════════════════════════════════════════════════════════════════
//  POST /api/financeiro/:id/marcar-pendente
//  Reverte: status=pendente, pago_em=null
// ══════════════════════════════════════════════════════════════════════════
export async function marcarPendente(request, reply) {
  try {
    const userId = getUserId(request)
    const clinicaId = await ensureClinica(userId)
    const { id } = request.params

    const { data, error } = await supabase
      .from('pagamentos')
      .update({ status: 'pendente', pago_em: null })
      .eq('id', id).eq('clinica_id', clinicaId).is('excluido_em', null)
      .select().maybeSingle()
    if (error) return reply.code(500).send({ error: 'Erro ao reverter: ' + error.message })
    if (!data)  return reply.code(404).send({ error: 'Lançamento não encontrado.' })
    return reply.send({ lancamento: data })
  } catch (e) {
    return reply.code(500).send({ error: e.message || 'Erro ao reverter status.' })
  }
}

// ══════════════════════════════════════════════════════════════════════════
//  DELETE /api/financeiro/:id  (soft delete via excluido_em)
// ══════════════════════════════════════════════════════════════════════════
export async function excluir(request, reply) {
  try {
    const userId = getUserId(request)
    const clinicaId = await ensureClinica(userId)
    const { id } = request.params

    const { data, error } = await supabase
      .from('pagamentos')
      .update({ excluido_em: new Date().toISOString() })
      .eq('id', id).eq('clinica_id', clinicaId).is('excluido_em', null)
      .select('id').maybeSingle()
    if (error) return reply.code(500).send({ error: 'Erro ao excluir: ' + error.message })
    if (!data)  return reply.code(404).send({ error: 'Lançamento não encontrado.' })
    return reply.send({ ok: true })
  } catch (e) {
    return reply.code(500).send({ error: e.message || 'Erro ao excluir lançamento.' })
  }
}
