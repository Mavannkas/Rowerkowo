<template>
  <div class="relative">
    <label :for="id" class="mb-2 block text-sm font-medium text-gray-900">{{ label }}</label>
    <div class="relative mb-1">
      <input
        :type
        :name="id"
        :id
        class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-primary-600 focus:ring-primary-600"
        :placeholder="placeholder"
        @blur="handleBlur"
        @focus="handleFocus"
        :value="input"
        v-model="input"
      />
      <IconGeolocation
        v-if="geoInput"
        @click="handleGeoEmit"
        :class="isGeolocated ? 'text-primary-600' : ''"
      />
      <IconClose v-if="deletable" @click="handleCloseInput" />
      <ul
        v-if="inputVisible && results.length"
        class="absolute left-1/2 top-full z-10 w-full -translate-x-1/2 rounded-lg rounded-t-none border-2 border-t-0 border-gray-300 bg-white"
      >
        <li
          v-for="result of results"
          :key="result.raw.osm_id"
          @click="handleResultClick(result.label)"
          class="line-clamp-1 cursor-pointer border-b border-gray-300 p-2 leading-8"
        >
          {{ result.label }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getPointData } from '@/helpers/getPointData'
import { watchDebounced } from '@vueuse/core'
import type { SearchResult } from 'leaflet-geosearch/dist/providers/provider.js'
import type { RawResult } from 'leaflet-geosearch/dist/providers/openStreetMapProvider.js'

import { ref } from 'vue'
import IconGeolocation from './IconGeolocation.vue'
import { getGeolocationPermission } from '@/helpers/getGeolocationPermission'
import { getCurrentGeolocation } from '@/helpers/getCurrentGeolocation'
import IconClose from './IconClose.vue'

defineProps<{
  label?: string
  type: string
  id: string
  placeholder?: string
  geoInput?: boolean
  query?: string
  deletable?: boolean
}>()

defineOptions({
  inheritAttrs: false
})

const input = defineModel<string>({ default: '' })
const inputVisible = ref<boolean>(false)
const results = ref<SearchResult<RawResult>[]>([])
const emit = defineEmits(['geolocation', 'close'])
const isGeolocated = ref(false)

watchDebounced(
  input,
  async () => {
    try {
      results.value = await getPointData(input.value)
    } catch (error) {
      console.error(error)
    }
  },
  { debounce: 200 }
)

const handleGeoEmit = async () => {
  isGeolocated.value = !isGeolocated.value
  await getCurrentGeolocation()
  if (!isGeolocated.value) {
    const res = await getGeolocationPermission()
    if (res === 'denied') {
      isGeolocated.value = false
      return
    }
    if (res === 'prompt') {
      isGeolocated.value = false
      return
    }
  }
  input.value = isGeolocated.value ? 'Twoja lokalizacja' : ''
  emit('geolocation', isGeolocated.value)
}

const handleCloseInput = () => {
  emit('close')
}

const handleBlur = () => {
  setTimeout(() => {
    inputVisible.value = false
  }, 100)
}
const handleFocus = () => {
  inputVisible.value = true
  input.value = isGeolocated.value ? '' : input.value
  isGeolocated.value = false
  emit('geolocation', isGeolocated.value)
}

const handleResultClick = (choosenLabel: string) => {
  console.log(choosenLabel)
  input.value = choosenLabel
  inputVisible.value = false
}
</script>
