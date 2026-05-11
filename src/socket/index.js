// src/socket/index.js — Chat em tempo real com Socket.io
import { supabase } from '../config/database.js'
import { redis }    from '../config/redis.js'
import { randomUUID } from 'crypto'

export function initSocket(io) {

  // Middleware: autenticação via token JWT no handshake
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token
      if (!token) return next(new Error('Token não fornecido.'))

      // Decodifica o JWT manualmente (sem o plugin do Fastify aqui)
      const [, payload] = token.split('.')
      const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString())
      socket.userId = decoded.id
      socket.userName = decoded.name
      next()
    } catch {
      next(new Error('Token inválido.'))
    }
  })

  io.on('connection', (socket) => {
    console.log(`🔌 Socket conectado: ${socket.userId} (${socket.userName})`)

    // Marca usuário como online no Redis
    redis.set(`online:${socket.userId}`, '1', 'EX', 300)
    io.emit('user:online', { userId: socket.userId })

    // ── Entrar em sala de chat ─────────────────────────────────────────────
    socket.on('room:join', async ({ roomId }) => {
      // Verifica se o usuário tem acesso à sala
      const { data: room } = await supabase
        .from('chat_rooms')
        .select('*')
        .eq('id', roomId)
        .or(`buyer_id.eq.${socket.userId},seller_id.eq.${socket.userId},patient_id.eq.${socket.userId},expert_user_id.eq.${socket.userId}`)
        .single()

      if (!room) {
        socket.emit('error', { message: 'Sala não encontrada ou acesso negado.' })
        return
      }

      socket.join(roomId)
      socket.currentRoom = roomId

      // Carrega histórico das últimas 50 mensagens
      const { data: messages } = await supabase
        .from('chat_messages')
        .select('*, sender:users(id,name,avatar_url)')
        .eq('room_id', roomId)
        .order('created_at', { ascending: false })
        .limit(50)

      socket.emit('room:history', messages?.reverse() || [])
    })

    // ── Enviar mensagem ────────────────────────────────────────────────────
    socket.on('message:send', async ({ roomId, content, type = 'text', file_url }) => {
      if (!content?.trim() && !file_url) return

      const { data: message } = await supabase
        .from('chat_messages')
        .insert({
          id: randomUUID(),
          room_id: roomId,
          sender_id: socket.userId,
          content: content?.trim(),
          type,
          file_url: file_url || null,
        })
        .select('*, sender:users(id,name,avatar_url)')
        .single()

      // Atualiza timestamp da sala
      await supabase.from('chat_rooms')
        .update({ updated_at: new Date() }).eq('id', roomId)

      // Envia para todos na sala
      io.to(roomId).emit('message:new', message)
    })

    // ── Indicador de digitação ─────────────────────────────────────────────
    socket.on('message:typing', ({ roomId }) => {
      socket.to(roomId).emit('message:typing', {
        userId: socket.userId,
        userName: socket.userName,
      })
    })

    socket.on('message:stop_typing', ({ roomId }) => {
      socket.to(roomId).emit('message:stop_typing', { userId: socket.userId })
    })

    // ── Sair da sala ───────────────────────────────────────────────────────
    socket.on('room:leave', ({ roomId }) => {
      socket.leave(roomId)
    })

    // ── Desconexão ─────────────────────────────────────────────────────────
    socket.on('disconnect', () => {
      redis.del(`online:${socket.userId}`)
      io.emit('user:offline', { userId: socket.userId })
      console.log(`🔌 Socket desconectado: ${socket.userId}`)
    })
  })

  console.log('📡 Socket.io inicializado')
}
