<template>
  <Map :coordinates="krakowCoordinates" />
</template>

<script setup lang="ts">
import Map from '@/components/LeafletMap.vue'

const krakowCoordinates = [
  { lat: 50.0619, lng: 19.9383 }, // Example: Main Market Square
  { lat: 50.0671, lng: 19.9474 }, // Example: Wawel Castle
  { lat: 50.0527, lng: 19.9405 }, // Example: Vistula Boulevards
  { lat: 50.0594, lng: 19.9386 } // Example: Planty Park
]
</script>
