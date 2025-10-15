<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex-shrink-0">
            <router-link to="/" class="flex items-center">
              <NiftyLogo />
            </router-link>
          </div>
          <nav class="hidden md:flex space-x-10">
            <router-link to="/text-tools" class="text-base font-medium text-gray-500 hover:text-gray-900">
              Text Tools
            </router-link>
            <router-link to="/about" class="text-base font-medium text-gray-500 hover:text-gray-900">
              About
            </router-link>
          </nav>
        </div>
      </div>
    </header>

    <main class="py-10">
      <router-view />
    </main>

    <footer class="bg-white">
      <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
        <div class="flex justify-center space-x-6 md:order-2">
          <p class="text-center text-base text-gray-400">
            Version {{ appVersion }}
          </p>
        </div>
        <div class="mt-8 md:mt-0 md:order-1">
          <p class="text-center text-base text-gray-400">
            &copy; {{ currentYear }} NiftyTools. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NiftyLogo from './components/NiftyLogo.vue'

const appVersion = ref('1.0.0')
const currentYear = new Date().getFullYear()
</script>