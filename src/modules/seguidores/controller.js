// src/modules/seguidores/controller.js
// FASE 3 — Seguir / Desseguir / Listar seguidores e seguindo

import { supabase } from '../../config/database.js'

function getViewerId(req) {
  return req?.user?.id || req?.user?.sub || null
}

// POST /api/users/:id/seguir
export async function seguir(request, reply) {
  try {
    const viewerId = getViewerId(request)
    const { id } = request.params
    if (!viewerId) return reply.code(401).send({ error: 'Token sem userId.' })
    if (viewerId === id) return reply.code(400).send({ error: 'Não é possível seguir a si mesmo.' })

    const { error } = await supabase.from('seguidores').insert({
      seguidor_id: viewerId, seguido_id: id
    })
    if (error) {
      // Já segue (chave duplicada)
      if (String(error.code) === '23505') return reply.send({ ok: true, ja_seguia: true })
      return reply.code(500).send({ error: 'Erro ao seguir: ' + (error.message || error.code) })
    }
    return reply.code(201).send({ ok: true })
  } catch (e) {
    return reply.code(500).send({ error: e.message || 'Erro ao seguir.' })
  }
}

// DELETE /api/users/:id/seguir
export async function desseguir(request, reply) {
  try {
    const viewerId = getViewerId(request)
    const { id } = request.params
    if (!viewerId) return reply.code(401).send({ error: 'Token sem userId.' })

    const { error } = await supabase.from('seguidores')
      .delete().eq('seguidor_id', viewerId).eq('seguido_id', id)
    if (error) return reply.code(500).send({ error: 'Erro ao desseguir: ' + error.message })
    return reply.send({ ok: true })
  } catch (e) {
    return reply.code(500).send({ error: e.message || 'Erro ao desseguir.' })
  }
}

// GET /api/users/:id/seguidores
export async function listarSeguidores(request, reply) {
  try {
    const { id } = request.params
    const { data, error } = await supabase
      .from('seguidores')
      .select('created_at, user:users!seguidores_seguidor_id_fkey(id,name,avatar_url,specialty,city)')
      .eq('seguido_id', id)
      .order('created_at', { ascending: false })
      .limit(200)
    if (error) return reply.code(500).send({ error: 'Erro ao listar seguidores.' })
    return reply.send({ seguidores: (data || []).map(r => r.user).filter(Boolean) })
  } catch (e) {
    return reply.code(500).send({ error: e.message || 'Erro ao listar seguidores.' })
  }
}

// GET /api/users/:id/seguindo
export async function listarSeguindo(request, reply) {
  try {
    const { id } = request.params
    const { data, error } = await supabase
      .from('seguidores')
      .select('created_at, user:users!seguidores_seguido_id_fkey(id,name,avatar_url,specialty,city)')
      .eq('seguidor_id', id)
      .order('created_at', { ascending: false })
      .limit(200)
    if (error) return reply.code(500).send({ error: 'Erro ao listar seguindo.' })
    return reply.send({ seguindo: (data || []).map(r => r.user).filter(Boolean) })
  } catch (e) {
    return reply.code(500).send({ error: e.message || 'Erro ao listar seguindo.' })
  }
}
