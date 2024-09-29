<template>
  <div class="flex items-center rounded border border-gray-200 ps-4 dark:border-gray-700">
    <input
      :id
      type="checkbox"
      name="bordered-checkbox"
      class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
      v-model="model"
    />
    <label :for="id" class="ms-2 w-full py-4 text-sm font-medium text-gray-900 dark:text-gray-300"
      ><slot></slot
    ></label>
  </div>
</template>

<script setup lang="ts">
const model = defineModel<boolean>()
defineProps<{ id: string }>()
</script>
