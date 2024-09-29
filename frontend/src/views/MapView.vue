<template>
  <Map :key="version" :coordinates="routeCoordinates" />
  <div class="flex h-[8%] items-center justify-around">
    <p v-if="distance !== ''" class="text-lg">
      Dystans: <span class="font-bold text-primary-600">{{ distance }}</span>
    </p>
    <p v-if="duration !== ''" class="text-lg">
      Czas: <span class="font-bold text-primary-600">{{ duration }}</span>
    </p>
  </div>
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
        distance: number
        duration: number
      }>
    }>
  }>
}

const version = ref(0)
const locationStore = useLocationStore()

const fetchRouteData = async (): Promise<RouteResponse> => {
  if (
    !locationStore.start ||
    !locationStore.end ||
    !locationStore.start.y ||
    !locationStore.start.x ||
    !locationStore.end.y ||
    !locationStore.end.x
  ) {
    throw new Error('Start or end location is missing')
  }

  const startLat = locationStore.start?.y
  const startLng = locationStore.start?.x
  const endLat = locationStore.end?.y
  const endLng = locationStore.end?.x

  if (!startLat || !startLng || !endLat || !endLng) {
    throw new Error('Invalid coordinates for start or end location')
  }

  const startCoordinates = `${startLng},${startLat}`
  const endCoordinates = `${endLng},${endLat}`

  const response = await axios.get<RouteResponse>('http://localhost:3011/directions', {
    params: {
      start: startCoordinates,
      end: endCoordinates,
      mode: locationStore.mode
    }
  })

  return response.data
}

const { data } = useQuery<RouteResponse>({
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

const distance = computed(() => {
  if (!data.value || !data.value.routes || !data.value.routes.length) return ''

  const distance = data.value.routes[0].legs[0].steps.reduce((acc, step) => acc + step.distance, 0)

  const distanceString = `${(distance / 1000).toFixed(2)} km`

  return distanceString
})
const duration = computed(() => {
  if (!data.value || !data.value.routes || !data.value.routes.length) return ''

  const duration = data.value.routes[0].legs[0].steps.reduce((acc, step) => acc + step.duration, 0)
  const time = new Date()
  time.setSeconds(duration)
  const timeString = `${time.getHours()}h ${time.getMinutes()}m`

  return timeString
})

watch(routeCoordinates, () => {
  version.value++
})
</script>
