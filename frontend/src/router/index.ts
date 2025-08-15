import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../pages/HomeView.vue'
import LoginView from '../pages/LoginView.vue'
import CategoryView from '../pages/CategoryView.vue'
import UserHomeView from '../pages/UserHomeView.vue'
import ForgotPasswordView from '../pages/ForgotPasswordView.vue'

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
  {
    path: '/register',
    name: 'register',
    component: LoginView
  },
  {
    path: '/categories',
    name: 'categories',
    component: CategoryView,
    meta: { requiresAuth: true }
  },
  {
    path: '/user/:userId',
    name: 'userHome',
    component: UserHomeView
  }
]

// Create router instance
const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  
  // Redirect to login page if no token and trying to access protected routes
  if (!token && to.name !== 'login' && to.name !== 'register') {
    next({ name: 'login' });
  } else if (token && (to.name === 'login' || to.name === 'register')) {
    // If already logged in, redirect to home when trying to access login/register
    next({ name: 'home' });
  } else {
    next();
  }
});

export default router