// src/config/database.js
import { createClient } from '@supabase/supabase-js'

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
  throw new Error('SUPABASE_URL e SUPABASE_SERVICE_KEY são obrigatórios no .env')
}

// Cliente com service key (ignora RLS — usar somente no backend)
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
  { auth: { persistSession: false } }
)

// Helper: executa query e lança erro se houver
export async function query(table, operation, params = {}) {
  const { data, error } = await operation
  if (error) throw new Error(`[DB:${table}] ${error.message}`)
  return data
}
