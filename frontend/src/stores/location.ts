import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export type LocationSearchResult = { x: number; y: number }

export const useLocationStore = defineStore('location', () => {
  const start = ref<LocationSearchResult>()
  const end = ref<LocationSearchResult>()
  const mid = ref<LocationSearchResult[]>()
  const mode = ref<string>('')
  const startingPointNameRef = ref<string>('')
  const destinationPointNameRef = ref<string>('')

  const update = (
    newStart: LocationSearchResult,
    newEnd: LocationSearchResult,
    additionalWaypointsData: LocationSearchResult[],
    newMode: string,
    startingPointName: string,
    destinationPointName: string
  ) => {
    start.value = newStart
    end.value = newEnd
    mid.value = additionalWaypointsData
    mode.value = newMode
    startingPointNameRef.value = startingPointName
    destinationPointNameRef.value = destinationPointName
    localStorage.setItem('startingPointName', startingPointName)
    localStorage.setItem('destinationPointName', destinationPointName)
  }

  const getSearchData = () => {
    startingPointNameRef.value = localStorage.getItem('startingPointName') || ''
    destinationPointNameRef.value = localStorage.getItem('destinationPointName') || ''
    return {
      startingPointName: startingPointNameRef.value,
      destinationPointName: destinationPointNameRef.value
    }
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

  return { start, end, update, updateRoutes, mode, getSearchData, mid }
})
