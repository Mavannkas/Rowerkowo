<template>
  <main class="container mx-auto flex flex-col text-black">
    <h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
      OUDAB
    </h1>
    <p class="mb-6 text-lg font-normal text-gray-500 lg:text-xl">
      OUDAB is a platform for developers to share and grow their knowledge.
    </p>
    <BaseButton class="flex items-center justify-center">
      Learn more
      <svg
        class="ms-2 h-3.5 w-3.5 rtl:rotate-180"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 14 10"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M1 5h12m0 0L9 1m4 4L9 9"
        />
      </svg>
    </BaseButton>
  </main>
</template>
<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
</script>
