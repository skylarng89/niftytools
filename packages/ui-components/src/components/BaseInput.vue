<template>
  <div>
    <input
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="inputClasses"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { InputProps } from '../types'

interface Props extends InputProps {
  modelValue?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false
})

defineEmits<{
  'update:modelValue': [value: string]
}>()

const inputClasses = computed(() => {
  const base = 'input-custom block w-full transition-all duration-200'
  const state = props.error 
    ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
    : 'border-border placeholder-text-muted focus:ring-primary/30 focus:border-primary'
  const disabled = props.disabled ? 'bg-neutral-100 text-text-muted cursor-not-allowed' : 'bg-background-input'
  
  return `${base} ${state} ${disabled}`
})
</script>