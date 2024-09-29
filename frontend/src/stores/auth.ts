import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useLocalStorage } from '@vueuse/core'

interface User {
  access_token: string
  email: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = useLocalStorage<User | null>('user', null)
  const isLoggedIn = ref<boolean>(!!user.value)

  const checkAuth = () => {
    isLoggedIn.value = !!user.value
    console.log('CheckAuth: User is', user.value)
  }

  const login = (userData: User) => {
    user.value = userData
    isLoggedIn.value = true
  }

  const logout = () => {
    user.value = null
    isLoggedIn.value = false
  }

  watch(user, (newUser) => {
    console.log('User updated in localStorage:', newUser)
  })

  return { user, isLoggedIn, checkAuth, login, logout }
})
