import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import { useAuthStore } from '../stores/auth'

export enum ROUTING_URLS {
  MAIN = '/',
  ABOUT = '/about',
  LOGIN = '/login',
  REGISTER = '/register'
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: ROUTING_URLS.MAIN,
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: ROUTING_URLS.ABOUT,
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: ROUTING_URLS.LOGIN,
      name: 'login',
      component: LoginView
    },
    {
      path: ROUTING_URLS.REGISTER,
      name: 'register',
      component: () => import('../views/RegisterView.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next({ path: '/login' })
  } else {
    next()
  }
})

export default router
