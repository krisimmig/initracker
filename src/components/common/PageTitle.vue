<template>
  <div class="py-3">
    <h1 class="text-h4 text-md-h2 mb-0">{{ title }}</h1>
    <p class="text-subtitle-1" v-if="subtitle">{{ subtitle }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>
