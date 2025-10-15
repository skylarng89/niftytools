<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="text-center py-8 mb-8">
      <h1 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Text Tools</span>
      </h1>
      <p class="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
        Powerful text processing utilities for developers and content creators
      </p>
    </div>

    <!-- Overview Content -->
    <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
      <h2 class="text-2xl font-semibold text-gray-900 mb-6">Available Tools</h2>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Sort Text Tool -->
        <router-link 
          to="/text-tools/sort" 
          class="block p-6 border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-lg transition-all duration-200 bg-white hover:bg-gray-50"
        >
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"/>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-xl font-semibold text-gray-900">Sort Text</h3>
              <p class="mt-2 text-base text-gray-600">
                Sort lines of text using various algorithms: alphabetical, natural, length-based, reverse, or shuffle.
              </p>
              <div class="mt-3 flex flex-wrap gap-2">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  8 sorting methods
                </span>
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  File upload
                </span>
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  CSV export
                </span>
              </div>
            </div>
          </div>
        </router-link>

        <!-- Coming Soon Cards -->
        <div class="p-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-xl font-semibold text-gray-500">More Tools Coming</h3>
              <p class="mt-2 text-base text-gray-400">
                Additional text processing utilities are in development
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Usage Stats or Tips -->
    <div class="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-8">
      <div class="flex items-center mb-4">
        <div class="flex-shrink-0">
          <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h3 class="ml-3 text-xl font-semibold text-indigo-900">Quick Tips</h3>
      </div>
      <ul class="text-base text-indigo-800 space-y-2">
        <li class="flex items-start">
          <span class="text-indigo-600 mr-2">•</span>
          <span>Upload text files directly or paste content into the text area</span>
        </li>
        <li class="flex items-start">
          <span class="text-indigo-600 mr-2">•</span>
          <span>All processing happens locally - your data never leaves your browser</span>
        </li>
        <li class="flex items-start">
          <span class="text-indigo-600 mr-2">•</span>
          <span>Export results as plain text or CSV format</span>
        </li>
        <li class="flex items-start">
          <span class="text-indigo-600 mr-2">•</span>
          <span>Use natural sorting for human-friendly ordering (e.g., file1.txt, file2.txt, file10.txt)</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
// Text tools index component
</script>