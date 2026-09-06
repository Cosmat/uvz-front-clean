import { boot } from 'quasar/wrappers'
import axios from 'axios'

// Create axios instance WITHOUT baseURL - will be set dynamically
const api = axios.create()

// Request interceptor to dynamically set baseURL from runtime config
api.interceptors.request.use(config => {
  const getBaseUrl = () => {
    if (typeof window !== 'undefined' && window.__RUNTIME_CONFIG__ && window.__RUNTIME_CONFIG__.VUE_APP_API_URL) {
      return window.__RUNTIME_CONFIG__.VUE_APP_API_URL
    }
    return process.env.VUE_APP_API_URL || 'http://localhost:8000'
  }
  
  // Set baseURL dynamically for each request
  config.baseURL = getBaseUrl()
  return config
})

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { axios, api }