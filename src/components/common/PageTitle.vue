<template>
  <div class="py-3">
    <div class="d-flex align-center gap-3">
      <v-icon v-if="icon" :icon="icon" size="x-large" color="secondary" />
      <h1 class="text-h4 text-md-h2 mb-0 ml-4">{{ title }}</h1>
    </div>
    <p class="text-subtitle-1" v-if="subtitle">{{ subtitle }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  icon?: string
}>()
</script>
