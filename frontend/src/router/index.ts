import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../pages/HomeView.vue'
import LoginView from '../pages/LoginView.vue'

// Define routes
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  // Add more routes here as needed
]

// Create router instance
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router