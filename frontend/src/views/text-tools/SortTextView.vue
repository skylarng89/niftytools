<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="text-center py-8 mb-8">
      <h1 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Sort Text</span>
      </h1>
      <p class="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
        Sort lines of text using various algorithms and export the results
      </p>
    </div>

    <!-- Main Interface -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Input Section -->
      <div class="space-y-4">
        <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Input</h3>

          <!-- File Upload / Text Input Toggle -->
          <div class="mb-4">
            <div class="flex rounded-lg border border-gray-300 p-1">
              <button
                @click="inputMethod = 'text'"
                :class="[
                  'flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors cursor-pointer',
                  inputMethod === 'text'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                    : 'text-gray-700 hover:text-gray-900',
                ]"
              >
                Text Input
              </button>
              <button
                @click="inputMethod = 'file'"
                :class="[
                  'flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors cursor-pointer',
                  inputMethod === 'file'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                    : 'text-gray-700 hover:text-gray-900',
                ]"
              >
                File Upload
              </button>
            </div>
          </div>

          <!-- Text Input Area -->
          <div v-if="inputMethod === 'text'" class="space-y-4">
            <textarea
              v-model="inputText"
              placeholder="Enter text to sort (one item per line)..."
              class="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all duration-200"
            ></textarea>
          </div>

          <!-- File Upload Area -->
          <div v-else class="space-y-4">
            <div
              @drop="handleFileDrop"
              @dragover.prevent
              @dragenter.prevent
              class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors"
            >
              <svg
                class="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <div class="mt-4">
                <label class="cursor-pointer">
                  <span class="text-indigo-600 hover:text-indigo-500 font-medium">Upload a file</span>
                  <span class="text-gray-500"> or drag and drop</span>
                  <input
                    ref="fileInput"
                    type="file"
                    @change="handleFileSelect"
                    accept=".txt,.csv"
                    class="sr-only"
                  />
                </label>
              </div>
              <p class="text-xs text-gray-500 mt-2">TXT, CSV up to 1MB</p>
              <div v-if="fileName" class="mt-4 text-sm text-gray-600">
                <strong>Uploaded:</strong> {{ fileName }}
              </div>
            </div>
          </div>

          <!-- Sorting Options -->
          <div class="space-y-4 mt-6">
            <h4 class="text-md font-medium text-gray-900">Sorting Method</h4>
            <select
              v-model="sortMethod"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            >
              <option value="alphabetical-asc">Alphabetical (A-Z)</option>
              <option value="alphabetical-desc">Alphabetical (Z-A)</option>
              <option value="natural-asc">Natural (A-Z)</option>
              <option value="natural-desc">Natural (Z-A)</option>
              <option value="length-asc">Length (Short to Long)</option>
              <option value="length-desc">Length (Long to Short)</option>
              <option value="reverse">Reverse Order</option>
              <option value="shuffle">Random Shuffle</option>
            </select>

            <!-- Processing Options -->
            <div class="space-y-2">
              <h4 class="text-md font-medium text-gray-900">Options</h4>
              <label class="flex items-center">
                <input
                  v-model="options.caseSensitive"
                  type="checkbox"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span class="ml-2 text-sm text-gray-700">Case sensitive</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="options.removeEmpty"
                  type="checkbox"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span class="ml-2 text-sm text-gray-700">Remove empty lines</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="options.removeDuplicates"
                  type="checkbox"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span class="ml-2 text-sm text-gray-700">Remove duplicates</span>
              </label>
            </div>

            <!-- Action Buttons -->
            <div class="flex space-x-3 pt-4">
              <button
                @click="sortText"
                :disabled="!inputText || isLoading"
                class="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
              >
                {{ isLoading ? 'Sorting...' : 'Sort Text' }}
              </button>
              <button
                @click="resetAll"
                class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer transition-all duration-200 font-medium"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Output Section -->
      <div class="space-y-4">
        <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">Output</h3>
            <div v-if="outputText" class="flex space-x-2">
              <button
                @click="copyToClipboard"
                class="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors font-medium"
              >
                Copy
              </button>
              <button
                @click="exportCsv"
                class="px-4 py-2 text-sm bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 cursor-pointer transition-colors font-medium"
              >
                Export CSV
              </button>
            </div>
          </div>

          <!-- Output Text Area -->
          <textarea
            v-model="outputText"
            readonly
            placeholder="Sorted text will appear here..."
            class="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 resize-none transition-all duration-200"
          ></textarea>

          <!-- Processing Stats -->
          <div v-if="stats" class="mt-4 text-sm text-gray-600 space-y-1">
            <div>Original lines: {{ stats.originalLines }}</div>
            <div>Processed lines: {{ stats.processedLines }}</div>
            <div>Processing time: {{ stats.processingTime }}ms</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

// Reactive state
const inputMethod = ref<'text' | 'file'>('text')
const inputText = ref('')
const outputText = ref('')
const sortMethod = ref('alphabetical-asc')
const fileName = ref('')
const isLoading = ref(false)
const stats = ref<any>(null)

const fileInput = ref<HTMLInputElement | null>(null)
const options = reactive({
  caseSensitive: false,
  removeEmpty: false,
  removeDuplicates: false,
})

// File handling
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    readFile(target.files[0])
  }
}

const handleFileDrop = (event: DragEvent) => {
  event.preventDefault()
  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    readFile(event.dataTransfer.files[0])
  }
}

const readFile = (file: File) => {
  const reader = new FileReader()
  reader.onload = e => {
    inputText.value = e.target?.result as string
    fileName.value = file.name
  }
  reader.readAsText(file)
}

// Text processing
const sortText = async () => {
  if (!inputText.value) return

  isLoading.value = true
  try {
    const response = await fetch('/api/text-tools/sort', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: inputText.value,
        method: sortMethod.value,
        options: options,
      }),
    })

    const result = await response.json()

    if (result.success) {
      outputText.value = result.data.processedText
      stats.value = result.data.stats
    } else {
      alert('Error: ' + result.error)
    }
  } catch (error) {
    alert('Error sorting text: ' + error)
  } finally {
    isLoading.value = false
  }
}

// Utility functions
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(outputText.value)
    // Could add a toast notification here
  } catch (error) {
    console.error('Failed to copy text:', error)
  }
}

const exportCsv = async () => {
  if (!outputText.value) return

  try {
    const response = await fetch('/api/text-tools/export/csv', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        originalText: inputText.value,
        processedText: outputText.value,
        method: sortMethod.value,
        format: 'simple',
      }),
    })

    if (response.ok) {
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `sorted-text-${sortMethod.value}-${Date.now()}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } else {
      alert('Error exporting CSV')
    }
  } catch (error) {
    alert('Error exporting CSV: ' + error)
  }
}

const resetAll = () => {
  inputText.value = ''
  outputText.value = ''
  fileName.value = ''
  stats.value = null
  options.caseSensitive = false
  options.removeEmpty = false
  options.removeDuplicates = false
  sortMethod.value = 'alphabetical-asc'
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
</script>
