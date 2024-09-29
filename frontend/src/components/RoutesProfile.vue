<template>
  <div class="py-3 sm:py-4">
    <div class="flex items-center">
      <div class="flex-shrink-0">
        <img
          class="h-8 w-8 rounded-full"
          :src="`https://avatar.iran.liara.run/public/boy?username=${createdBy}`"
          alt="Neil image"
        />
      </div>
      <div class="ms-4 min-w-0 flex-1">
        <p class="truncate text-sm font-medium text-gray-900 dark:text-white">{{ createdBy }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  createdBy: string
}>()
</script>
