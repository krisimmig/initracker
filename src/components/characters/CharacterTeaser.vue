<template>
  <div
    v-if="characterData"
    class="CharacterTeaser d-flex align-center"
  >
    <div class="d-flex flex-column">
      <h4 class="text-h6 font-weight-medium">{{ characterData.name }}</h4>
      <p class="mb-1">{{ description }}</p>

      <div class="d-flex">
        <div class="d-flex align-center">
          <SvgIcon name="heart" class="text-red mr-1" />
          {{ characterData.hit_points }}
        </div>

        <div class="d-flex align-center ml-2">
          <SvgIcon name="shield" class="text-grey mr-1" />
          {{ characterData.armor_class }}
        </div>

        <div class="d-flex align-center ml-2">
          <p class="mb-0 mr-1">
            <b>CR</b>
            <span v-if="characterData.challenge_rating">
              {{ characterData.challenge_rating }}
            </span>
            <span v-else> &mdash;</span>
          </p>
        </div>
      </div>
      <p class="text-caption mb-0 mt-2 text-secondary">
        Created {{ createdAt || 'sometime in the past' }} - Updated {{ updatedAt || 'never' }}
      </p>
    </div>

    <v-spacer />
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Character } from '@/classes/Character'
import { useEncountersStore } from '@/store/useEncountersStore'
import SvgIcon from '@/components/common/SvgIcon.vue'

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

<style>
.CharacterTeaser {
  cursor: pointer;
}
</style>
