<template>
  <!--  Empty div is needed here to prevent the map from being rendered before the map container is created-->
  <div>
    <div id="map" style="height: 90vh"></div>
  </div>
</template>

<script setup lang="ts">
import 'leaflet/dist/leaflet.css'
import * as L from 'leaflet'
import { onMounted, ref } from 'vue'

const KRAKOW_LAT = 50.0647
const KRAKOW_LNG = 19.9447
const INITIAL_ZOOM = 13

type Coordinate = {
  lat: number
  lng: number
}

const props = defineProps<{
  coordinates: Coordinate[]
}>()

const initialMap = ref<L.Map | null>(null)

onMounted(() => {
  const map = L.map('map').setView([KRAKOW_LAT, KRAKOW_LNG], INITIAL_ZOOM)
  initialMap.value = map

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map)

  if (!props.coordinates.length) return

  const firstPoint = props.coordinates[0]
  const lastPoint = props.coordinates[props.coordinates.length - 1]

  L.marker([firstPoint.lat, firstPoint.lng]).addTo(map)
  L.marker([lastPoint.lat, lastPoint.lng]).addTo(map)
})
</script>
