<template>
  <v-card
    v-if="characterData"
    class="CharacterTeaser mb-2"
    variant="outlined"
  >
    <v-card-text class="pa-3 d-flex align-start">
      <div class="flex-grow-1 min-width-0">
        <div class="text-subtitle-1 font-weight-bold text-truncate">{{ characterData.name }}</div>
        <div class="text-caption text-medium-emphasis mb-2">{{ description }}</div>

        <div class="d-flex align-center gap-2 flex-wrap">
          <v-chip size="x-small" label color="error" variant="tonal" prepend-icon="mdi-heart">
            {{ characterData.hit_points }}
          </v-chip>
          <v-chip size="x-small" label color="secondary" variant="tonal" prepend-icon="mdi-shield">
            {{ characterData.armor_class }}
          </v-chip>
          <v-chip size="x-small" label color="primary" variant="tonal">
            CR {{ characterData.challenge_rating || '—' }}
          </v-chip>
        </div>

        <div class="text-caption text-disabled mt-2">
          Created {{ createdAt || 'sometime in the past' }} · Updated {{ updatedAt || 'never' }}
        </div>
      </div>

      <div class="ml-2 flex-shrink-0 d-flex">
        <slot></slot>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Character } from '@/classes/Character'
import { useEncountersStore } from '@/store/useEncountersStore'

const props = defineProps<{
  characterData: Character
}>()

const encountersStore = useEncountersStore()

const encounterId = computed(() => encountersStore.encountersCurrentId())
const description = computed(() => Character.getDescription(props.characterData))
const createdAt = computed(() => Character.getCreatedAt(props.characterData))
const updatedAt = computed(() => Character.getUpdatedAt(props.characterData))

function addToEncounter() {
  if (!encounterId.value) return
  encountersStore.addNpcToEncounter({
    npcData: Object.assign({}, props.characterData),
    encounterId: encounterId.value,
  })
}
</script>

