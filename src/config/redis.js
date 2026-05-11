import Redis from 'ioredis'

export const redis = null

export const cache = {
  async get(key) { return null },
  async set(key, value, ttl) {},
  async del(key) {},
  async invalidatePattern(pattern) {},
}
