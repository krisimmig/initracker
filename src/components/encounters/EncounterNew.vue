<template>
  <v-card>
    <v-card-title>Create new encounter</v-card-title>
    <v-card-text class="text-body-1">
      <p>
        An encounter is a battle that your party has to survive to reach their goals in your campaign.<br />
      </p>
      <p>
        You can prepare as many encounters here as you want and stat them whenever it fits into your narrative.
      </p>
      <v-text-field
        label="Encounter name..."
        v-model="encounterName"
        color="primary"
        @keyup.enter="submitNewEncounter"
        clearable
        prepend-icon="mdi-newspaper-plus"
      >
      </v-text-field>
      <v-btn
        color="primary"
        :disabled="!encounterName"
        @click="submitNewEncounter"
      >
        <v-icon start>mdi-plus</v-icon> Create encounter
      </v-btn>
    </v-card-text>
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
