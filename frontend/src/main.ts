import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// Import Pinia
import { createPinia } from 'pinia'

// Import Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// Import router
import router from './router'

// Create app instance
const app = createApp(App)

// Use Pinia
app.use(createPinia())

// Use Element Plus
app.use(ElementPlus)

// Use router
app.use(router)

app.mount('#app')
