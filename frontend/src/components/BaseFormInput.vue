<template>
  <div>
    <label v-if="label" :for="id" class="mb-2 block text-sm font-medium text-gray-900">{{
      label
    }}</label>
    <input
      :type
      :name="id"
      :id
      class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-primary-600 focus:ring-primary-600"
      :class="
        errorState &&
        'block w-full rounded-lg border border-red-500 bg-red-50 p-2.5 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:bg-gray-700 dark:text-red-500 dark:placeholder-red-500'
      "
      :placeholder="placeholder"
      v-bind="$attrs"
      v-model="model"
    />
    <p v-if="errorState && errorMessage" class="mt-2 text-sm text-red-600 dark:text-red-500">
      <span class="font-medium">{{ errorMessage }}</span>
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label?: string
  type: string
  id: string
  placeholder: string
  errorState?: boolean
  errorMessage?: string
}>()

const model = defineModel()

defineOptions({
  inheritAttrs: false
})
</script>
