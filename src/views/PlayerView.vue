<template>
  <div class="PlayerView">
    <!-- Loading state -->
    <div v-if="isLoading" class="PlayerView-loading d-flex flex-column align-center justify-center" style="min-height: 80vh;">
      <v-progress-circular indeterminate color="primary" size="48" class="mb-4" />
      <p class="text-body-1 text-medium-emphasis">Loading encounter…</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="d-flex flex-column align-center justify-center" style="min-height: 80vh;">
      <v-icon size="64" color="error" class="mb-4">mdi-sword-cross</v-icon>
      <p class="text-h6 mb-2">Encounter Not Found</p>
      <p class="text-body-2 text-medium-emphasis">{{ error }}</p>
    </div>

    <!-- Player encounter view -->
    <PlayerEncounter
      v-else-if="encounter"
      :encounter="encounter"
      :participants="participants"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useEncountersStore } from '@/store/useEncountersStore'
import PlayerEncounter from '@/components/encounters/PlayerEncounter.vue'

const route = useRoute()
const encountersStore = useEncountersStore()

const isLoading = computed(() => encountersStore.isLoadingShared)
const error = computed(() => encountersStore.sharedError)
const encounter = computed(() => encountersStore.sharedEncounter)
const participants = computed(() => encountersStore.sharedEncounterNpcs)

onMounted(() => {
  const shareId = route.params.shareId as string
  encountersStore.fetchSharedEncounter({ shareId })
})
</script>

<style scoped>
.PlayerView {
  max-width: 600px;
  margin: 0 auto;
  padding: 16px;
}
</style>
