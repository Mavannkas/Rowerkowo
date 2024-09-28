import { ref } from 'vue'
import { defineStore } from 'pinia'

export type LocationSearchResult = { x: number; y: number }

export const useLocationStore = defineStore('location', () => {
  const start = ref<LocationSearchResult>()
  const end = ref<LocationSearchResult>()

  const update = (newStart: LocationSearchResult, newEnd: LocationSearchResult) => {
    start.value = newStart
    end.value = newEnd
  }
  return { start, end, update }
})
