<template>
  <div :class="['loading-spinner', `loading-spinner--${size}`, `loading-spinner--${variant}`]">
    <div class="loading-spinner__circle"></div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'primary' | 'secondary' | 'white'
}

withDefaults(defineProps<Props>(), {
  size: 'md',
  variant: 'primary'
})
</script>

<style scoped>
.loading-spinner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.loading-spinner__circle {
  border-radius: 50%;
  border-style: solid;
  animation: spin 0.8s linear infinite;
}

/* Sizes */
.loading-spinner--sm .loading-spinner__circle {
  width: 1rem;
  height: 1rem;
  border-width: 2px;
}

.loading-spinner--md .loading-spinner__circle {
  width: 2rem;
  height: 2rem;
  border-width: 3px;
}

.loading-spinner--lg .loading-spinner__circle {
  width: 3rem;
  height: 3rem;
  border-width: 4px;
}

.loading-spinner--xl .loading-spinner__circle {
  width: 4rem;
  height: 4rem;
  border-width: 5px;
}

/* Variants */
.loading-spinner--primary .loading-spinner__circle {
  border-color: rgba(124, 58, 237, 0.2);
  border-top-color: hsl(250, 75%, 55%);
}

.loading-spinner--secondary .loading-spinner__circle {
  border-color: rgba(6, 182, 212, 0.2);
  border-top-color: hsl(180, 75%, 50%);
}

.loading-spinner--white .loading-spinner__circle {
  border-color: rgba(255, 255, 255, 0.2);
  border-top-color: white;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
