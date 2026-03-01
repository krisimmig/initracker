<template>
  <v-card
    :class="[
      'PlayerParticipantCard mb-2',
      { 'is-active': isActive, 'has-acted': hasActed },
      `Category-${npc.category}`,
    ]"
    variant="outlined"
  >
    <v-card-item class="py-2 px-3">
      <template #prepend>
        <div class="PlayerParticipantCard-initiative text-center mr-1">
          <span class="text-caption text-medium-emphasis d-block" style="line-height: 1;">Init</span>
          <span class="text-h6 font-weight-bold">{{ npc.initiative }}</span>
        </div>
      </template>

      <v-card-title class="text-body-1 font-weight-bold pa-0 d-flex align-center">
        <v-icon
          v-if="isActive"
          size="16"
          color="primary"
          class="mr-1"
        >mdi-chevron-right</v-icon>
        <span :class="{ 'text-decoration-line-through text-disabled': isDead }">
          {{ npc.name }}
        </span>
        <v-icon
          v-if="isDead"
          size="16"
          color="error"
          class="ml-1"
        >mdi-skull</v-icon>
      </v-card-title>

      <v-card-subtitle class="text-caption pa-0">
        {{ description }}
      </v-card-subtitle>
    </v-card-item>

    <!-- Conditions -->
    <v-card-text v-if="activeConditions.length > 0" class="px-3 pt-0 pb-2">
      <v-chip
        v-for="condition in activeConditions"
        :key="condition.id"
        size="small"
        color="secondary"
        variant="outlined"
        class="mr-1 mb-1"
      >
        {{ condition.name }}
      </v-chip>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Character, Character as ICharacter } from '@/classes/Character'

const props = defineProps<{
  npc: ICharacter
  isActive: boolean
  hasActed?: boolean
}>()

const isDead = computed(() => props.npc.hit_points_current <= 0)
const activeConditions = computed(() => props.npc.conditions || [])
const description = computed(() => Character.getDescription(props.npc))
</script>

<style scoped>
.PlayerParticipantCard {
  transition: border-color 0.3s ease, opacity 0.3s ease, transform 0.3s ease;
}

.PlayerParticipantCard.is-active {
  border-color: rgb(var(--v-theme-primary)) !important;
  box-shadow: 0 0 0 1px rgb(var(--v-theme-primary));
}

.PlayerParticipantCard.has-acted {
  opacity: 0.5;
}

.PlayerParticipantCard-initiative {
  min-width: 40px;
}
</style>
