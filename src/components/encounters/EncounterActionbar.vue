<template>
  <div class="Encounter-actionbar d-flex align-center mb-3">
    <div>
      <h1 class="text-h5 font-weight-light mb-0">{{ encounter.name }}</h1>
      <div class="d-flex ga-3 text-caption text-medium-emphasis">
        <span>Round <strong class="text-body-2 text-high-emphasis">{{ encounter.round }}</strong></span>
        <span>Turn <strong class="text-body-2 text-high-emphasis">{{ encounter.currentTurn }}</strong></span>
        <v-tooltip location="bottom" text="Elapsed time">
          <template #activator="{ props: tooltipProps }">
            <span v-bind="tooltipProps" class="d-flex align-center ga-1">
              <v-icon size="12">mdi-clock-outline</v-icon>
              {{ elapsedTimeGame }}
            </span>
          </template>
        </v-tooltip>
      </div>
    </div>

    <v-spacer />

    <v-btn
      color="primary"
      variant="tonal"
      prepend-icon="mdi-skip-next"
      :disabled="disableActions"
      @click="emit('nextTurn')"
    >
      Next
    </v-btn>

    <v-menu location="bottom end" :close-on-content-click="true">
      <template #activator="{ props: activatorProps }">
        <v-btn icon="mdi-dots-vertical" variant="text" v-bind="activatorProps" class="ml-1" />
      </template>
      <v-list density="compact" nav>
        <v-list-item
          prepend-icon="mdi-account-multiple-plus"
          title="Add characters"
          @click="emit('addCharacters')"
        />
        <v-list-item
          v-if="isAtStart"
          prepend-icon="mdi-dice-d20-outline"
          title="Roll initiative"
          :disabled="disableActions"
          @click="emit('rollInitiative')"
        />
        <v-list-item
          v-else
          prepend-icon="mdi-backup-restore"
          title="Reset encounter"
          @click="emit('reset')"
        />
      </v-list>
    </v-menu>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IEncounterEntity } from '@/types/encounters'

const props = defineProps<{
  encounter: IEncounterEntity
  disableActions: boolean
}>()

const emit = defineEmits<{
  nextTurn: []
  addCharacters: []
  rollInitiative: []
  reset: []
}>()

const isAtStart = computed(() => props.encounter.round === 1 && props.encounter.activeEntityIndex === 1)

const elapsedTimeGame = computed((): string => {
  const seconds = ((props.encounter.currentTurn ?? 1) - 1) * 6
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(h)}:${pad(m)}:${pad(s)}`
})
</script>
