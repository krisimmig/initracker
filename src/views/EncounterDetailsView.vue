<template>
  <v-row>
    <v-col cols="5">
      <EncounterList :id="route.params.encounterId as string"/>
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
  <ActivityLog />
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useEncountersStore } from '@/store/useEncountersStore'
import { useActivityLogStore } from '@/store/useActivityLogStore'
import EncounterList from '@/components/encounters/EncounterList.vue'
import CharacterDetails from '@/components/characters/CharacterDetails.vue'
import ActivityLog from '@/components/encounters/ActivityLog.vue'

const route = useRoute()
const encountersStore = useEncountersStore()
const activityLog = useActivityLogStore()

const selectedCharacter = computed(() => encountersStore.npcInDetail)
const activeCharacter = computed(() => encountersStore.encountersActiveNpc())

onMounted(() => {
  const encounterId = route.params.encounterId as string
  activityLog.setEncounter(encounterId)
  encountersStore.fetchEncounterById({ encounterId })
})
</script>
