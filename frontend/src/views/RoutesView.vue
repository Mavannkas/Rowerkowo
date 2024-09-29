<template>
  <main class="flex h-full flex-col gap-4 p-6">
    <section class="flex flex-col gap-4">
      <h1 class="text-3xl font-bold">Moje konto</h1>
      <div class="flex items-center gap-3 text-lg">
        <div v-if="!authStore.user?.email" class="h-12 w-12 rounded-full bg-slate-500"></div>
        <img
          v-else
          class="h-12 w-12 rounded-full"
          :src="`https://avatar.iran.liara.run/public/boy?username=${authStore.user?.email}`"
          alt="Neil image"
        />
        <span>{{
          authStore.user?.email ? `${authStore.user?.email}` : 'Niezalogowany użytkownik'
        }}</span>
      </div>
    </section>
    <div v-if="!authStore.isLoggedIn" class="my-auto flex flex-col items-center justify-center">
      <img class="h-16 w-16" src="/unauthorized.svg" alt="Ikona niezalogowany" />
      <p class="text-center">Tylko zalogowani użytkownicy mogą dodawać trasy.</p>
    </div>
    <div class="mt-auto flex flex-col gap-4" v-if="!authStore.user?.email">
      <RouterLink class="w-full" :to="ROUTING_URLS.LOGIN">
        <BaseButton class="w-full">Zaloguj się</BaseButton>
      </RouterLink>
      <RouterLink class="w-full" :to="ROUTING_URLS.REGISTER">
        <BaseButton class="w-full" styling="outline">Zarejestruj się</BaseButton>
      </RouterLink>
    </div>

    <RoutesShared v-else />
  </main>
</template>
<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import { ROUTING_URLS } from '@/router'
import { useAuthStore } from '@/stores/auth'
import RoutesShared from '@/components/RoutesShared.vue'

const authStore = useAuthStore()
</script>
