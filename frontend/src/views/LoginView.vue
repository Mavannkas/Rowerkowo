<template>
  <section class="bg-gray-50">
    <div class="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
      <a href="#" class="mb-6 flex items-center text-2xl font-semibold text-gray-900">
        <img
          class="mr-2 h-8 w-8"
          src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
          alt="logo"
        />
        Flowbite
      </a>
      <div class="w-full rounded-lg bg-white shadow sm:max-w-md md:mt-0 xl:p-0">
        <div class="space-y-4 p-6 sm:p-8 md:space-y-6">
          <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
            Sign in to your account
          </h1>
          <form class="space-y-4 md:space-y-6" @submit.prevent="handleLogin">
            <BaseFormInput
              label="Your email"
              type="email"
              name="email"
              id="email"
              v-model="email"
              autocomplete="email"
              :error-state="loginMutation.isError.value"
              placeholder="name@company.com"
              required
            />
            <BaseFormInput
              label="Password"
              type="password"
              v-model="password"
              id="password"
              autocomplete="current-password"
              placeholder="••••••••"
              :error-state="loginMutation.isError.value"
              required
            />
            <p
              v-if="loginMutation.isError.value"
              class="mt-1 text-sm text-red-600 dark:text-red-500"
            >
              Invalid email or password
            </p>
            <div class="flex items-center justify-between">
              <a href="#" class="text-sm font-medium text-primary-600 hover:underline"
                >Forgot password?</a
              >
            </div>
            <BaseSpinner v-if="loginMutation.isPending.value" />
            <BaseButton
              v-else
              type="submit"
              class="w-full bg-primary-600 px-5 py-2.5 hover:bg-primary-700"
            >
              Sign in
            </BaseButton>
            <p class="text-sm font-light text-gray-500">
              Don’t have an account yet?
              <RouterLink
                :to="ROUTING_URLS.REGISTER"
                class="font-medium text-primary-600 hover:underline"
                >Sign up</RouterLink
              >
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { ROUTING_URLS } from '@/router'
import { ref } from 'vue'
import { useMutation } from '@tanstack/vue-query'
import axios from 'axios'

import BaseFormInput from '@/components/BaseFormInput.vue'
import BaseSpinner from '@/components/BaseSpinner.vue'
import BaseButton from '@/components/BaseButton.vue'

const authStore = useAuthStore()
const router = useRouter()
const email = ref('')
const password = ref('')
const loginMutation = useMutation({
  mutationFn: async ({ email, password }: { email: string; password: string }) => {
    const response = await axios.post<{ access_token: string }>(
      'http://localhost:3011/auth/login',
      {
        username: email,
        password: password
      }
    )
    return response.data
  },
  onError: (error) => {
    if (axios.isAxiosError(error) && error.status === 401) {
      password.value = ''
      email.value = ''
    } else if (axios.isAxiosError(error)) {
      console.log(
        `An unknown error occured: ${error.response?.status}, Message: ${error.response?.data.message}`
      )
    } else {
      console.log(`An unknown error occured: ${error.name}, Message: ${error.message}`)
    }
  },
  onSuccess: (data) => {
    console.log(data)
    authStore.login({ access_token: data.access_token })
    router.push(ROUTING_URLS.MAIN)
  }
})

const handleLogin = () => {
  loginMutation.mutate({ email: email.value, password: password.value })
}
</script>
