<template>
  <div class="p-6">
    <form class="flex flex-col gap-4">
      <BaseSearchInput
        type="text"
        label="Skąd jedziemy?"
        id="startingPoint"
        placeholder="Kraków Główny"
        v-model="startingPoint"
      />
      <BaseSearchInput
        type="text"
        label="Dokąd jedziemy?"
        id="destination"
        placeholder="TAURON Arena Kraków"
        v-model="destination"
      />
      <BaseButton type="submit" @click.prevent="handleSearchForm"
        >Znajdź najlepszą trasę</BaseButton
      >
    </form>
  </div>
</template>
<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import BaseSearchInput from '@/components/BaseSearchInput.vue'
import { getPointData } from '@/helpers/getPointData'
import { ref } from 'vue'

const startingPoint = ref('')
const destination = ref('')

const handleSearchForm = async () => {
  const startingPointData = await getPointData(startingPoint.value)
  const destinationData = await getPointData(destination.value)
  console.log(startingPointData)
  console.log(destinationData)
  console.log('Kamil działaj :)')
}
</script>
