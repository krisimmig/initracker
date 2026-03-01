<template>
  <div>
    <DemoBanner />

    <v-row>
      <v-col cols="5">
        <EncounterList :id="DEMO_ENCOUNTER_ID" />
      </v-col>

      <v-col>
        <CharacterDetails v-if="activeCharacter" :characterData="activeCharacter" />
      </v-col>

      <v-col>
        <CharacterDetails v-if="selectedCharacter" :characterData="selectedCharacter" />
        <v-alert v-else density="compact" variant="outlined" type="info" class="mt-8">
          Click on a <b>character name</b> to see details here.
        </v-alert>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted } from 'vue'
import { useEncountersStore } from '@/store/useEncountersStore'
import { useDemoStore } from '@/store/useDemoStore'
import EncounterList from '@/components/encounters/EncounterList.vue'
import CharacterDetails from '@/components/characters/CharacterDetails.vue'
import DemoBanner from '@/components/demo/DemoBanner.vue'

const DEMO_ENCOUNTER_ID = 'demo-encounter'

const encountersStore = useEncountersStore()
const demoStore = useDemoStore()

// Activate demo synchronously in setup so data is ready before child components mount
demoStore.activateDemo()

const selectedCharacter = computed(() => encountersStore.npcInDetail)
const activeCharacter = computed(() => encountersStore.encountersActiveNpc())

onUnmounted(() => {
  demoStore.deactivateDemo()
})
</script>
