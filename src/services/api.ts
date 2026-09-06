import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios'
import { apiProxy as api } from 'boot/axios'
import type { 
  Zayavka, 
  ZayavkaListResponse, 
  ZayavkaFilters,
  Deshife,
  DeshifeListResponse,
  PhoneTabel,
  PhoneTabelListResponse,
  AuthResponse,
  User,
  StatsResponse
} from 'src/types'

// Simple in-memory cache for GET requests
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

function getCacheKey(config: AxiosRequestConfig): string {
  return `${config.method?.toUpperCase()}:${config.url}${JSON.stringify(config.params || {})}`
}

function getFromCache(key: string) {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }
  cache.delete(key)
  return null
}

function setCache(key: string, data: any) {
  cache.set(key, { data, timestamp: Date.now() })
}

function clearCache(pattern?: string) {
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
async function retryRequest<T>(
  requestFn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  try {
    return await requestFn()
  } catch (error) {
    if (retries === 0) throw error
    
    const axiosError = error as AxiosError
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
  async getZayavki(filters: ZayavkaFilters = {}): Promise<ZayavkaListResponse> {
    const cacheKey = getCacheKey({ method: 'GET', url: '/api/zayavki', params: filters })
    const cached = getFromCache(cacheKey)
    if (cached) return cached

    return retryRequest(async () => {
      const response = await api.get('/api/zayavki', { params: filters })
      const data = response.data as ZayavkaListResponse
      setCache(cacheKey, data)
      return data
    })
  },

  async getZayavka(id: string): Promise<Zayavka> {
    const response = await api.get(`/api/zayavki/${id}`)
    return response.data.data
  },

  async createZayavka(data: Partial<Zayavka>): Promise<Zayavka> {
    const response = await api.post('/api/zayavki', data)
    clearCache('/api/zayavki')
    return response.data.data
  },

  async updateZayavka(id: string, data: Partial<Zayavka>): Promise<Zayavka> {
    const response = await api.patch(`/api/zayavki/${id}`, data)
    clearCache('/api/zayavki')
    return response.data.data
  },

  async archiveZayavka(id: string): Promise<Zayavka> {
    const response = await api.patch(`/api/zayavki/${id}/archive`)
    clearCache('/api/zayavki')
    return response.data.data
  },

  async deleteZayavka(id: string): Promise<void> {
    await api.delete(`/api/zayavki/${id}`)
    clearCache('/api/zayavki')
  },

  async getMyZayavki(filters: ZayavkaFilters = {}): Promise<ZayavkaListResponse> {
    return retryRequest(async () => {
      const response = await api.get('/api/zayavki/my', { params: filters })
      return response.data as ZayavkaListResponse
    })
  },

  async getZayavkiStats(): Promise<StatsResponse['data']> {
    const response = await api.get('/api/zayavki/stats')
    return response.data.data
  },

  // Deshife
  async getDeshife(params: { page?: number; limit?: number; category?: string; search?: string } = {}): Promise<DeshifeListResponse> {
    const cacheKey = getCacheKey({ method: 'GET', url: '/api/deshife', params })
    const cached = getFromCache(cacheKey)
    if (cached) return cached

    return retryRequest(async () => {
      const response = await api.get('/api/deshife', { params })
      const data = response.data as DeshifeListResponse
      setCache(cacheKey, data)
      return data
    })
  },

  async getDeshifeByShifr(shifr: string): Promise<Deshife> {
    const response = await api.get(`/api/deshife/${shifr}`)
    return response.data.data
  },

  async createDeshife(data: Partial<Deshife>): Promise<Deshife> {
    const response = await api.post('/api/deshife', data)
    clearCache('/api/deshife')
    return response.data.data
  },

  async bulkCreateDeshife(items: Partial<Deshife>[]): Promise<any> {
    const response = await api.post('/api/deshife/bulk', items)
    clearCache('/api/deshife')
    return response.data.data
  },

  async getDeshifeCategories(): Promise<string[]> {
    const response = await api.get('/api/deshife/categories')
    return response.data.data
  },

  // PhoneTabel
  async getPhones(params: { page?: number; limit?: number; activeOnly?: boolean } = {}): Promise<PhoneTabelListResponse> {
    const cacheKey = getCacheKey({ method: 'GET', url: '/api/phones', params })
    const cached = getFromCache(cacheKey)
    if (cached) return cached

    return retryRequest(async () => {
      const response = await api.get('/api/phones', { params })
      const data = response.data as PhoneTabelListResponse
      setCache(cacheKey, data)
      return data
    })
  },

  async getPhone(tzeh: string): Promise<PhoneTabel> {
    const response = await api.get(`/api/phones/${tzeh}`)
    return response.data.data
  },

  async createPhone(data: Partial<PhoneTabel>): Promise<PhoneTabel> {
    const response = await api.post('/api/phones', data)
    clearCache('/api/phones')
    return response.data.data
  },

  async bulkCreatePhones(items: Partial<PhoneTabel>[]): Promise<any> {
    const response = await api.post('/api/phones/bulk', items)
    clearCache('/api/phones')
    return response.data.data
  },

  // Auth
  async login(username: string, password: string): Promise<AuthResponse> {
    const response = await api.post('/api/auth/login', { username, password })
    return response.data
  },

  async register(username: string, password: string, role?: string): Promise<AuthResponse> {
    const response = await api.post('/api/auth/register', { username, password, role })
    return response.data
  },

  async getMe(): Promise<User> {
    const response = await api.get('/api/auth/me')
    return response.data.data
  },

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await api.post('/api/auth/change-password', { oldPassword, newPassword })
  },

  // Cache management
  clearCache(pattern?: string) {
    clearCache(pattern)
  }
}

export default apiService