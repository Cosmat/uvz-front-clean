import axios from 'axios'
import { apiProxy as api } from 'boot/axios'

// Simple in-memory cache for GET requests
const cache = new Map()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

function getCacheKey(config) {
  return `${(config.method || 'GET').toUpperCase()}:${config.url}${JSON.stringify(config.params || {})}`
}

function getFromCache(key) {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }
  cache.delete(key)
  return null
}

function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() })
}

function clearCache(pattern) {
  if (!pattern) {
    cache.clear()
    return
  }
  for (const key of cache.keys()) {
    if (key.includes(pattern)) {
      cache.delete(key)
    }
  }
}

// Retry function with exponential backoff
async function retryRequest(requestFn, retries = 3, delay = 1000) {
  try {
    return await requestFn()
  } catch (error) {
    if (retries === 0) throw error
    
    const axiosError = error
    // Only retry on network errors or 5xx
    if (!axiosError.response || axiosError.response.status >= 500) {
      await new Promise(r => setTimeout(r, delay))
      return retryRequest(requestFn, retries - 1, delay * 2)
    }
    throw error
  }
}

export const apiService = {
  // Zayavki
  async getZayavki(filters = {}) {
    const cacheKey = getCacheKey({ method: 'GET', url: '/api/zayavki', params: filters })
    const cached = getFromCache(cacheKey)
    if (cached) return cached

    return retryRequest(async () => {
      const response = await api.get('/api/zayavki', { params: filters })
      const data = response.data
      setCache(cacheKey, data)
      return data
    })
  },

  async getZayavka(id) {
    const response = await api.get(`/api/zayavki/${id}`)
    return response.data.data
  },

  async createZayavka(data) {
    const response = await api.post('/api/zayavki', data)
    clearCache('/api/zayavki')
    return response.data.data
  },

  async updateZayavka(id, data) {
    const response = await api.patch(`/api/zayavki/${id}`, data)
    clearCache('/api/zayavki')
    return response.data.data
  },

  async archiveZayavka(id) {
    const response = await api.patch(`/api/zayavki/${id}/archive`)
    clearCache('/api/zayavki')
    return response.data.data
  },

  async deleteZayavka(id) {
    await api.delete(`/api/zayavki/${id}`)
    clearCache('/api/zayavki')
  },

  async getMyZayavki(filters = {}) {
    return retryRequest(async () => {
      const response = await api.get('/api/zayavki/my', { params: filters })
      return response.data
    })
  },

  async getZayavkiStats() {
    const response = await api.get('/api/zayavki/stats')
    return response.data.data
  },

  // Deshife
  async getDeshife(params = {}) {
    const cacheKey = getCacheKey({ method: 'GET', url: '/api/deshife', params })
    const cached = getFromCache(cacheKey)
    if (cached) return cached

    return retryRequest(async () => {
      const response = await api.get('/api/deshife', { params })
      const data = response.data
      setCache(cacheKey, data)
      return data
    })
  },

  async getDeshifeByShifr(shifr) {
    const response = await api.get(`/api/deshife/${shifr}`)
    return response.data.data
  },

  async createDeshife(data) {
    const response = await api.post('/api/deshife', data)
    clearCache('/api/deshife')
    return response.data.data
  },

  async bulkCreateDeshife(items) {
    const response = await api.post('/api/deshife/bulk', items)
    clearCache('/api/deshife')
    return response.data.data
  },

  async getDeshifeCategories() {
    const response = await api.get('/api/deshife/categories')
    return response.data.data
  },

  // PhoneTabel
  async getPhones(params = {}) {
    const cacheKey = getCacheKey({ method: 'GET', url: '/api/phones', params })
    const cached = getFromCache(cacheKey)
    if (cached) return cached

    return retryRequest(async () => {
      const response = await api.get('/api/phones', { params })
      const data = response.data
      setCache(cacheKey, data)
      return data
    })
  },

  async getPhone(tzeh) {
    const response = await api.get(`/api/phones/${tzeh}`)
    return response.data.data
  },

  async createPhone(data) {
    const response = await api.post('/api/phones', data)
    clearCache('/api/phones')
    return response.data.data
  },

  async bulkCreatePhones(items) {
    const response = await api.post('/api/phones/bulk', items)
    clearCache('/api/phones')
    return response.data.data
  },

  // Auth
  async login(username, password) {
    const response = await api.post('/api/auth/login', { username, password })
    return response.data
  },

  async register(username, password, role) {
    const response = await api.post('/api/auth/register', { username, password, role })
    return response.data
  },

  async getMe() {
    const response = await api.get('/api/auth/me')
    return response.data.data
  },

  async changePassword(oldPassword, newPassword) {
    await api.post('/api/auth/change-password', { oldPassword, newPassword })
  },

  // Cache management
  clearCache(pattern) {
    clearCache(pattern)
  }
}

export default apiService