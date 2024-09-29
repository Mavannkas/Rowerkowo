<template>
  <div class="flex h-full flex-col p-6">
    <h1 class="mb-4 text-3xl font-bold">Wyszukaj trasę</h1>
    <form class="flex flex-1 flex-col gap-6">
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
      <div class="flex gap-4">
        <BaseDropdown
          class="w-1/2"
          placeholder="Typ roweru"
          :options="bikeOptions"
          @update:model-value="(value: string) => (bikeOption = value)"
        />
        <BaseDropdown
          class="w-1/2"
          placeholder="Styl jazdy"
          :options="rideOptions"
          @update:model-value="(value: string) => (rideOption = value)"
        />
      </div>
      <BaseCheckbox v-model="withChildren">Jadę z dzieckiem</BaseCheckbox>
      <BaseCheckbox v-model="avoidNationalRoads">Omiń drogi krajowe</BaseCheckbox>
      <BaseButton class="mt-auto" type="submit" @click.prevent="handleSearchForm"
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
import BaseCheckbox from '@/components/BaseCheckbox.vue'
import BaseDropdown from '@/components/BaseDropdown.vue'

const isGeolocated = ref(false)

const startingPoint = ref('')
const destination = ref('')
const bikeOption = ref('')
const rideOption = ref('')
const withChildren = ref(false)
const avoidNationalRoads = ref(false)
const locationStore = useLocationStore()
const router = useRouter()

const bikeOptions = [
  {
    label: 'Rower miejski',
    value: 'cityBike'
  },
  {
    label: 'Rower górski',
    value: 'mountainBike'
  },
  {
    label: 'Rower szosowy',
    value: 'roadBike'
  }
]
const rideOptions = [
  {
    label: 'Jazda rekreacyjna',
    value: 'recreationalRide'
  },
  {
    label: 'Jazda treningowa',
    value: 'trainingRide'
  },
  {
    label: 'Jazda miejska',
    value: 'cityRide'
  }
]

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
