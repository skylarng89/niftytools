<template>
    <img src="/logo-text.svg" :alt="alt" :width="width" :height="height" :class="className" class="nifty-logo-text" />
</template>

<script setup lang="ts">
    interface Props {
        width?: string | number
        height?: string | number
        alt?: string
        className?: string
    }

    withDefaults(defineProps<Props>(), {
        width: 'auto',
        height: 32,
        alt: 'NiftyTools',
        className: ''
    })
</script>

<style scoped>
    .nifty-logo-text {
        display: block;
    }
</style>
