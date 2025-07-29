<template>
  <div class="text-center">
    <div class="max-w-md mx-auto">
      <div class="mb-8">
        <svg class="mx-auto w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
      </div>
      
      <h1 class="text-4xl font-bold text-gray-900 mb-4">404</h1>
      <h2 class="text-xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
      <p class="text-gray-600 mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      
      <div class="space-y-3">
        <router-link 
          to="/" 
          class="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
        >
          Go Home
        </router-link>
        <div>
          <router-link 
            to="/text-tools" 
            class="text-primary-600 hover:text-primary-500 text-sm"
          >
            Or visit Text Tools
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 404 Not Found page
</script>