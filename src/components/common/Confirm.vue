<template>
  <v-dialog v-model="confirmStore.dialog" :max-width="290" @keydown.esc="confirmStore.cancel">
    <v-card>
      <v-toolbar color="primary" density="compact" flat>
        <v-toolbar-title class="text-white">{{ confirmStore.title }}</v-toolbar-title>
      </v-toolbar>
      <p v-show="!!confirmStore.message" class="pa-4">{{ confirmStore.message }}</p>
      <v-card-actions class="pt-0">
        <v-spacer></v-spacer>
        <v-btn color="primary-darken-1" variant="text" @click="confirmStore.agree">Yes</v-btn>
        <v-btn color="grey" variant="text" @click="confirmStore.cancel">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useConfirmStore } from '@/store/useConfirmStore'

const confirmStore = useConfirmStore()
</script>
