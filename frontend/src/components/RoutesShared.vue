<template>
  <section>
    <h2 class="mb-3 text-2xl font-bold">Popularne trasy</h2>
    <ul class="flex flex-col gap-3">
      <li v-for="route in routes" :key="route.name">
        <RoutesProfile :created-by="route.createdBy" />

        <a
          href="#"
          class="block max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {{ route.name }}
          </h5>

          <p class="font-normal text-gray-700 dark:text-gray-400">
            {{ route.start }} - {{ route.finish }}
          </p>

          <p v-if="route.tags.length" class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Tags:
            <span v-for="tag in route.tags" :key="tag" class="mr-2">
              {{ tag }}
            </span>
          </p>
        </a>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import RoutesProfile from '@/components/RoutesProfile.vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { useQuery } from '@tanstack/vue-query'

const authStore = useAuthStore()

type Route = {
  route: unknown
  name: string
  start: string
  finish: string
  tags: string[]
  createdBy: string
}

const getUserRoutes = async () => {
  const response = await axios.get('http://localhost:3011/routes/shared', {
    headers: {
      Authorization: `Bearer ${authStore.user?.access_token}`
    }
  })
  return response.data
}

const { data } = useQuery({
  queryKey: ['routes'],
  queryFn: getUserRoutes
})

// ZONACZ JAK WYGLADA I DAWAJ, zamiec z routes
console.log(data)

const routes: Route[] = [
  {
    route: 'fuck it',
    name: 'STILL HAD HOPE',
    start: 'KRAKOW tauron arena',
    finish: 'dworzec kurwa glowny',
    tags: ['tag1', 'tag2'],
    createdBy: 'pizdeusz'
  },
  {
    route: 'suck it',
    name: 'podroz meczennika',
    start: 'wroclaw',
    finish: 'spierdalam do domu',
    tags: ['tag3', 'tag4'],
    createdBy: 'kutasiarz'
  }
]
</script>
