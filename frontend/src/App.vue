<template>
  <div class="flex h-dvh flex-col">
    <RouterView />
    <BaseBottomNavigation />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import 'leaflet/dist/leaflet.css'
import BaseBottomNavigation from './components/BaseBottomNavigation.vue'
</script>
