<template>
  <svg 
    :viewBox="viewBox" 
    :width="size" 
    :height="size" 
    xmlns="http://www.w3.org/2000/svg"
    :class="className"
  >
    <defs>
      <linearGradient :id="gradientId" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#6366f1;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
      </linearGradient>
    </defs>
    <circle cx="30" cy="30" r="28" :fill="`url(#${gradientId})`" opacity="0.1"/>
    <g transform="translate(30, 30)">
      <path 
        d="M-10 -15 L-7.5 -17.5 L7.5 -2.5 L10 -5 L12.5 -2.5 L10 0 L7.5 2.5 L5 0 L-10 -15 Z" 
        :fill="`url(#${gradientId})`" 
        opacity="0.9"
      />
      <circle 
        cx="7.5" 
        cy="7.5" 
        r="10" 
        fill="none" 
        :stroke="`url(#${gradientId})`" 
        stroke-width="2.5" 
        opacity="0.7"
      />
      <circle 
        cx="7.5" 
        cy="7.5" 
        r="5" 
        :fill="`url(#${gradientId})`" 
        opacity="0.5"
      />
    </g>
  </svg>
</template>

<script setup lang="ts">
interface Props {
  size?: string | number
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 50,
  className: ''
})

// Use props to avoid linting error
const { size, className } = props

// Generate unique gradient ID to avoid conflicts
const gradientId = `toolsGradient-${Math.random().toString(36).substr(2, 9)}`
const viewBox = "0 0 60 60"
</script>