<template>
  <img src="/logo-icon.svg" :alt="alt" :width="width" :height="height" :class="className" class="nifty-logo-icon" />
</template>

<script setup lang="ts">
  interface Props {
    width?: string | number
    height?: string | number
    alt?: string
    className?: string
  }

  withDefaults(defineProps<Props>(), {
    width: 32,
    height: 32,
    alt: 'NiftyTools Icon',
    className: ''
  })
</script>

<style scoped>
  .nifty-logo-icon {
    display: block;
  }
</style>