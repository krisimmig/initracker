<template>
  <div>
    <div @click="isCollapsed = !isCollapsed">
      <slot name="title"></slot>
    </div>

    <div v-if="!isCollapsed">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isCollapsed = ref(true)
</script>
