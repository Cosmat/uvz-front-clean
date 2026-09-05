import { boot } from 'quasar/wrappers'
import axios from 'axios'

const getBaseUrl = () => {
  if (typeof window !== 'undefined' && window.__RUNTIME_CONFIG__ && window.__RUNTIME_CONFIG__.VUE_APP_API_URL) {
    return window.__RUNTIME_CONFIG__.VUE_APP_API_URL
  }
  // fallback to build-time env
  return process.env.VUE_APP_API_URL || 'http://localhost:8000'
}

const api = axios.create({ baseURL: getBaseUrl() })

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { axios, api }