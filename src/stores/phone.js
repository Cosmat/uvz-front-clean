import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiService from 'src/services/api'

export const usePhoneStore = defineStore('phone', () => {
  const phones = ref([])
  const loading = ref(false)
  const error = ref(null)
  const pagination = ref({ page: 1, limit: 100, total: 0, pages: 0 })

  const byTzeh = computed(() => {
    const map = {}
    for (const p of (phones.value || [])) {
      map[p.number_tzeh] = p
    }
    return map
  })

  async function fetchPhones(params = {}) {
    loading.value = true
    error.value = null
    // Instant display from cache, then silent refresh
    if (!phones.value.length) {
      try {
        const cached = JSON.parse(localStorage.getItem('uvz_phones_cache') || 'null')
        if (cached && cached.data?.length > 0) {
          phones.value = cached.data
          pagination.value = cached.pagination || pagination.value
          loading.value = false
        }
      } catch (e) { /* ignore */ }
    }
    try {
      const response = await apiService.getPhones(params)
      const data = response?.data || []
      const pag = response?.pagination || { page: 1, limit: 100, total: 0, pages: 0 }
      phones.value = data
      pagination.value = pag
      try {
        localStorage.setItem('uvz_phones_cache', JSON.stringify({ data, pagination: pag, ts: Date.now() }))
      } catch (e) { /* quota exceeded - ignore */ }
    } catch (e) {
      error.value = e.message || 'Failed to fetch phones'
      phones.value = phones.value.length > 0 ? phones.value : []
    } finally {
      loading.value = false
    }
  }

  async function getPhone(tzeh) {
    if (byTzeh.value[tzeh]) return byTzeh.value[tzeh]
    try {
      return await apiService.getPhone(tzeh)
    } catch (e) {
      return null
    }
  }

  async function createPhone(data) {
    const newItem = await apiService.createPhone(data)
    phones.value.push(newItem)
    return newItem
  }

  async function bulkCreatePhones(items) {
    const result = await apiService.bulkCreatePhones(items)
    await fetchPhones({ limit: 1000 })
    return result
  }

  return {
    phones, loading, error, pagination, byTzeh,
    fetchPhones, getPhone, createPhone, bulkCreatePhones
  }
})