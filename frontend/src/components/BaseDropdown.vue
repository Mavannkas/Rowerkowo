<template>
  <div class="relative">
    <button
      @click="isOpen = !isOpen"
      id="dropdownDefaultButton"
      data-dropdown-toggle=" dropdown"
      class="inline-flex w-full items-center rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      type="button"
    >
      {{ activeOption || placeholder }}
      <svg
        class="ms-auto h-2.5 w-2.5"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 10 6"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="m1 1 4 4 4-4"
        />
      </svg>
    </button>

    <!-- Dropdown menu -->
    <div
      id="dropdown"
      class="absolute top-full z-10 w-full divide-y divide-gray-100 rounded-lg bg-white shadow dark:bg-gray-700"
      :class="isOpen ? 'block' : 'hidden'"
    >
      <ul
        class="py-2 text-sm text-gray-700 dark:text-gray-200"
        aria-labelledby="dropdownDefaultButton"
      >
        <li
          v-bind:key="option.value"
          v-for="option of options"
          @click="handleDropdownClick(option)"
        >
          <p
            class="block cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
          >
            {{ option.label }}
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

type Option = { label: string; value: string }

const emit = defineEmits(['update:modelValue'])

const handleDropdownClick = (option: Option) => {
  activeOption.value = option.label
  emit('update:modelValue', option.value)
  isOpen.value = !isOpen.value
}

defineProps<{
  placeholder: string
  options: { label: string; value: string }[]
}>()
const activeOption = ref<string>()
const isOpen = ref(false)
</script>
