<template>
  <img src="/logo-full.svg" alt="NiftyTools" :style="{ height: height + 'px', width: 'auto' }"
    class="nifty-logo-full" />
</template>

<script setup lang="ts">
  interface Props {
    height?: number
  }

  withDefaults(defineProps<Props>(), {
    height: 40
  })
</script>

<style scoped>
  .nifty-logo-full {
    display: block;
    max-width: 100%;
    height: auto;
  }
</style>