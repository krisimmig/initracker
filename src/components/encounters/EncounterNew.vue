<template>
  <v-card variant="outlined">
    <v-card-title class="d-flex align-center pa-3 pb-0">
      <v-icon color="primary" class="mr-2">mdi-sword-cross</v-icon>
      <span class="text-subtitle-1 font-weight-bold">New encounter</span>
    </v-card-title>

    <v-card-text class="pa-3">
      <p class="text-body-2 text-medium-emphasis mb-3">
        An encounter is a battle your party must survive. Prepare as many as you need and start them whenever it fits your narrative.
      </p>

      <v-text-field
        v-model="encounterName"
        label="Encounter name"
        prepend-inner-icon="mdi-tag-outline"
        clearable
        hide-details="auto"
        @keyup.enter="submitNewEncounter"
      />
    </v-card-text>

    <v-card-actions class="pa-3 pt-0">
      <v-spacer />
      <v-btn
        color="primary"
        variant="flat"
        :disabled="!encounterName"
        prepend-icon="mdi-plus"
        @click="submitNewEncounter"
      >
        Create
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useEncountersStore } from '@/store/useEncountersStore'

const encounterName = ref('')
const encountersStore = useEncountersStore()

function submitNewEncounter(): void {
  if (!encounterName.value) return

  encountersStore.addNewEncounter({ encounterName: encounterName.value })
  encounterName.value = ''
}
</script>
