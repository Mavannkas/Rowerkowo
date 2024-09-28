import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { SearchResult } from 'leaflet-geosearch/dist/providers/provider.js'
import type { RawResult } from 'leaflet-geosearch/dist/providers/openStreetMapProvider.js'

export type LocationSearchResult = SearchResult<RawResult>

export const useLocationStore = defineStore('location', () => {
  const start = ref<LocationSearchResult>()
  const end = ref<LocationSearchResult>()

  const update = (newStart: LocationSearchResult, newEnd: LocationSearchResult) => {
    start.value = newStart
    end.value = newEnd
  }
  return { start, end, update }
})
