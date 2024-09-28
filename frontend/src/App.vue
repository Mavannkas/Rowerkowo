<template>
  <div class="flex h-dvh flex-col">
    <div class="flex-1">
      <RouterView />
    </div>
    <BaseBottomNavigation />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import 'leaflet/dist/leaflet.css'
import '../node_modules/leaflet-geosearch/dist/geosearch.css'
import BaseBottomNavigation from './components/BaseBottomNavigation.vue'
</script>
