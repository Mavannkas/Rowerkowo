import { createRouter, createWebHistory } from 'vue-router'
import SearchView from '../views/SearchView.vue'
import { useAuthStore } from '../stores/auth'

export enum ROUTING_URLS {
  MAIN = '/',
  MAP = '/map',
  ROUTES = '/routes',
  ACCOUNT = '/account',
  LOGIN = '/login',
  REGISTER = '/register'
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: ROUTING_URLS.MAIN,
      name: 'search',
      component: SearchView
    },
    {
      path: ROUTING_URLS.MAP,
      name: 'map',
      component: () => import('../views/MapView.vue')
    },
    {
      path: ROUTING_URLS.ROUTES,
      name: 'routes',
      component: () => import('../views/RoutesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: ROUTING_URLS.ACCOUNT,
      name: 'account',
      component: () => import('../views/AccountView.vue')
    },
    {
      path: ROUTING_URLS.LOGIN,
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: ROUTING_URLS.REGISTER,
      name: 'register',
      component: () => import('../views/RegisterView.vue')
    }
  ]
})

router.beforeEach((to, _, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next({ path: '/login' })
  } else {
    next()
  }
})

export default router
