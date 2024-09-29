<template>
  <div :style="{ height: '92%' }">
    <div id="map" :style="{ height: '100%' }"></div>
  </div>
</template>

<script setup lang="ts">
import 'leaflet/dist/leaflet.css'
import * as L from 'leaflet'
import { onMounted, ref } from 'vue'
import { useLocationStore } from '@/stores/location';

const KRAKOW_LAT = 50.0647
const KRAKOW_LNG = 19.9447
const INITIAL_ZOOM = 13
const locationStore = useLocationStore()
type Coordinate = {
  lat: number
  lng: number
  isWaypoint?: boolean
}

const props = defineProps<{
  coordinates: Coordinate[]
}>()

const initialMap = ref<L.Map | null>(null)

onMounted(() => {
  const map = L.map('map').setView([KRAKOW_LAT, KRAKOW_LNG], INITIAL_ZOOM)
  initialMap.value = map
  locationStore.mid
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map)

  if (!props.coordinates.length) return
  console.log(props.coordinates.filter((coord) => coord.isWaypoint))
  const firstPoint = props.coordinates[0]
  L.marker([firstPoint.lat, firstPoint.lng]).addTo(map)


  locationStore.mid?.forEach((waypoint) => {
    L.marker([waypoint.y, waypoint.x]).addTo(map)
  })

  const lastPoint = props.coordinates[props.coordinates.length - 1]
  L.marker([lastPoint.lat, lastPoint.lng]).addTo(map)

  const latLngs: L.LatLngExpression[] = props.coordinates.map((point) => [point.lat, point.lng])
  const polyline = L.polyline(latLngs, { color: '#3b82f6' }).addTo(map)

  map.fitBounds(polyline.getBounds())
})
</script>
