// src/modules/auth/controller.js
import bcrypt from 'bcryptjs'
import { supabase } from '../../config/database.js'
import { redis } from '../../config/redis.js'
import { randomUUID } from 'crypto'

// ── Helpers ────────────────────────────────────────────────────────────────
function sanitize(user) {
  const { password_hash, ...safe } = user
  return safe
}

// Valida CRO consultando base do CFO (no MVP: validação simples de formato)
async function validateCRO(cro, uf) {
  // Formato esperado: "12345" ou "SP-12345"
  const clean = cro.replace(/\D/g, '')
  if (clean.length < 4 || clean.length > 8) return false
  // TODO pós-MVP: integrar com API do CFO para validação real
  // https://website.cfo.org.br/servicos/consulta-de-inscricao/
  return true
}

// ── Register ───────────────────────────────────────────────────────────────
export async function register(request, reply) {
  const { name, email, password, cro, cro_uf, specialty, phone } = request.body

  if (!name || !email || !password) {
    return reply.code(400).send({ error: 'Nome, e-mail e senha são obrigatórios.' })
  }
  if (password.length < 8) {
    return reply.code(400).send({ error: 'Senha deve ter ao menos 8 caracteres.' })
  }

  // Checa e-mail duplicado
  const { data: existing } = await supabase
    .from('users').select('id').eq('email', email.toLowerCase()).single()
  if (existing) return reply.code(409).send({ error: 'E-mail já cadastrado.' })

  // Valida CRO se fornecido
  let cro_validated = false
  if (cro && cro_uf) {
    cro_validated = await validateCRO(cro, cro_uf)
  }

  const password_hash = await bcrypt.hash(password, 12)

  const { data: user, error } = await supabase.from('users').insert({
    id:           randomUUID(),
    name:         name.trim(),
    email:        email.toLowerCase().trim(),
    password_hash,
    cro:          cro?.toUpperCase().trim() || null,
    cro_uf:       cro_uf?.toUpperCase() || null,
    cro_validated,
    specialty:    specialty || null,
    phone:        phone || null,
    plan:         'free',
  }).select().single()

  if (error) return reply.code(500).send({ error: 'Erro ao criar conta.' })

  const token = app.jwt.sign({
    id: user.id, email: user.email,
    name: user.name, cro_validated: user.cro_validated,
  })

  return reply.code(201).send({ user: sanitize(user), token })
}

// ── Login ──────────────────────────────────────────────────────────────────
export async function login(request, reply) {
  const { email, password } = request.body
  if (!email || !password) {
    return reply.code(400).send({ error: 'E-mail e senha são obrigatórios.' })
  }

  const { data: user } = await supabase
    .from('users').select('*').eq('email', email.toLowerCase()).single()

  if (!user) return reply.code(401).send({ error: 'Credenciais inválidas.' })

  const valid = await bcrypt.compare(password, user.password_hash)
  if (!valid) return reply.code(401).send({ error: 'Credenciais inválidas.' })

  // Atualiza last_seen
  await supabase.from('users').update({ last_seen: new Date() }).eq('id', user.id)

  const token = request.server.jwt.sign({
    id: user.id, email: user.email,
    name: user.name, cro_validated: user.cro_validated,
  })

  return reply.send({ user: sanitize(user), token })
}

// ── Refresh token ──────────────────────────────────────────────────────────
export async function refreshToken(request, reply) {
  try {
    const old = await request.jwtVerify({ ignoreExpiration: true })
    const { data: user } = await supabase
      .from('users').select('*').eq('id', old.id).single()
    if (!user) return reply.code(401).send({ error: 'Usuário não encontrado.' })

    const token = request.server.jwt.sign({
      id: user.id, email: user.email,
      name: user.name, cro_validated: user.cro_validated,
    })
    return reply.send({ token })
  } catch {
    return reply.code(401).send({ error: 'Token inválido.' })
  }
}

// ── Forgot password ────────────────────────────────────────────────────────
export async function forgotPassword(request, reply) {
  const { email } = request.body
  const { data: user } = await supabase
    .from('users').select('id,name,email').eq('email', email?.toLowerCase()).single()

  // Sempre retorna 200 por segurança (não revelar se e-mail existe)
  if (!user) return reply.send({ message: 'Se o e-mail existir, você receberá um link.' })

  const token = randomUUID()
  await redis.set(`reset:${token}`, user.id, 'EX', 3600) // 1 hora

  // TODO: enviar e-mail via Resend com link de reset
  // await sendResetEmail(user.email, user.name, token)

  return reply.send({ message: 'Se o e-mail existir, você receberá um link.' })
}

// ── Reset password ─────────────────────────────────────────────────────────
export async function resetPassword(request, reply) {
  const { token, password } = request.body
  if (!token || !password) {
    return reply.code(400).send({ error: 'Token e nova senha são obrigatórios.' })
  }

  const userId = await redis.get(`reset:${token}`)
  if (!userId) return reply.code(400).send({ error: 'Link expirado ou inválido.' })

  const password_hash = await bcrypt.hash(password, 12)
  await supabase.from('users').update({ password_hash }).eq('id', userId)
  await redis.del(`reset:${token}`)

  return reply.send({ message: 'Senha alterada com sucesso.' })
}

// ── Me (dados do usuário logado) ───────────────────────────────────────────
export async function me(request, reply) {
  const { data: user } = await supabase
    .from('users').select('*').eq('id', request.user.id).single()
  if (!user) return reply.code(404).send({ error: 'Usuário não encontrado.' })
  return reply.send(sanitize(user))
}
