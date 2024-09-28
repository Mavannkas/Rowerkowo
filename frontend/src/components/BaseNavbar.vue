<template>
  <fwb-navbar>
    <template #default="{ isShowMenu }">
      <fwb-navbar-collapse :is-show-menu="isShowMenu">
        <fwb-navbar-link is-active :link="ROUTING_URLS.MAIN"> Home </fwb-navbar-link>
        <fwb-navbar-link :link="ROUTING_URLS.ABOUT"> Services </fwb-navbar-link>
      </fwb-navbar-collapse>
    </template>
    <template #right-side>
      <BaseButton @click="handleLogout">Logout</BaseButton>
    </template>
  </fwb-navbar>
</template>
<script setup lang="ts">
import { ROUTING_URLS } from '@/router/index.js'
import { FwbNavbar, FwbNavbarCollapse, FwbNavbarLink } from 'flowbite-vue'
import BaseButton from '@/components/BaseButton.vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push(ROUTING_URLS.LOGIN)
}
</script>
