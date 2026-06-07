// src/modules/trabalhos/controller.js
// FASE 3 — Feed "Meu trabalho": 1 foto por post, com título e descrição
// Soft delete via excluida_em.

import { supabase } from '../../config/database.js'

function getViewerId(req) {
  return req?.user?.id || req?.user?.sub || null
}

// GET /api/users/:id/trabalhos
export async function listar(request, reply) {
  try {
    const { id } = request.params
    const { data, error } = await supabase
      .from('trabalho_fotos')
      .select('id,user_id,image_url,titulo,descricao,created_at')
      .eq('user_id', id).is('excluida_em', null)
      .order('created_at', { ascending: false })
      .limit(200)
    if (error) return reply.code(500).send({ error: 'Erro ao listar trabalhos: ' + error.message })
    return reply.send({ trabalhos: data || [] })
  } catch (e) {
    return reply.code(500).send({ error: e.message || 'Erro ao listar trabalhos.' })
  }
}

// POST /api/users/me/trabalhos
// Body: { image_url, titulo?, descricao? }
export async function criar(request, reply) {
  try {
    const viewerId = getViewerId(request)
    if (!viewerId) return reply.code(401).send({ error: 'Token sem userId.' })

    const body = request.body || {}
    const image_url = String(body.image_url || '').trim()
    if (!image_url) return reply.code(400).send({ error: 'image_url é obrigatório.' })

    const { data, error } = await supabase.from('trabalho_fotos').insert({
      user_id:   viewerId,
      image_url,
      titulo:    body.titulo    ? String(body.titulo).trim().slice(0, 200) : null,
      descricao: body.descricao ? String(body.descricao).trim().slice(0, 2000) : null
    }).select().single()
    if (error) return reply.code(500).send({ error: 'Erro ao salvar trabalho: ' + (error.message || error.code) })
    return reply.code(201).send({ trabalho: data })
  } catch (e) {
    return reply.code(500).send({ error: e.message || 'Erro ao salvar trabalho.' })
  }
}

// DELETE /api/users/me/trabalhos/:id  (soft delete; só o dono)
export async function excluir(request, reply) {
  try {
    const viewerId = getViewerId(request)
    if (!viewerId) return reply.code(401).send({ error: 'Token sem userId.' })
    const { id } = request.params

    const { data, error } = await supabase.from('trabalho_fotos')
      .update({ excluida_em: new Date().toISOString() })
      .eq('id', id).eq('user_id', viewerId).is('excluida_em', null)
      .select('id').maybeSingle()
    if (error) return reply.code(500).send({ error: 'Erro ao excluir: ' + error.message })
    if (!data)  return reply.code(404).send({ error: 'Trabalho não encontrado.' })
    return reply.send({ ok: true })
  } catch (e) {
    return reply.code(500).send({ error: e.message || 'Erro ao excluir trabalho.' })
  }
}
