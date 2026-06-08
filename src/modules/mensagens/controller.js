// src/modules/mensagens/controller.js
// FASE 4 — Chat privado 1:1 com texto puro + bloqueio + denúncia.
// Soft delete via excluida_em — receptor vê "Mensagem removida".

import { supabase } from '../../config/database.js'

function getUserId(req) { return req?.user?.id || req?.user?.sub || null }

// Retorna true se A está bloqueado por B (em qualquer direção)
async function existeBloqueio(a, b) {
  const { data } = await supabase
    .from('bloqueios').select('bloqueador_id')
    .or(`and(bloqueador_id.eq.${a},bloqueado_id.eq.${b}),and(bloqueador_id.eq.${b},bloqueado_id.eq.${a})`)
    .limit(1).maybeSingle()
  return !!data
}

// ══════════════════════════════════════════════════════════════════════════
//  GET /api/mensagens/conversas
//  Lista conversas (último msg + outro user + não lidas)
// ══════════════════════════════════════════════════════════════════════════
export async function listarConversas(request, reply) {
  try {
    const meId = getUserId(request)
    if (!meId) return reply.code(401).send({ error: 'Token sem userId.' })

    // Pega todas mensagens onde eu sou de OU para (qualquer direção), exclui soft-deleted
    const { data: msgs, error } = await supabase
      .from('mensagens_privadas')
      .select('id,de_user_id,para_user_id,conteudo,lida_em,created_at')
      .or(`de_user_id.eq.${meId},para_user_id.eq.${meId}`)
      .order('created_at', { ascending: false })
      .limit(2000)
    if (error) return reply.code(500).send({ error: 'Erro ao listar: ' + error.message })

    // Agrupa por "outro user" e pega a última mensagem
    const porOutro = new Map()
    for (const m of (msgs || [])) {
      const outroId = (m.de_user_id === meId) ? m.para_user_id : m.de_user_id
      if (!porOutro.has(outroId)) {
        porOutro.set(outroId, {
          outro_id: outroId,
          ultima: m,
          nao_lidas: 0
        })
      }
      // Contagem de não lidas (apenas as que recebi e ainda não li)
      if (m.para_user_id === meId && !m.lida_em) {
        porOutro.get(outroId).nao_lidas++
      }
    }

    const outrosIds = Array.from(porOutro.keys())
    if (outrosIds.length === 0) return reply.send({ conversas: [], nao_lidas_total: 0 })

    // Busca dados dos outros users
    const { data: users } = await supabase
      .from('users').select('id,name,avatar_url,specialty')
      .in('id', outrosIds)
    const usersMap = new Map((users || []).map(u => [u.id, u]))

    // Lista de IDs bloqueados (filtrar)
    const { data: bloqs } = await supabase
      .from('bloqueios').select('bloqueado_id').eq('bloqueador_id', meId)
    const bloqueadosPorMim = new Set((bloqs || []).map(b => b.bloqueado_id))

    const conversas = []
    let totalNaoLidas = 0
    for (const c of porOutro.values()) {
      if (bloqueadosPorMim.has(c.outro_id)) continue
      const u = usersMap.get(c.outro_id)
      const m = c.ultima
      const previa = m.excluida_em
        ? '🚫 Mensagem removida'
        : (m.conteudo.length > 60 ? m.conteudo.slice(0,60) + '…' : m.conteudo)
      conversas.push({
        outro:        u ? { id: u.id, name: u.name, avatar_url: u.avatar_url, specialty: u.specialty } : { id: c.outro_id, name: 'Usuário' },
        ultima: {
          id: m.id, conteudo: previa, created_at: m.created_at,
          enviada_por_mim: m.de_user_id === meId
        },
        nao_lidas: c.nao_lidas
      })
      totalNaoLidas += c.nao_lidas
    }
    // Ordena por data desc da última mensagem
    conversas.sort((a,b) => a.ultima.created_at < b.ultima.created_at ? 1 : -1)
    return reply.send({ conversas, nao_lidas_total: totalNaoLidas })
  } catch (e) {
    return reply.code(500).send({ error: e.message || 'Erro ao listar conversas.' })
  }
}

// ══════════════════════════════════════════════════════════════════════════
//  GET /api/mensagens/com/:userId
//  Histórico entre o viewer e :userId
// ══════════════════════════════════════════════════════════════════════════
export async function historico(request, reply) {
  try {
    const meId = getUserId(request)
    const { userId } = request.params
    if (!meId) return reply.code(401).send({ error: 'Token sem userId.' })
    if (meId === userId) return reply.code(400).send({ error: 'Não há chat consigo mesmo.' })

    const { data, error } = await supabase
      .from('mensagens_privadas')
      .select('id,de_user_id,para_user_id,conteudo,lida_em,excluida_em,created_at')
      .or(`and(de_user_id.eq.${meId},para_user_id.eq.${userId}),and(de_user_id.eq.${userId},para_user_id.eq.${meId})`)
      .order('created_at', { ascending: true })
      .limit(500)
    if (error) return reply.code(500).send({ error: 'Erro ao buscar histórico: ' + error.message })

    // Mensagens excluídas viram placeholder
    const mensagens = (data || []).map(m => m.excluida_em
      ? { ...m, conteudo: '🚫 Mensagem removida', removida: true }
      : m
    )

    // Info do outro user
    const { data: outro } = await supabase
      .from('users').select('id,name,avatar_url,specialty')
      .eq('id', userId).maybeSingle()

    // Bloqueios — direção bilateral
    const eu_bloqueei = !!(await supabase.from('bloqueios')
      .select('bloqueador_id').eq('bloqueador_id', meId).eq('bloqueado_id', userId)
      .maybeSingle()).data
    const fui_bloqueado = !!(await supabase.from('bloqueios')
      .select('bloqueador_id').eq('bloqueador_id', userId).eq('bloqueado_id', meId)
      .maybeSingle()).data

    return reply.send({ mensagens, outro, eu_bloqueei, fui_bloqueado })
  } catch (e) {
    return reply.code(500).send({ error: e.message || 'Erro ao buscar histórico.' })
  }
}

// ══════════════════════════════════════════════════════════════════════════
//  POST /api/mensagens/com/:userId — envia
// ══════════════════════════════════════════════════════════════════════════
export async function enviar(request, reply) {
  try {
    const meId = getUserId(request)
    const { userId } = request.params
    if (!meId) return reply.code(401).send({ error: 'Token sem userId.' })
    if (meId === userId) return reply.code(400).send({ error: 'Não é possível enviar mensagem para si mesmo.' })

    const conteudo = String((request.body && request.body.conteudo) || '').trim()
    if (!conteudo) return reply.code(400).send({ error: 'Conteúdo é obrigatório.' })
    if (conteudo.length > 4000) return reply.code(400).send({ error: 'Mensagem muito longa (máx. 4000 caracteres).' })

    // Verifica bloqueio em qualquer direção
    if (await existeBloqueio(meId, userId)) {
      return reply.code(403).send({ error: 'Não é possível enviar mensagem (usuário bloqueou ou foi bloqueado).' })
    }

    // Garante que destinatário existe
    const { data: alvo } = await supabase.from('users').select('id').eq('id', userId).maybeSingle()
    if (!alvo) return reply.code(404).send({ error: 'Destinatário não encontrado.' })

    const { data, error } = await supabase.from('mensagens_privadas').insert({
      de_user_id: meId, para_user_id: userId, conteudo
    }).select().single()
    if (error) return reply.code(500).send({ error: 'Erro ao enviar: ' + error.message })
    return reply.code(201).send({ mensagem: data })
  } catch (e) {
    return reply.code(500).send({ error: e.message || 'Erro ao enviar mensagem.' })
  }
}

// ══════════════════════════════════════════════════════════════════════════
//  POST /api/mensagens/com/:userId/ler — marca como lidas
// ══════════════════════════════════════════════════════════════════════════
export async function marcarLidas(request, reply) {
  try {
    const meId = getUserId(request)
    const { userId } = request.params
    if (!meId) return reply.code(401).send({ error: 'Token sem userId.' })

    const { error } = await supabase.from('mensagens_privadas')
      .update({ lida_em: new Date().toISOString() })
      .eq('para_user_id', meId).eq('de_user_id', userId).is('lida_em', null)
    if (error) return reply.code(500).send({ error: 'Erro ao marcar lidas: ' + error.message })
    return reply.send({ ok: true })
  } catch (e) {
    return reply.code(500).send({ error: e.message || 'Erro ao marcar lidas.' })
  }
}

// ══════════════════════════════════════════════════════════════════════════
//  DELETE /api/mensagens/:id  (soft delete, só o autor)
// ══════════════════════════════════════════════════════════════════════════
export async function excluir(request, reply) {
  try {
    const meId = getUserId(request)
    const { id } = request.params
    if (!meId) return reply.code(401).send({ error: 'Token sem userId.' })

    const { data, error } = await supabase.from('mensagens_privadas')
      .update({ excluida_em: new Date().toISOString() })
      .eq('id', id).eq('de_user_id', meId).is('excluida_em', null)
      .select('id').maybeSingle()
    if (error) return reply.code(500).send({ error: 'Erro ao excluir: ' + error.message })
    if (!data)  return reply.code(404).send({ error: 'Mensagem não encontrada (ou já excluída).' })
    return reply.send({ ok: true })
  } catch (e) {
    return reply.code(500).send({ error: e.message || 'Erro ao excluir mensagem.' })
  }
}

// ══════════════════════════════════════════════════════════════════════════
//  GET /api/mensagens/nao-lidas — contador rápido (badge da sidebar)
// ══════════════════════════════════════════════════════════════════════════
export async function naoLidasTotal(request, reply) {
  try {
    const meId = getUserId(request)
    if (!meId) return reply.code(401).send({ error: 'Token sem userId.' })
    const { count, error } = await supabase
      .from('mensagens_privadas').select('id', { count: 'exact', head: true })
      .eq('para_user_id', meId).is('lida_em', null).is('excluida_em', null)
    if (error) return reply.code(500).send({ error: 'Erro ao contar.' })
    return reply.send({ total: count || 0 })
  } catch (e) {
    return reply.code(500).send({ error: e.message || 'Erro.' })
  }
}

// ══════════════════════════════════════════════════════════════════════════
//  PROTEÇÕES — Bloqueio
// ══════════════════════════════════════════════════════════════════════════
// POST /api/usuarios/:id/bloquear
export async function bloquear(request, reply) {
  try {
    const meId = getUserId(request)
    const { id } = request.params
    if (!meId) return reply.code(401).send({ error: 'Token sem userId.' })
    if (meId === id) return reply.code(400).send({ error: 'Não é possível bloquear a si mesmo.' })

    const { error } = await supabase.from('bloqueios').insert({
      bloqueador_id: meId, bloqueado_id: id
    })
    if (error && String(error.code) !== '23505') {
      return reply.code(500).send({ error: 'Erro ao bloquear: ' + error.message })
    }
    return reply.code(201).send({ ok: true })
  } catch (e) {
    return reply.code(500).send({ error: e.message || 'Erro ao bloquear.' })
  }
}

// DELETE /api/usuarios/:id/bloquear
export async function desbloquear(request, reply) {
  try {
    const meId = getUserId(request)
    const { id } = request.params
    if (!meId) return reply.code(401).send({ error: 'Token sem userId.' })

    const { error } = await supabase.from('bloqueios')
      .delete().eq('bloqueador_id', meId).eq('bloqueado_id', id)
    if (error) return reply.code(500).send({ error: 'Erro ao desbloquear: ' + error.message })
    return reply.send({ ok: true })
  } catch (e) {
    return reply.code(500).send({ error: e.message || 'Erro ao desbloquear.' })
  }
}

// GET /api/usuarios/me/bloqueados — lista de usuários que EU bloqueei
export async function meusBloqueados(request, reply) {
  try {
    const meId = getUserId(request)
    if (!meId) return reply.code(401).send({ error: 'Token sem userId.' })
    const { data, error } = await supabase
      .from('bloqueios')
      .select('created_at, user:users!bloqueios_bloqueado_id_fkey(id,name,avatar_url,specialty)')
      .eq('bloqueador_id', meId)
      .order('created_at', { ascending: false })
    if (error) return reply.code(500).send({ error: 'Erro ao listar.' })
    return reply.send({ bloqueados: (data || []).map(r => r.user).filter(Boolean) })
  } catch (e) {
    return reply.code(500).send({ error: e.message || 'Erro ao listar bloqueados.' })
  }
}

// ══════════════════════════════════════════════════════════════════════════
//  PROTEÇÕES — Denúncia
// ══════════════════════════════════════════════════════════════════════════
// POST /api/denuncias
// Body: { denunciado_id, mensagem_id?, categoria, descricao? }
export async function denunciar(request, reply) {
  try {
    const meId = getUserId(request)
    if (!meId) return reply.code(401).send({ error: 'Token sem userId.' })
    const b = request.body || {}
    const denunciado_id = String(b.denunciado_id || '')
    if (!denunciado_id) return reply.code(400).send({ error: 'denunciado_id obrigatório.' })
    if (denunciado_id === meId) return reply.code(400).send({ error: 'Não é possível denunciar a si mesmo.' })

    const categoriasOk = new Set(['spam','assedio','conteudo_improprio','golpe','outro'])
    const categoria = categoriasOk.has(b.categoria) ? b.categoria : 'outro'
    const descricao = b.descricao ? String(b.descricao).trim().slice(0, 2000) : null
    const mensagem_id = b.mensagem_id ? String(b.mensagem_id) : null

    const { data, error } = await supabase.from('denuncias').insert({
      denunciante_id: meId,
      denunciado_id,
      mensagem_id,
      categoria,
      descricao
    }).select().single()
    if (error) return reply.code(500).send({ error: 'Erro ao denunciar: ' + error.message })
    return reply.code(201).send({ denuncia: data })
  } catch (e) {
    return reply.code(500).send({ error: e.message || 'Erro ao denunciar.' })
  }
}
