import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useLocalStorage } from '@vueuse/core'

interface User {
  access_token: string
  email: string
}

export const useAuthStore = defineStore('auth', () => {
  // Automatically handles JSON.stringify and JSON.parse
  const user = useLocalStorage<User | null>('user', null)
  const isLoggedIn = ref<boolean>(!!user.value)

  const checkAuth = () => {
    isLoggedIn.value = !!user.value
    console.log('CheckAuth: User is', user.value)
  }

  const login = (userData: User) => {
    console.log('Logging in with:', userData)
    user.value = userData // Will be automatically stringified and saved to local storage
    isLoggedIn.value = true
    console.log('Stored user:', user.value)
  }

  const logout = () => {
    console.log('Logging out.')
    user.value = null
    isLoggedIn.value = false
  }

  // Watch for any changes to `user` in localStorage
  watch(user, (newUser) => {
    console.log('User updated in localStorage:', newUser)
  })

  return { user, isLoggedIn, checkAuth, login, logout }
})
