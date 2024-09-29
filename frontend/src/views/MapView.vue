<template>
  <Map :key="version" :coordinates="routeCoordinates" />

  <div v-if="activeState === 'data'" class="flex h-[8%] items-center justify-around">
    <p v-if="distance !== ''" class="text-lg">
      Dystans: <span class="font-bold text-primary-600">{{ distance }}</span>
    </p>
    <p v-if="duration !== ''" class="text-lg">
      Czas: <span class="font-bold text-primary-600">{{ duration }}</span>
    </p>
    <button
      v-if="authStore.user?.email"
      type="button"
      class="text-primary relative h-[52px] w-[52px] rounded-lg bg-white shadow-sm focus:outline-none focus:ring-4 focus:ring-gray-300"
      @click="activeState = 'share'"
    >
      <svg
        class="mx-auto h-5 w-5"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 18 18"
      >
        <path
          d="M14.419 10.581a3.564 3.564 0 0 0-2.574 1.1l-4.756-2.49a3.54 3.54 0 0 0 .072-.71 3.55 3.55 0 0 0-.043-.428L11.67 6.1a3.56 3.56 0 1 0-.831-2.265c.006.143.02.286.043.428L6.33 6.218a3.573 3.573 0 1 0-.175 4.743l4.756 2.491a3.58 3.58 0 1 0 3.508-2.871Z"
        />
      </svg>
    </button>
  </div>

  <div v-if="activeState === 'share'" class="flex h-[8%] items-center justify-around">
    <BaseFormInput
      type="text"
      id="text"
      placeholder="Wpisz tytuł wycieczki"
      required
      v-model="tripTitle"
    />
    <BaseButton @click="handleShare"> Udostępnij </BaseButton>
  </div>

  <div v-if="activeState === 'shared'" class="flex h-[8%] items-center justify-around">
    <p class="text-lg">Wycieczka została udostępniona!</p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import axios from 'axios'
import { useQuery } from '@tanstack/vue-query'
import polyline from '@mapbox/polyline'
import Map from '@/components/LeafletMap.vue'
import { useLocationStore } from '@/stores/location'
import BaseFormInput from '@/components/BaseFormInput.vue'
import BaseButton from '@/components/BaseButton.vue'
import { useAuthStore } from '@/stores/auth'

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
const activeState = ref<'data' | 'share' | 'shared'>('data')
const tripTitle = ref('')
const authStore = useAuthStore()
let routeData: RouteResponse | null = null

const handleShare = () => {
  activeState.value = 'shared'

  const startLat = locationStore.start?.y
  const startLng = locationStore.start?.x
  const endLat = locationStore.end?.y
  const endLng = locationStore.end?.x

  if (!startLat || !startLng || !endLat || !endLng) {
    throw new Error('Invalid coordinates for start or end location')
  }
  const {startingPointName, destinationPointName} = locationStore.getSearchData()
  void axios.post(
    'http://localhost:3011/route-sharing',
    {
      route: routeData,
      name: tripTitle.value || 'Bez nazwy',
      start: startingPointName.split(',')[0],
      finish: destinationPointName.split(',')[0],
      tags: [''] // Na razie nie implementujemy
    },
    {
      headers: {
        Authorization: `Bearer ${authStore.user?.access_token}`
      }
    }
  )
}

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

  const additionalWaypoints = locationStore.mid

  if (additionalWaypoints && additionalWaypoints.length > 0) {
    const response = await axios.get<any>('http://localhost:3011/directions/trip', {
      params: {
        stops: [
          startCoordinates,
          ...additionalWaypoints.map((point) => `${point.x},${point.y}`),
          endCoordinates
        ].join(';'),
        mode: locationStore.mode
      }
    })

    routeData = {
      ...response.data,
      routes: response.data?.trips
    }

    return {
      ...response.data,
      routes: response.data?.trips
    }

  }
  const response = await axios.get<RouteResponse>('http://localhost:3011/directions', {
    params: {
      start: startCoordinates,
      end: endCoordinates,
      mode: locationStore.mode
    }
  })

  routeData = response.data
  return response.data
}

const { data } = useQuery<RouteResponse>({
  queryKey: ['routeData'],
  queryFn: fetchRouteData
})

const routeCoordinates = computed(() => {
  if (!data.value || !data.value.routes || !data.value.routes.length) return []

  const steps = data.value.routes[0].legs.flatMap((leg) => leg.steps)
  let coordinates: { lat: number; lng: number; isWaypoint: boolean }[] = []

  steps.forEach((step) => {
    const decodedPath = polyline.decode(step.geometry)
    coordinates = coordinates.concat(
      decodedPath.map((point) => ({
        lat: point[0],
        lng: point[1],
        isWaypoint:
          locationStore.mid?.some(
            (midPoint) => midPoint.x == point[1] && midPoint.y == point[0]
          ) || false || false
      }))
    )
  })

  return coordinates
})

const distance = computed(() => {
  if (!data.value || !data.value.routes || !data.value.routes.length) return ''

  const distance = data.value.routes[0].legs.flatMap(leg => leg.steps).reduce((acc, step) => acc + step.distance, 0)

  return `${(distance / 1000).toFixed(2)} km`
})
const duration = computed(() => {
  if (!data.value || !data.value.routes || !data.value.routes.length) return ''

  const totalDuration = data.value.routes[0].legs.flatMap(leg => leg.steps).reduce(
    (acc, step) => acc + step.duration,
    0
  )

  const hours = Math.floor(totalDuration / 3600)
  const minutes = Math.floor((totalDuration % 3600) / 60)

  return `${hours}h ${minutes}m`
})

watch(routeCoordinates, () => {
  version.value++
})
</script>
