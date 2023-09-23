import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'

import App from './App.vue'
import router from './router'

import '@/assets/theme.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(createI18n({
  locale: navigator.language.substring(0, 2),
  fallbackLocale: 'en',
  silentTranslationWarn: true,
  silentFallbackWarn: true
}))

app.mount('#app')
