<template>
  <section class="flex h-full flex-col gap-4 p-6">
    <h1 class="text-3xl font-bold">Moje konto</h1>
    <div class="flex items-center gap-3 text-lg">
      <div class="h-12 w-12 rounded-full bg-slate-500"></div>
      <span>{{ authStore.user ? `${authStore.user?.email}` : 'Niezalogowany użytkownik' }}</span>
    </div>
    <div class="mt-auto flex flex-col gap-4" v-if="!authStore.user">
      <RouterLink class="w-full" :to="ROUTING_URLS.LOGIN">
        <BaseButton class="w-full">Zaloguj się</BaseButton>
      </RouterLink>
      <RouterLink class="w-full" :to="ROUTING_URLS.REGISTER">
        <BaseButton class="w-full" styling="outline">Zarejestruj się</BaseButton>
      </RouterLink>
    </div>
  </section>
</template>
<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import { ROUTING_URLS } from '@/router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>
