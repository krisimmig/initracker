<template>
  <div class="mb-4">
    <div class="d-flex align-center ga-3">
      <v-icon v-if="icon" :icon="icon" size="small" color="primary" />
      <h1 class="text-h6 font-weight-bold mb-0">{{ title }}</h1>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  icon?: string
}>()
</script>
