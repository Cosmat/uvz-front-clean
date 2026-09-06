import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiService from 'src/services/api'

export const useDeshifeStore = defineStore('deshife', () => {
  const deshife = ref([])
  const loading = ref(false)
  const error = ref(null)
  const pagination = ref({
    page: 1,
    limit: 100,
    total: 0,
    pages: 0
  })
  const categories = ref([])

  const byCategory = computed(() => {
    const grouped = {}
    for (const d of deshife.value) {
      if (!grouped[d.category]) grouped[d.category] = []
      grouped[d.category].push(d)
    }
    return grouped
  })

  const searchDeshife = computed(() => (query) => {
    if (!query) return deshife.value
    const q = query.toLowerCase()
    return deshife.value.filter(d => 
      d.shifr.toLowerCase().includes(q) ||
      d.description.toLowerCase().includes(q)
    )
  })

  async function fetchDeshife(params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await apiService.getDeshife(params)
      deshife.value = response.data || []
      pagination.value = response.pagination || { page: 1, limit: 100, total: 0, pages: 0 }
    } catch (e) {
      error.value = e.message || 'Failed to fetch deshife'
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
    deshife,
    loading,
    error,
    pagination,
    categories,
    byCategory,
    searchDeshife,
    fetchDeshife,
    fetchCategories,
    createDeshife,
    bulkCreateDeshife
  }
})