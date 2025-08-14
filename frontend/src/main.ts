import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'

// Create pinia instance
const pinia = createPinia()

// Create app instance
const app = createApp(App)

// Use plugins
app.use(pinia)
app.use(router)
app.use(ElementPlus)

// Mount app
app.mount('#app')