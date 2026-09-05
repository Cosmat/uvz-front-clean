import { boot } from 'quasar/wrappers'
import axios from 'axios'
import keys from '../keys/keys.dev'

const api = axios.create({ baseURL: keys.BASE_URL })

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { axios, api }