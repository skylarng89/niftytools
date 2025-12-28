<template>
  <div 
    :class="[
      'glass-card',
      `glass-card--${variant}`,
      `glass-card--${padding}`,
      {
        'glass-card--hoverable': hoverable,
        'glass-card--clickable': clickable
      }
    ]"
    @click="handleClick"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'default' | 'elevated' | 'subtle'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  hoverable?: boolean
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  padding: 'md',
  hoverable: false,
  clickable: false
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

function handleClick(event: MouseEvent) {
  if (props.clickable) {
    emit('click', event)
  }
}
</script>

<style scoped>
.glass-card {
  border-radius: var(--radius-xl);
  transition: all var(--transition-base);
}

.glass-card--default {
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
}

.glass-card--elevated {
  background: hsla(240, 10%, 20%, 0.8);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid hsla(240, 5%, 96%, 0.15);
  box-shadow: 
    0 8px 32px 0 rgba(0, 0, 0, 0.37),
    0 0 0 1px hsla(240, 5%, 96%, 0.05) inset;
}

.glass-card--subtle {
  background: hsla(240, 10%, 16%, 0.5);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid hsla(240, 5%, 96%, 0.08);
}

.glass-card--none {
  padding: 0;
}

.glass-card--sm {
  padding: var(--spacing-sm);
}

.glass-card--md {
  padding: var(--spacing-md);
}

.glass-card--lg {
  padding: var(--spacing-lg);
}

.glass-card--xl {
  padding: var(--spacing-xl);
}

.glass-card--hoverable:hover {
  transform: translateY(-4px);
  box-shadow: 
    var(--glass-shadow),
    0 0 20px rgba(124, 58, 237, 0.3);
}

.glass-card--clickable {
  cursor: pointer;
}
</style>
