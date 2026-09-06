import { store } from 'quasar/wrappers'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export default store(({ app }) => {
  const pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)
  app.use(pinia)
})