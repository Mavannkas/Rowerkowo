<template>
  <section class="h-full bg-gray-50">
    <div
      class="mx-auto flex h-full flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0"
    >
      <a href="#" class="mb-6 flex items-center text-2xl font-semibold text-gray-900">
        <img
          class="mr-2 h-8 w-8"
          src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
          alt="logo"
        />
        Rowerkowo
      </a>
      <div class="w-full rounded-lg bg-white shadow sm:max-w-md md:mt-0 xl:p-0">
        <div class="space-y-4 p-6 sm:p-8 md:space-y-6">
          <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
            Create an account
          </h1>
          <form class="space-y-4 md:space-y-6" @submit.prevent="handleRegister">
            <BaseFormInput
              label="Your email"
              type="email"
              id="email"
              autocomplete="email"
              placeholder="name@company.com"
              required
              v-model="email"
            />
            <BaseFormInput
              label="Password"
              type="password"
              id="password"
              autocomplete="new-password"
              placeholder="••••••••"
              required
              :error-state="!passwordMatch"
              v-model="password"
            />
            <BaseFormInput
              label="Confirm password"
              type="password"
              id="confirm-password"
              autocomplete="new-password"
              placeholder="••••••••"
              required
              :error-state="!passwordMatch"
              v-model="confirmPassword"
            />
            <p v-if="!passwordMatch" class="mt-1 text-sm text-red-600 dark:text-red-500">
              Passwords do not match!
            </p>
            <p
              v-if="registerMutation.isError.value"
              class="mt-1 text-sm text-red-600 dark:text-red-500"
            >
              An unknown error occured. See details in the console.
            </p>
            <BaseSpinner v-if="registerMutation.isPending.value" />
            <BaseButton
              v-else
              type="submit"
              class="w-full bg-primary-600 px-5 py-2.5 hover:bg-primary-700"
            >
              Create an account
            </BaseButton>

            <p class="text-sm font-light text-gray-500">
              Already have an account?
              <RouterLink
                :to="ROUTING_URLS.LOGIN"
                class="font-medium text-primary-600 hover:underline"
                >Login here</RouterLink
              >
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { ROUTING_URLS } from '@/router/index.js'
import { useMutation } from '@tanstack/vue-query'
import axios from 'axios'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import BaseButton from '@/components/BaseButton.vue'
import BaseSpinner from '@/components/BaseSpinner.vue'
import BaseFormInput from '@/components/BaseFormInput.vue'

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const passwordMatch = computed(() => password.value === confirmPassword.value)
const router = useRouter()

const registerMutation = useMutation({
  mutationFn: async () => {
    const response = await axios.post('http://localhost:3011/users', {
      username: email.value,
      password: password.value
    })
    return response.data
  },
  onSuccess: () => {
    email.value = ''
    password.value = ''
    confirmPassword.value = ''
    router.push(ROUTING_URLS.LOGIN)
  },
  onError: (error) => {
    if (axios.isAxiosError(error)) {
      console.log(
        `An unknown error occured: ${error.response?.status}, Message: ${error.response?.data.message}`
      )
    } else {
      console.log(`An unknown error occured: ${error.name}, Message: ${error.message}`)
    }
  }
})

const handleRegister = () => {
  if (!passwordMatch.value) {
    return
  }
  registerMutation.mutate()
}
</script>
