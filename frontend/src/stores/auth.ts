import { defineStore } from 'pinia'
import { ref } from 'vue'

interface User {
  access_token: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isLoggedIn = ref<boolean>(localStorage.getItem('user') !== null)

  const checkAuth = () => {
    const savedUser = localStorage.getItem('user')

    if (!savedUser) {
      isLoggedIn.value = false
      user.value = null
      return
    }

    try {
      user.value = JSON.parse(savedUser)
      isLoggedIn.value = true
    } catch (error) {
      isLoggedIn.value = false
      user.value = null
    }
  }

  const login = (userData: User) => {
    user.value = userData
    isLoggedIn.value = true
    localStorage.setItem('user', JSON.stringify(user.value))
  }

  const logout = () => {
    user.value = null
    isLoggedIn.value = false
    localStorage.removeItem('user')
  }

  return { user, isLoggedIn, checkAuth, login, logout }
})
