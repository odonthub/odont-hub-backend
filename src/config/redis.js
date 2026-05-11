// src/config/redis.js
import Redis from 'ioredis'

export const redis = new Redis(process.env.REDIS_URL, {
  tls: process.env.REDIS_URL?.startsWith('rediss://') ? {} : undefined,
  maxRetriesPerRequest: 3,
  retryStrategy: (times) => Math.min(times * 200, 2000),
})

redis.on('connect', () => console.log('✅ Redis conectado'))
redis.on('error',   (err) => console.error('❌ Redis erro:', err.message))

// Helpers
export const cache = {
  async get(key) {
    const val = await redis.get(key)
    return val ? JSON.parse(val) : null
  },
  async set(key, value, ttlSeconds = 300) {
    await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds)
  },
  async del(key) {
    await redis.del(key)
  },
  async invalidatePattern(pattern) {
    const keys = await redis.keys(pattern)
    if (keys.length > 0) await redis.del(...keys)
  },
}
