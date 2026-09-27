import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiService from 'src/services/api'

export const useDeshifeStore = defineStore('deshife', () => {
  const deshife = ref([])
  const loading = ref(false)
  const error = ref(null)
  const pagination = ref({ page: 1, limit: 100, total: 0, pages: 0 })
  const categories = ref([])

  const byCategory = computed(() => {
    const grouped = {}
    for (const d of (deshife.value || [])) {
      if (!grouped[d.category]) grouped[d.category] = []
      grouped[d.category].push(d)
    }
    return grouped
  })

  const searchDeshife = computed(() => (query) => {
    if (!query) return deshife.value || []
    const q = query.toLowerCase()
    return (deshife.value || []).filter(d =>
      d.shifr?.toLowerCase().includes(q) || d.description?.toLowerCase().includes(q)
    )
  })

  async function fetchDeshife(params = {}) {
    loading.value = true
    error.value = null
    // Instant display from cache, then silent refresh
    if (!deshife.value.length) {
      try {
        const cached = JSON.parse(localStorage.getItem('uvz_deshife_cache') || 'null')
        if (cached && cached.data?.length > 0) {
          deshife.value = cached.data
          pagination.value = cached.pagination || pagination.value
          loading.value = false
        }
      } catch (e) { /* ignore */ }
    }
    try {
      const response = await apiService.getDeshife(params)
      const data = response?.data || []
      const pag = response?.pagination || { page: 1, limit: 100, total: 0, pages: 0 }
      deshife.value = data
      pagination.value = pag
      try {
        localStorage.setItem('uvz_deshife_cache', JSON.stringify({ data, pagination: pag, ts: Date.now() }))
      } catch (e) { /* quota exceeded - ignore */ }
    } catch (e) {
      error.value = e.message || 'Failed to fetch deshife'
      deshife.value = deshife.value.length > 0 ? deshife.value : []
    } finally {
      loading.value = false
    }
  }

  async function fetchCategories() {
    try {
      categories.value = await apiService.getDeshifeCategories()
    } catch (e) {
      console.error('fetchCategories error:', e)
    }
  }

  async function createDeshife(data) {
    const newItem = await apiService.createDeshife(data)
    deshife.value.push(newItem)
    return newItem
  }

  async function bulkCreateDeshife(items) {
    const result = await apiService.bulkCreateDeshife(items)
    await fetchDeshife({ limit: 1000 })
    return result
  }

  return {
    deshife, loading, error, pagination, categories,
    byCategory, searchDeshife,
    fetchDeshife, fetchCategories, createDeshife, bulkCreateDeshife
  }
})