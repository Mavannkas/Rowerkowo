<template>
  <div class="flex h-full flex-col p-6">
    <h1 class="mb-4 text-3xl font-bold">Wyszukaj trasę</h1>
    <form class="flex flex-1 flex-col gap-6">
      <div class="flex flex-col gap-y-2">
        <BaseSearchInput
          type="text"
          label="Skąd jedziemy?"
          id="startingPoint"
          placeholder="Kraków Główny"
          query="startingPoint"
          v-model="startingPoint"
          geo-input
          @geolocation="(value) => (isGeolocated = value)"
        />
        <BaseSearchInput
          v-for="(_, index) in additionalWaypoints"
          :key="index"
          type="text"
          label="Punkt pośredni"
          deletable
          @close="additionalWaypoints.splice(index, 1)"
          :id="`waypoint-${index}`"
          v-model="additionalWaypoints[index]"
        />
        <button type="button" @click.prevent="addNewWaypoint">
          <svg
            width="24"
            height="50"
            viewBox="0 0 24 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="25" r="12" fill="#D9D9D9" />
            <path d="M12 50L12 30" stroke="#D9D9D9" stroke-width="4" stroke-dasharray="4 4" />
            <path
              d="M12 20L12 8.9407e-07"
              stroke="#D9D9D9"
              stroke-width="4"
              stroke-dasharray="4 4"
            />
            <path
              d="M12 20V30"
              stroke="black"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M7 25H17"
              stroke="black"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
        <BaseSearchInput
          type="text"
          label="Dokąd jedziemy?"
          id="destination"
          query="destination"
          placeholder="TAURON Arena Kraków"
          v-model="destination"
        />
      </div>
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
      <BaseCheckbox id="withChildren" v-model="withChildren">Jadę z dzieckiem</BaseCheckbox>
      <BaseCheckbox id="nationalRoads" v-model="avoidNationalRoads"
        >Omiń drogi krajowe</BaseCheckbox
      >
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
const additionalWaypoints = ref<string[]>([])
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

const addNewWaypoint = () => {
  additionalWaypoints.value = [...additionalWaypoints.value, '']
}

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

    const additionalWaypointsData = []

    for (const waypoint of additionalWaypoints.value) {
      const res = await getPointData(waypoint)
      additionalWaypointsData.push({ x: res[0].x, y: res[0].y })
    }

    const destinationData = { x: destinationResponse[0].x, y: destinationResponse[0].y }
    if (!startingPointData || !destinationData) {
      throw new Error('No data')
    }

    locationStore.update(startingPointData, destinationData)
    void router.push(ROUTING_URLS.MAP)

    console.log(additionalWaypointsData)
    console.log(startingPointData)
    console.log(destinationData)
    console.log('Kamil działaj :)')

    // TODO - Send data to backend
  } catch (error) {
    console.error(error)
  }
}
</script>
