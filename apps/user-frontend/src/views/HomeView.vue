<template>
  <!-- Hero Section -->
  <div class="text-center py-10">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
        Welcome to
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">NiftyTools</span>
      </h1>
      <p class="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
        A curated collection of development utilities to streamline your workflow.
      </p>
    </div>
  </div>

  <!-- Main Content -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      <!-- Feature Card: Text Tools -->
      <div class="pt-6">
        <div class="flow-root bg-white rounded-lg px-6 pb-8 shadow-md">
          <div class="-mt-6">
            <div>
              <span class="inline-flex items-center justify-center p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-md shadow-lg">
                <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </span>
            </div>
            <h3 class="mt-8 text-lg font-medium text-gray-900 tracking-tight">Text Tools</h3>
            <p class="mt-5 text-base text-gray-500">
              Sort, format, and manipulate text with various algorithms. Supports file uploads and CSV exports.
            </p>
            <div class="mt-6">
              <router-link
                to="/text-tools"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
              >
                Explore Text Tools
                <svg class="ml-2 -mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Feature Card: More Tools Coming Soon -->
      <div class="pt-6">
        <div class="flow-root bg-gray-50 rounded-lg px-6 pb-8 border-2 border-dashed border-gray-300">
          <div class="-mt-6">
            <div>
              <span class="inline-flex items-center justify-center p-3 bg-gray-300 rounded-md shadow-md">
                <svg class="h-6 w-6 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </span>
            </div>
            <h3 class="mt-8 text-lg font-medium text-gray-900 tracking-tight">More Tools Coming Soon</h3>
            <p class="mt-5 text-base text-gray-500">
              Additional utilities are in active development and will be released soon.
            </p>
          </div>
        </div>
      </div>

      <!-- Feature Card: Request a Tool -->
      <div class="pt-6">
        <div class="flow-root bg-gray-50 rounded-lg px-6 pb-8 border-2 border-dashed border-gray-300">
          <div class="-mt-6">
            <div>
              <span class="inline-flex items-center justify-center p-3 bg-gray-300 rounded-md shadow-md">
                <svg class="h-6 w-6 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
            </div>
            <h3 class="mt-8 text-lg font-medium text-gray-900 tracking-tight">Request a Tool</h3>
            <p class="mt-5 text-base text-gray-500">
              Have an idea for a new tool? We'd love to hear from you.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Why NiftyTools Section -->
    <div class="mt-20">
      <div class="lg:text-center">
        <h2 class="text-base text-indigo-600 font-semibold tracking-wide uppercase">Why NiftyTools?</h2>
        <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          A Better Way to Work with Developer Utilities
        </p>
        <p class="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
          We focus on what matters: performance, privacy, and simplicity.
        </p>
      </div>

      <div class="mt-10">
        <dl class="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
          <div class="relative">
            <dt>
              <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p class="ml-16 text-lg leading-6 font-medium text-gray-900">Fast</p>
            </dt>
            <dd class="mt-2 ml-16 text-base text-gray-500">
              Optimized for speed with efficient algorithms. No waiting, just results.
            </dd>
          </div>

          <div class="relative">
            <dt>
              <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <p class="ml-16 text-lg leading-6 font-medium text-gray-900">Private</p>
            </dt>
            <dd class="mt-2 ml-16 text-base text-gray-500">
              Your data stays on your machine. Nothing is ever sent to our servers.
            </dd>
          </div>

          <div class="relative">
            <dt>
              <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <p class="ml-16 text-lg leading-6 font-medium text-gray-900">Simple</p>
            </dt>
            <dd class="mt-2 ml-16 text-base text-gray-500">
              A clean and intuitive interface that's easy to use, with no unnecessary clutter.
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
// Home view component logic
</script>