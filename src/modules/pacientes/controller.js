// src/modules/pacientes/controller.js
// FASE 1 do módulo clínico — Cadastro/Lista/Detalhe/Edição/Soft-delete
// Filtra TUDO por clinica_id do usuário autenticado (multi-clínica).

import { supabase } from '../../config/database.js'
import { ensureClinica, getUserId } from '../_shared/clinica.js'

// Campos que o cliente pode enviar (whitelist) — protege contra mass-assignment
const CAMPOS_GRAVAVEIS = [
  'nome_completo','apelido','data_nascimento','sexo','cpf','rg','estado_civil',
  'telefone_whatsapp','telefone_fixo','email','convenio','profissao',
  'cep','endereco','numero','complemento','bairro','cidade','uf','observacoes',
  'ativo'
]

// ── Helpers ───────────────────────────────────────────────────────────────
function soDigitos(v) { return String(v||'').replace(/\D/g,'') }

function validarCPF(cpf) {
  if (!cpf) return { ok: true }                 // CPF é opcional
  const d = soDigitos(cpf)
  if (d.length !== 11)            return { ok: false, msg: 'CPF deve ter 11 dígitos.' }
  if (/^(\d)\1{10}$/.test(d))     return { ok: false, msg: 'CPF inválido.' }
  // Validação de dígito verificador
  const calc = (base, peso) => {
    let s = 0
    for (let i = 0; i < base.length; i++) s += Number(base[i]) * (peso - i)
    const r = (s * 10) % 11
    return r === 10 ? 0 : r
  }
  if (calc(d.slice(0,9),  10) !== Number(d[9]))  return { ok: false, msg: 'CPF inválido.' }
  if (calc(d.slice(0,10), 11) !== Number(d[10])) return { ok: false, msg: 'CPF inválido.' }
  return { ok: true, valor: d }
}

function sanitizarUF(uf) {
  if (!uf) return null
  const v = String(uf).trim().toUpperCase().slice(0, 2)
  return v.length === 2 ? v : null
}

function montarPayload(body) {
  const out = {}
  for (const k of CAMPOS_GRAVAVEIS) {
    if (body[k] !== undefined) out[k] = body[k]
  }
  if (out.nome_completo) out.nome_completo = String(out.nome_completo).trim()
  if (out.uf !== undefined) out.uf = sanitizarUF(out.uf)
  if (out.cpf !== undefined) out.cpf = out.cpf ? soDigitos(out.cpf) : null
  // Datas vazias viram null
  if (out.data_nascimento === '') out.data_nascimento = null
  return out
}

// ensureClinica vive em ../_shared/clinica.js (FASE 2A)

// ══════════════════════════════════════════════════════════════════════════
//  LISTA + BUSCA
//  GET /api/pacientes?q=texto
// ══════════════════════════════════════════════════════════════════════════
export async function listar(request, reply) {
  try {
    const clinica_id = await ensureClinica(getUserId(request))
    const q = (request.query.q || '').toString().trim()

    let qb = supabase.from('pacientes')
      .select('id,nome_completo,apelido,telefone_whatsapp,email,cpf,ativo,updated_at')
      .eq('clinica_id', clinica_id)
      .eq('ativo', true)
      .order('nome_completo', { ascending: true })
      .limit(500)

    if (q) {
      const digits = soDigitos(q)
      if (digits.length >= 3) {
        // Busca por CPF (dígitos) OU por nome
        qb = qb.or(`nome_completo.ilike.%${q}%,cpf.ilike.%${digits}%`)
      } else {
        qb = qb.ilike('nome_completo', `%${q}%`)
      }
    }

    const { data, error } = await qb
    if (error) return reply.code(500).send({ error: 'Erro ao listar pacientes.' })
    return reply.send({ pacientes: data || [] })
  } catch (e) {
    return reply.code(500).send({ error: e.message || 'Erro ao listar.' })
  }
}

// ══════════════════════════════════════════════════════════════════════════
//  DETALHE
//  GET /api/pacientes/:id
// ══════════════════════════════════════════════════════════════════════════
export async function detalhe(request, reply) {
  try {
    const clinica_id = await ensureClinica(getUserId(request))
    const { id } = request.params

    const { data, error } = await supabase
      .from('pacientes').select('*')
      .eq('id', id).eq('clinica_id', clinica_id).single()

    if (error || !data) return reply.code(404).send({ error: 'Paciente não encontrado.' })
    return reply.send({ paciente: data })
  } catch (e) {
    return reply.code(500).send({ error: e.message || 'Erro ao buscar.' })
  }
}

// ══════════════════════════════════════════════════════════════════════════
//  CRIAR
//  POST /api/pacientes
// ══════════════════════════════════════════════════════════════════════════
export async function criar(request, reply) {
  try {
    const clinica_id = await ensureClinica(getUserId(request))
    const payload = montarPayload(request.body || {})

    if (!payload.nome_completo) {
      return reply.code(400).send({ error: 'Nome completo é obrigatório.' })
    }

    const v = validarCPF(payload.cpf)
    if (!v.ok) return reply.code(400).send({ error: v.msg })
    if (v.valor) payload.cpf = v.valor

    payload.clinica_id = clinica_id
    payload.criado_por = getUserId(request)

    const { data, error } = await supabase
      .from('pacientes').insert(payload).select().single()

    if (error) {
      // Duplicidade de CPF dentro da clínica
      if (String(error.message).toLowerCase().includes('uq_pacientes_clinica_cpf') ||
          String(error.code) === '23505') {
        return reply.code(409).send({ error: 'Já existe um paciente com este CPF nesta clínica.' })
      }
      return reply.code(500).send({ error: 'Erro ao criar paciente: ' + error.message })
    }

    return reply.code(201).send({ paciente: data })
  } catch (e) {
    return reply.code(500).send({ error: e.message || 'Erro ao criar.' })
  }
}

// ══════════════════════════════════════════════════════════════════════════
//  EDITAR
//  PUT /api/pacientes/:id
// ══════════════════════════════════════════════════════════════════════════
export async function editar(request, reply) {
  try {
    const clinica_id = await ensureClinica(getUserId(request))
    const { id } = request.params
    const payload = montarPayload(request.body || {})

    // Verifica posse antes de editar
    const { data: atual, error: eAtual } = await supabase
      .from('pacientes').select('id,clinica_id')
      .eq('id', id).eq('clinica_id', clinica_id).single()
    if (eAtual || !atual) return reply.code(404).send({ error: 'Paciente não encontrado.' })

    if (payload.nome_completo !== undefined && !payload.nome_completo) {
      return reply.code(400).send({ error: 'Nome completo é obrigatório.' })
    }

    if (payload.cpf !== undefined) {
      const v = validarCPF(payload.cpf)
      if (!v.ok) return reply.code(400).send({ error: v.msg })
      payload.cpf = v.valor || null
    }

    // clinica_id e criado_por nunca podem ser alterados por aqui
    delete payload.clinica_id
    delete payload.criado_por

    const { data, error } = await supabase
      .from('pacientes').update(payload)
      .eq('id', id).eq('clinica_id', clinica_id)
      .select().single()

    if (error) {
      if (String(error.code) === '23505') {
        return reply.code(409).send({ error: 'Já existe um paciente com este CPF nesta clínica.' })
      }
      return reply.code(500).send({ error: 'Erro ao editar paciente.' })
    }
    return reply.send({ paciente: data })
  } catch (e) {
    return reply.code(500).send({ error: e.message || 'Erro ao editar.' })
  }
}

// ══════════════════════════════════════════════════════════════════════════
//  SOFT DELETE  (ativo = false)
//  DELETE /api/pacientes/:id
// ══════════════════════════════════════════════════════════════════════════
export async function inativar(request, reply) {
  try {
    const clinica_id = await ensureClinica(getUserId(request))
    const { id } = request.params

    const { data, error } = await supabase
      .from('pacientes').update({ ativo: false })
      .eq('id', id).eq('clinica_id', clinica_id)
      .select('id').single()

    if (error || !data) return reply.code(404).send({ error: 'Paciente não encontrado.' })
    return reply.send({ ok: true })
  } catch (e) {
    return reply.code(500).send({ error: e.message || 'Erro ao inativar.' })
  }
}
