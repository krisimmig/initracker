<template>
  <v-alert
    v-if="!dismissed"
    type="info"
    variant="tonal"
    density="compact"
    closable
    class="mb-3"
    @click:close="dismiss"
  >
    <div class="d-flex align-center flex-wrap ga-2">
      <span>You're in <strong>demo mode</strong>. Everything here is interactive — try it out!</span>
      <v-btn
        size="small"
        variant="flat"
        color="primary"
        :to="{ name: 'login' }"
      >
        Sign up to create your own
      </v-btn>
    </div>
  </v-alert>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const STORAGE_KEY = 'yait_demo_banner_dismissed'
const dismissed = ref(sessionStorage.getItem(STORAGE_KEY) === 'true')

function dismiss() {
  dismissed.value = true
  sessionStorage.setItem(STORAGE_KEY, 'true')
}
</script>
