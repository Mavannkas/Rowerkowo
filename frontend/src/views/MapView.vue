<template>
  <Map :key="version" :coordinates="routeCoordinates" />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import axios from 'axios'
import { useQuery } from '@tanstack/vue-query'
import polyline from '@mapbox/polyline'
import Map from '@/components/LeafletMap.vue'
import { useLocationStore } from '@/stores/location'

interface RouteResponse {
  code: string
  routes: Array<{
    legs: Array<{
      steps: Array<{
        geometry: string
      }>
    }>
  }>
}

const version = ref(0)
const locationStore = useLocationStore()

const fetchRouteData = async (): Promise<RouteResponse> => {
  if (!locationStore.start || !locationStore.end) {
    throw new Error('Start or end location is missing')
  }

  const startLat = locationStore.start?.y || locationStore.start?.raw?.lat
  const startLng = locationStore.start?.x || locationStore.start?.raw?.lon
  const endLat = locationStore.end?.y || locationStore.end?.raw?.lat
  const endLng = locationStore.end?.x || locationStore.end?.raw?.lon

  if (!startLat || !startLng || !endLat || !endLng) {
    throw new Error('Invalid coordinates for start or end location')
  }

  const startCoordinates = `${startLng},${startLat}`
  const endCoordinates = `${endLng},${endLat}`

  const response = await axios.get<RouteResponse>('http://localhost:3011/directions', {
    params: {
      start: startCoordinates,
      end: endCoordinates,
      mode: 'default'
    }
  })

  return response.data
}

const { data, isPending, error } = useQuery<RouteResponse>({
  queryKey: ['routeData'],
  queryFn: fetchRouteData
})

const routeCoordinates = computed(() => {
  if (!data.value || !data.value.routes || !data.value.routes.length) return []

  const steps = data.value.routes[0].legs[0].steps
  let coordinates: { lat: number; lng: number }[] = []

  steps.forEach((step) => {
    const decodedPath = polyline.decode(step.geometry)
    coordinates = coordinates.concat(
      decodedPath.map((point) => ({
        lat: point[0],
        lng: point[1]
      }))
    )
  })

  return coordinates
})

watch(routeCoordinates, () => {
  version.value++
})
</script>
