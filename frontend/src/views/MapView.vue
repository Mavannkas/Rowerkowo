<template>
  <Map :coordinates="routeCoordinates" />
</template>

<script setup lang="ts">
import Map from '@/components/LeafletMap.vue'
import axios from 'axios'
import { useQuery } from '@tanstack/vue-query'
import polyline from '@mapbox/polyline'
import { computed } from 'vue'

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

// TODO replace with dynamic values
const start = '19.984829,50.066164'
const end = '19.936580,50.061430'

const fetchRouteData = async (): Promise<RouteResponse> => {
  const response = await axios.get<RouteResponse>('http://localhost:3011/directions', {
    params: {
      start: start,
      end: end,
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
  let coordinates: { lat: number; lng: number }[] = [] // Type for coordinates array

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
</script>
