<template>
  <button
    :disabled="disabled || loading"
    :class="buttonClasses"
    @click="$emit('click', $event)"
  >
    <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ButtonProps } from '../types'

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false
})

defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClasses = computed(() => {
  const base = 'btn-text inline-flex items-center justify-center rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary to-accent-indigo text-white hover:shadow-lg hover:-translate-y-0.5 focus:ring-primary/30 shadow-md',
    secondary: 'bg-neutral-600 text-white hover:bg-neutral-700 focus:ring-neutral-500 shadow-sm',
    outline: 'border border-border text-text-primary bg-background-card hover:bg-neutral-50 focus:ring-primary/30 shadow-sm',
    ghost: 'text-text-primary hover:bg-neutral-100 focus:ring-primary/30'
  }
  
  const sizes = {
    sm: 'px-md py-sm text-sm h-8',
    md: 'px-lg py-md text-sm h-10',
    lg: 'px-xl py-lg text-base h-12'
  }
  
  return `${base} ${variants[props.variant]} ${sizes[props.size]}`
})
</script>