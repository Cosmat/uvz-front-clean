import { boot } from 'quasar/wrappers'
import axios from 'axios'

let apiInstance = null
let configResolved = false
let configResolve = null

const configPromise = new Promise(resolve => {
  configResolve = resolve
})

const getBaseUrl = () => {
  if (typeof window !== 'undefined' && window.__RUNTIME_CONFIG__ && window.__RUNTIME_CONFIG__.VUE_APP_API_URL) {
    return window.__RUNTIME_CONFIG__.VUE_APP_API_URL
  }
  return process.env.VUE_APP_API_URL || 'http://localhost:8000'
}

const getApi = async () => {
  if (!apiInstance) {
    // Wait for runtime config if in browser
    if (typeof window !== 'undefined' && !configResolved) {
      await configPromise
    }
    apiInstance = axios.create({ baseURL: getBaseUrl() })
  }
  return apiInstance
}

// Resolve config promise when config.js loads
if (typeof window !== 'undefined') {
  const checkConfig = () => {
    if (window.__RUNTIME_CONFIG__ && window.__RUNTIME_CONFIG__.VUE_APP_API_URL) {
      configResolved = true
      configResolve()
    } else {
      setTimeout(checkConfig, 50)
    }
  }
  checkConfig()
}

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios
  getApi().then(api => {
    app.config.globalProperties.$api = api
  })
})

export { axios, getApi as api }