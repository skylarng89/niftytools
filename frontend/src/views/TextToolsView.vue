<template>
  <div>
    <!-- Text Tools Navigation -->
    <div class="mb-6">
      <nav class="flex space-x-1 bg-gray-100 p-1 rounded-lg justify-center">
        <router-link
          to="/text-tools"
          exact-active-class="bg-white text-gray-900 shadow-sm"
          class="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 rounded-md transition-colors"
        >
          Overview
        </router-link>
        <router-link
          to="/text-tools/sort"
          active-class="bg-white text-gray-900 shadow-sm"
          class="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 rounded-md transition-colors"
        >
          Sort Text
        </router-link>
      </nav>
    </div>

    <!-- Router Content -->
    <router-view />
  </div>
</template>

<script setup lang="ts">
// Text tools layout component
</script>