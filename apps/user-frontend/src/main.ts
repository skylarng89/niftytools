import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import routes from './router/routes'
import './style.css'

const app = createApp(App)

// Router setup
const router = createRouter({
  history: createWebHistory('/'),
  routes
})

// Pinia store
const pinia = createPinia()

app.use(router)
app.use(pinia)

app.mount('#app')