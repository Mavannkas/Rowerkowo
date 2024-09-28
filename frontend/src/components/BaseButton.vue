<template>
  <button
    :type="type"
    :class="[
      styling === 'outline' &&
        'rounded-lg border border-blue-700 px-5 py-2.5 text-center text-sm font-medium text-blue-700 transition-colors hover:bg-blue-800 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 dark:border-blue-500 dark:text-blue-500 dark:hover:bg-blue-500 dark:hover:text-white dark:focus:ring-blue-800',
      styling === 'solid' &&
        'rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
    ]"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
const { type = 'button', styling = 'solid' } = defineProps<{
  type?: 'button' | 'submit' | 'reset'
  styling?: 'solid' | 'outline'
}>()
</script>
