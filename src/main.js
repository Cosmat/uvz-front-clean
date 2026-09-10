import { createApp } from 'vue'
import App from './App.vue'
import { Quasar } from 'quasar'
import quasarUserOptions from './quasar-user-options'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// Import design system styles
import '@/assets/styles/design-system.css'

// Import fonts
import '@fontsource/inter'
import '@fontsource/jetbrains-mono'
import '@fortawesome/fontawesome-free/css/all.min.css'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

createApp(App)
  .use(Quasar, quasarUserOptions)
  .use(pinia)
  .mount('#app')