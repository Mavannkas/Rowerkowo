<template>
  <header v-if="authStore.isLoggedIn">
    <div class="min-h-full w-full bg-amber-50">
      <BaseBottomNavigation />
    </div>
  </header>

  <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { initFlowbite } from 'flowbite'
import { useAuthStore } from '@/stores/auth'
import 'leaflet/dist/leaflet.css'
import BaseBottomNavigation from './components/BaseBottomNavigation.vue'

const authStore = useAuthStore()

onMounted(() => {
  initFlowbite()
})
</script>
