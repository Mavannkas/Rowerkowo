import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export type LocationSearchResult = { x: number; y: number }

export const useLocationStore = defineStore('location', () => {
  const start = ref<LocationSearchResult>()
  const end = ref<LocationSearchResult>()

  const update = (newStart: LocationSearchResult, newEnd: LocationSearchResult) => {
    start.value = newStart
    end.value = newEnd
  }

  const updateRoutes = async (routes: unknown, token: string) => {
    console.log('update routes bro', routes)
    try {
      const response = await axios.post('https://localhost:3011/users/route', routes, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log('Response:', response.data)
    } catch (e) {
      console.error("Couldn't post a new route for a user", e)
    }
  }

  return { start, end, update, updateRoutes }
})
