<template>
  <svg 
    :viewBox="viewBox" 
    :width="width" 
    :height="height" 
    xmlns="http://www.w3.org/2000/svg"
    :class="className"
  >
    <defs>
      <linearGradient :id="toolsGradientId" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#6366f1;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
      </linearGradient>
      <linearGradient :id="textGradientId" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#6366f1;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
      </linearGradient>
    </defs>
    <circle cx="30" cy="30" r="22" :fill="`url(#${toolsGradientId})`" opacity="0.1" />
    <g transform="translate(30, 30)">
      <path 
        d="M-8 -12 L-6 -14 L6 -2 L8 -4 L10 -2 L8 0 L6 2 L4 0 L-8 -12 Z" 
        :fill="`url(#${toolsGradientId})`"
        opacity="0.8" 
      />
      <circle 
        cx="6" 
        cy="6" 
        r="8" 
        fill="none" 
        :stroke="`url(#${toolsGradientId})`" 
        stroke-width="2" 
        opacity="0.6" 
      />
      <circle 
        cx="6" 
        cy="6" 
        r="4" 
        :fill="`url(#${toolsGradientId})`" 
        opacity="0.4" 
      />
      <g :stroke="`url(#${toolsGradientId})`" stroke-width="1.5" opacity="0.7">
        <line x1="6" y1="-2" x2="6" y2="0" />
        <line x1="14" y1="6" x2="12" y2="6" />
        <line x1="6" y1="14" x2="6" y2="12" />
        <line x1="-2" y1="6" x2="0" y2="6" />
      </g>
      <path 
        d="M-12 -6 L-16 -2 L-12 2" 
        fill="none" 
        :stroke="`url(#${toolsGradientId})`" 
        stroke-width="2"
        opacity="0.6" 
      />
      <path 
        d="M12 -6 L16 -2 L12 2" 
        fill="none" 
        :stroke="`url(#${toolsGradientId})`" 
        stroke-width="2"
        opacity="0.6" 
      />
    </g>
    <text 
      x="65" 
      y="38" 
      font-family="Poppins, sans-serif" 
      :font-size="fontSize" 
      font-weight="700"
      :fill="`url(#${textGradientId})`"
    >
      NiftyTools
    </text>
    <circle cx="170" cy="15" r="2" fill="#6366f1" opacity="0.3" />
    <circle cx="180" cy="20" r="1.5" fill="#8b5cf6" opacity="0.4" />
    <circle cx="175" cy="30" r="1" fill="#6366f1" opacity="0.2" />
  </svg>
</template>

<script setup lang="ts">
interface Props {
  width?: string | number
  height?: string | number
  fontSize?: string
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: 200,
  height: 60,
  fontSize: '1.5rem',
  className: ''
})

// Use props to avoid linting error
const { width, height, fontSize, className } = props

// Generate unique gradient IDs to avoid conflicts
const toolsGradientId = `toolsGradient-${Math.random().toString(36).substr(2, 9)}`
const textGradientId = `textGradient-${Math.random().toString(36).substr(2, 9)}`
const viewBox = "0 0 200 60"
</script>