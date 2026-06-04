// src/modules/_shared/clinica.js
// Helpers compartilhados pelo módulo clínico (pacientes, anamneses, evolucoes).
//
// Garante que TODA operação de leitura/escrita seja filtrada pela clinica_id
// do usuário autenticado. SERVICE_KEY bypassa RLS — a segurança real está aqui.

import { supabase } from '../../config/database.js'

// Resolve o userId vindo do JWT (alguns setups usam .id, outros .sub)
export function getUserId(request) {
  return request?.user?.id || request?.user?.sub || null
}

// Snapshot do nome do usuário (vai pro autor_nome de evoluções)
export function getUserName(request) {
  return request?.user?.name || null
}

// Garante que o usuário tenha uma clínica. Cria automaticamente no 1º uso.
// Retorna sempre o clinica_id do usuário.
export async function ensureClinica(userId) {
  if (!userId) {
    throw new Error('Token sem userId. Faça logout e login novamente.')
  }

  const { data: u, error: e1 } = await supabase
    .from('users').select('id,name,clinica_id').eq('id', userId).maybeSingle()

  if (e1) {
    throw new Error('Erro ao consultar usuário: ' + (e1.message || e1.code || 'desconhecido'))
  }
  if (!u) {
    throw new Error('Usuário do token (' + userId + ') não existe na tabela users.')
  }

  if (u.clinica_id) return u.clinica_id

  const primeiro = (u.name || 'Dentista').split(' ')[0]
  const { data: c, error: e2 } = await supabase
    .from('clinicas').insert({ nome: 'Clínica de ' + primeiro, criado_por: userId })
    .select().single()
  if (e2) throw new Error('Erro ao criar clínica: ' + (e2.message || e2.code))

  const { error: e3 } = await supabase
    .from('users').update({ clinica_id: c.id }).eq('id', userId)
  if (e3) throw new Error('Erro ao vincular clínica ao usuário: ' + (e3.message || e3.code))

  return c.id
}

// Confirma que o paciente pertence à clínica indicada. Retorna o paciente
// (id apenas, pra economia) ou null se não bate / não existe.
export async function getPacienteDaClinica(pacienteId, clinicaId) {
  if (!pacienteId || !clinicaId) return null
  const { data, error } = await supabase
    .from('pacientes').select('id,clinica_id')
    .eq('id', pacienteId).eq('clinica_id', clinicaId).eq('ativo', true)
    .maybeSingle()
  if (error || !data) return null
  return data
}
