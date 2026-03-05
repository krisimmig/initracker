<template>
  <v-app>
    <AppBar v-if="!route.meta?.hideAppBar" />

    <v-main>
      <v-container :fluid="(route.meta?.isFullWidth as boolean | undefined)" :style="route.meta?.isFullWidth ? undefined : 'max-width: 1280px;'">
        <router-view></router-view>
        <Confirm />
      </v-container>
    </v-main>

    <v-snackbar
      v-model="snackbar.visible"
      :timeout="snackbar.timeout"
      location="bottom right"
    >
      <span v-html="snackbar.message"></span>
      <template #actions>
        <v-btn variant="text" @click="snackbar.visible = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppBar from '@/components/AppBar.vue'
import Confirm from '@/components/common/Confirm.vue'
import { useNpcsStore } from '@/store/useNpcsStore'
import { useSnackbarStore } from '@/store/useSnackbarStore'

const route = useRoute()
const snackbar = useSnackbarStore()
const npcsStore = useNpcsStore()

onMounted(async () => {
  if (npcsStore.npcs.length < 1) {
    await npcsStore.fetchNpcs()
  }
})
</script>
