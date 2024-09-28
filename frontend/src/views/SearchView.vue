<template>
  <div class="p-6">
    <form class="flex flex-col gap-4">
      <BaseSearchInput
        type="text"
        label="Skąd jedziemy?"
        id="startingPoint"
        placeholder="Kraków Główny"
        v-model="startingPoint"
        geo-input
        @geolocation="(value) => (isGeolocated = value)"
      />
      <BaseSearchInput
        type="text"
        label="Dokąd jedziemy?"
        id="destination"
        placeholder="TAURON Arena Kraków"
        v-model="destination"
      />
      <BaseButton type="submit" @click.prevent="handleSearchForm"
        >Znajdź najlepszą trasę
      </BaseButton>
    </form>
  </div>
</template>
<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import BaseSearchInput from '@/components/BaseSearchInput.vue'
import { getCurrentGeolocation } from '@/helpers/getCurrentGeolocation'
import { getPointData } from '@/helpers/getPointData'
import { ref } from 'vue'
import { useLocationStore } from '@/stores/location'
import { useRouter } from 'vue-router'
import { ROUTING_URLS } from '@/router'

const isGeolocated = ref(false)

const startingPoint = ref('')
const destination = ref('')
const locationStore = useLocationStore()
const router = useRouter()

const handleSearchForm = async () => {
  try {
    let startingPointData: { x: number; y: number } | undefined

    if (isGeolocated.value) {
      startingPointData = await getCurrentGeolocation()
    } else {
      const response = await getPointData(startingPoint.value)
      startingPointData = { x: response[0].x, y: response[0].y }
    }

    const destinationResponse = await getPointData(destination.value)

    const destinationData = { x: destinationResponse[0].x, y: destinationResponse[0].y }
    if (!startingPointData || !destinationData) {
      throw new Error('No data')
    }

    locationStore.update(startingPointData, destinationData)
    void router.push(ROUTING_URLS.MAP)

    console.log(startingPointData)
    console.log(destinationData)
    console.log('Kamil działaj :)')

    // TODO - Send data to backend
  } catch (error) {
    console.error(error)
  }
}
</script>
