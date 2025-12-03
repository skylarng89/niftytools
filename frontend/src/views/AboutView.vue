<template>
  <div class="max-w-3xl mx-auto">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900">About NiftyTools</h1>
      <p class="mt-4 text-lg text-gray-600">
        A collection of useful development utilities built with modern web technologies
      </p>
    </div>

    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-6">
      <div>
        <h2 class="text-xl font-semibold text-gray-900 mb-3">What is NiftyTools?</h2>
        <p class="text-gray-600">
          NiftyTools is a web-based collection of development utilities designed to streamline common tasks. 
          Built with privacy and performance in mind, all processing happens locally in your browser.
        </p>
      </div>

      <div>
        <h2 class="text-xl font-semibold text-gray-900 mb-3">Features</h2>
        <ul class="text-gray-600 space-y-2">
          <li class="flex items-start">
            <svg class="w-5 h-5 text-green-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
            <span>Privacy-focused: All processing happens locally</span>
          </li>
          <li class="flex items-start">
            <svg class="w-5 h-5 text-green-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
            <span>Fast and responsive interface</span>
          </li>
          <li class="flex items-start">
            <svg class="w-5 h-5 text-green-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
            <span>No registration or sign-up required</span>
          </li>
          <li class="flex items-start">
            <svg class="w-5 h-5 text-green-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
            <span>Open source and extensible</span>
          </li>
        </ul>
      </div>

      <div>
        <h2 class="text-xl font-semibold text-gray-900 mb-3">Technology Stack</h2>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <h3 class="font-medium text-gray-900 mb-2">Frontend</h3>
            <ul class="text-gray-600 space-y-1">
              <li>• Vue.js 3</li>
              <li>• TypeScript</li>
              <li>• Tailwind CSS</li>
              <li>• Vite</li>
            </ul>
          </div>
          <div>
            <h3 class="font-medium text-gray-900 mb-2">Backend</h3>
            <ul class="text-gray-600 space-y-1">
              <li>• FastAPI (Python)</li>
              <li>• Express.js (Gateway)</li>
              <li>• Docker</li>
              <li>• OpenAPI/Swagger</li>
            </ul>
          </div>
        </div>
      </div>

      <div>
        <h2 class="text-xl font-semibold text-gray-900 mb-3">Version</h2>
        <p class="text-gray-600">
          Current version: <span class="font-mono bg-gray-100 px-2 py-1 rounded">{{ appVersion }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Version
const appVersion = computed(() => '1.0.0')
</script>