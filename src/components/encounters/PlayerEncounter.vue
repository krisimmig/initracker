<template>
  <div class="PlayerEncounter">
    <!-- Header -->
    <div class="PlayerEncounter-header mb-4">
      <h1 class="text-h5 font-weight-bold">{{ encounter.name }}</h1>
      <div class="d-flex ga-3 text-caption text-medium-emphasis mt-1">
        <span>Round <strong class="text-body-2 text-high-emphasis">{{ encounter.round }}</strong></span>
        <span>Turn <strong class="text-body-2 text-high-emphasis">{{ encounter.currentTurn }}</strong></span>
        <span class="d-flex align-center ga-1">
          <v-icon size="12">mdi-clock-outline</v-icon>
          {{ elapsedTimeGame }}
        </span>
      </div>
    </div>

    <v-divider class="mb-4" />

    <!-- Active turn callout -->
    <v-alert
      v-if="activeParticipant"
      type="info"
      variant="tonal"
      density="compact"
      class="mb-4"
      icon="mdi-sword-cross"
    >
      <strong>{{ activeParticipant.name }}</strong>'s turn
    </v-alert>

    <!-- Participant list -->
    <div v-if="participants.length > 0" class="PlayerEncounter-list">
      <PlayerParticipantCard
        v-for="(npc, index) in participants"
        :key="npc.uuid"
        :npc="npc"
        :isActive="encounter.activeEntityIndex - 1 === index"
        :hasActed="encounter.activeEntityIndex - 1 > index"
      />
    </div>

    <v-alert v-else type="info" variant="tonal">
      No combatants yet — waiting for the DM to add participants.
    </v-alert>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IEncounterEntity } from '@/types/encounters'
import { Character as ICharacter } from '@/classes/Character'
import PlayerParticipantCard from '@/components/encounters/PlayerParticipantCard.vue'

const props = defineProps<{
  encounter: IEncounterEntity
  participants: ICharacter[]
}>()

const activeParticipant = computed(() => {
  const idx = props.encounter.activeEntityIndex - 1
  return props.participants[idx] ?? null
})

const elapsedTimeGame = computed((): string => {
  const seconds = ((props.encounter.currentTurn ?? 1) - 1) * 6
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(h)}:${pad(m)}:${pad(s)}`
})
</script>

<style scoped>
.PlayerEncounter-header {
  text-align: center;
}
</style>
