<template>
  <div class="relative">
    <label :for="id" class="mb-2 block text-sm font-medium text-gray-900">{{ label }}</label>
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
</template>

<script setup lang="ts">
import { getPointData } from '@/helpers/getPointData'
import { watchDebounced } from '@vueuse/core'
import type { SearchResult } from 'leaflet-geosearch/dist/providers/provider.js'
import type { RawResult } from 'leaflet-geosearch/dist/providers/openStreetMapProvider.js'

import { ref } from 'vue'

defineProps<{
  label: string
  type: string
  id: string
  placeholder: string
}>()

defineOptions({
  inheritAttrs: false
})

const input = defineModel<string>({ default: '' })
const inputVisible = ref<boolean>(false)
const results = ref<SearchResult<RawResult>[]>([])

watchDebounced(
  input,
  async () => {
    try {
      results.value = await getPointData(input.value)
    } catch (error) {
      console.error(error)
    }
  },
  { debounce: 500 }
)

const handleBlur = () => {
  setTimeout(() => {
    inputVisible.value = false
  }, 50)
}
const handleFocus = () => {
  inputVisible.value = true
}

const handleResultClick = (choosenLabel: string) => {
  console.log(choosenLabel)
  input.value = choosenLabel
  inputVisible.value = false
}
</script>
