import { boot } from 'quasar/wrappers'
import axios from 'axios'

let apiInstance = null

const getBaseUrl = () => {
  if (typeof window !== 'undefined' && window.__RUNTIME_CONFIG__ && window.__RUNTIME_CONFIG__.VUE_APP_API_URL) {
    return window.__RUNTIME_CONFIG__.VUE_APP_API_URL
  }
  return process.env.VUE_APP_API_URL || 'http://localhost:8000'
}

const getApi = () => {
  if (!apiInstance) {
    apiInstance = axios.create({ baseURL: getBaseUrl() })
  }
  return apiInstance
}

// Export a proxy object that delegates to the lazy instance
const apiProxy = new Proxy({}, {
  get(target, prop) {
    const api = getApi()
    return api[prop]
  }
})

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = apiProxy
})

export { axios, apiProxy as api }