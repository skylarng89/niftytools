<template>
  <button
    :class="[
      'gradient-button',
      `gradient-button--${variant}`,
      `gradient-button--${size}`,
      {
        'gradient-button--loading': loading,
        'gradient-button--disabled': disabled,
        'gradient-button--icon-only': iconOnly
      }
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="gradient-button__spinner"></span>
    <span v-if="icon && !loading" class="gradient-button__icon">
      <slot name="icon">{{ icon }}</slot>
    </span>
    <span v-if="!iconOnly" class="gradient-button__text">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  icon?: string
  iconOnly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  icon: '',
  iconOnly: false
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

function handleClick(event: MouseEvent) {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped>
.gradient-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
  border: none;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-base);
  overflow: hidden;
  font-family: var(--font-sans);
}

.gradient-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  transition: opacity var(--transition-base);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
}

.gradient-button:hover::before {
  opacity: 1;
}

.gradient-button:active {
  transform: scale(0.98);
}

/* Variants */
.gradient-button--primary {
  background: var(--gradient-primary);
  color: white;
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
}

.gradient-button--primary:hover {
  box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
  transform: translateY(-2px);
}

.gradient-button--secondary {
  background: var(--gradient-secondary);
  color: white;
  box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
}

.gradient-button--secondary:hover {
  box-shadow: 0 6px 20px rgba(6, 182, 212, 0.4);
  transform: translateY(-2px);
}

.gradient-button--success {
  background: var(--gradient-success);
  color: white;
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

.gradient-button--success:hover {
  box-shadow: 0 6px 20px rgba(34, 197, 94, 0.4);
  transform: translateY(-2px);
}

.gradient-button--danger {
  background: var(--gradient-danger);
  color: white;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.gradient-button--danger:hover {
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
  transform: translateY(-2px);
}

.gradient-button--outline {
  background: transparent;
  color: var(--color-dark-text);
  border: 2px solid var(--color-dark-border);
  box-shadow: none;
}

.gradient-button--outline:hover {
  border-color: var(--color-primary-500);
  background: hsla(250, 75%, 55%, 0.1);
}

/* Sizes */
.gradient-button--sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.gradient-button--md {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
}

.gradient-button--lg {
  padding: 1rem 2rem;
  font-size: 1.125rem;
}

.gradient-button--icon-only.gradient-button--sm {
  padding: 0.5rem;
}

.gradient-button--icon-only.gradient-button--md {
  padding: 0.75rem;
}

.gradient-button--icon-only.gradient-button--lg {
  padding: 1rem;
}

/* States */
.gradient-button--loading,
.gradient-button--disabled {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}

.gradient-button--loading .gradient-button__text {
  opacity: 0.5;
}

/* Spinner */
.gradient-button__spinner {
  width: 1em;
  height: 1em;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.gradient-button__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2em;
}

.gradient-button__text {
  position: relative;
  z-index: 1;
}
</style>
