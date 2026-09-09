import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiService from 'src/services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isModerator = computed(() => user.value?.role === 'moderator' || user.value?.role === 'admin')

  async function login(username, password) {
    loading.value = true
    error.value = null
    try {
      const response = await apiService.login(username, password)
      token.value = response.token
      user.value = response.user
      localStorage.setItem('token', response.token)
      return response
    } catch (e) {
      error.value = e.response?.data?.message || 'Login failed'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function register(username, password, role = 'user') {
    loading.value = true
    error.value = null
    try {
      const response = await apiService.register(username, password, role)
      token.value = response.token
      user.value = response.user
      localStorage.setItem('token', response.token)
      return response
    } catch (e) {
      error.value = e.response?.data?.message || 'Registration failed'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchMe() {
    if (!token.value) return null
    loading.value = true
    try {
      user.value = await apiService.getMe()
      return user.value
    } catch (e) {
      logout()
      return null
    } finally {
      loading.value = false
    }
  }

  async function changePassword(oldPassword, newPassword) {
    loading.value = true
    try {
      await apiService.changePassword(oldPassword, newPassword)
    } catch (e) {
      error.value = e.response?.data?.message || 'Failed to change password'
      throw e
    } finally {
      loading.value = false
    }
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
  }

  function clearError() {
    error.value = null
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    isModerator,
    login,
    register,
    fetchMe,
    changePassword,
    logout,
    clearError
  }
})