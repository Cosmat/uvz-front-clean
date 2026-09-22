import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiService from 'src/services/api'

export const useZayavkaStore = defineStore('zayavka', () => {
  const zayavki = ref([])
  const loading = ref(false)
  const error = ref(null)
  const pagination = ref({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
    hasNext: false,
    hasPrev: false
  })
  const filters = ref({})
  const stats = ref(null)

  const activeZayavki = computed(() => (zayavki.value || []).filter(z => z.status === 'Активная'))
  const byTzeh = computed(() => {
    const grouped = {}
    for (const z of (zayavki.value || [])) {
      if (!grouped[z.tzeh]) grouped[z.tzeh] = []
      grouped[z.tzeh].push(z)
    }
    return grouped
  })
  const uniqueTzehs = computed(() => [...new Set((zayavki.value || []).map(z => z.tzeh))].sort())
  const uniqueProfessias = computed(() => [...new Set((zayavki.value || []).map(z => z.professia))].sort())

  async function fetchZayavki(newFilters = {}) {
    loading.value = true
    error.value = null
    Object.assign(filters.value, newFilters)

    // Instant display: show cached data from previous session while refreshing
    const cacheKey = 'uvz_zayavki_cache'
    const isInitialLoad = zayavki.value.length === 0 && !newFilters.page && !newFilters.professia
    if (isInitialLoad) {
      try {
        const cached = JSON.parse(localStorage.getItem(cacheKey) || 'null')
        if (cached && cached.data?.length > 0 && Date.now() - cached.ts < 10 * 60 * 1000) {
          zayavki.value = cached.data
          pagination.value = cached.pagination || pagination.value
          loading.value = false // don't block UI with skeleton, refresh silently
        }
      } catch (e) { /* ignore cache errors */ }
    }

    try {
      const response = await apiService.getZayavki(filters.value)
      const data = response?.data || []
      const pag = response?.pagination || { page: 1, limit: 20, total: 0, pages: 0, hasNext: false, hasPrev: false }
      zayavki.value = data
      pagination.value = pag
      // Save to localStorage for instant next load
      if (!newFilters.professia && !newFilters.tzeh && !newFilters.schedule && !newFilters.experience_required) {
        try {
          localStorage.setItem(cacheKey, JSON.stringify({ data, pagination: pag, ts: Date.now() }))
        } catch (e) { /* quota exceeded - ignore */ }
      }
    } catch (e) {
      // Only show error if we have nothing to display
      if (zayavki.value.length === 0) {
        error.value = e.message || 'Failed to fetch vacancies'
        console.error('fetchZayavki error:', e)
      }
      zayavki.value = zayavki.value.length > 0 ? zayavki.value : []
    } finally {
      loading.value = false
    }
  }

  async function fetchNextPage() {
    if (!pagination.value.hasNext || loading.value) return
    await fetchZayavki({ ...filters.value, page: pagination.value.page + 1 })
  }

  async function fetchPrevPage() {
    if (!pagination.value.hasPrev || loading.value) return
    await fetchZayavki({ ...filters.value, page: pagination.value.page - 1 })
  }

  async function setFilters(newFilters) {
    await fetchZayavki({ ...newFilters, page: 1 })
  }

  async function clearFilters() {
    filters.value = {}
    await fetchZayavki({})
  }

  async function fetchStats() {
    try {
      stats.value = await apiService.getZayavkiStats()
    } catch (e) {
      console.error('fetchStats error:', e)
    }
  }

  async function createZayavka(data) {
    loading.value = true
    try {
      const newZayavka = await apiService.createZayavka(data)
      zayavki.value.unshift(newZayavka)
      pagination.value.total += 1
      return newZayavka
    } catch (e) {
      error.value = e.message || 'Failed to create vacancy'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateZayavka(id, data) {
    try {
      const updated = await apiService.updateZayavka(id, data)
      const index = zayavki.value.findIndex(z => (z._id || z.id) === id)
      if (index !== -1) {
        zayavki.value[index] = { ...zayavki.value[index], ...updated }
      }
      return updated
    } catch (e) {
      error.value = e.message || 'Failed to update vacancy'
      throw e
    }
  }

  async function archiveZayavka(id) {
    try {
      const updated = await apiService.archiveZayavka(id)
      const index = zayavki.value.findIndex(z => (z._id || z.id) === id)
      if (index !== -1) {
        zayavki.value[index] = { ...zayavki.value[index], ...updated }
      }
      return updated
    } catch (e) {
      error.value = e.message || 'Failed to archive vacancy'
      throw e
    }
  }

  async function deleteZayavka(id) {
    try {
      await apiService.deleteZayavka(id)
      const index = zayavki.value.findIndex(z => (z._id || z.id) === id)
      if (index !== -1) {
        zayavki.value.splice(index, 1)
        pagination.value.total -= 1
      }
    } catch (e) {
      error.value = e.message || 'Failed to delete vacancy'
      throw e
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    zayavki, loading, error, pagination, filters, stats,
    activeZayavki, byTzeh, uniqueTzehs, uniqueProfessias,
    fetchZayavki, fetchNextPage, fetchPrevPage, setFilters, clearFilters,
    fetchStats, createZayavka, updateZayavka, archiveZayavka, deleteZayavka, clearError
  }
})