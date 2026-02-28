<template>
  <div>
    <div v-if="isLoading">
      <v-skeleton-loader class="mx-auto mb-2" type="heading" />
      <v-skeleton-loader type="text"/>
      <div class="d-flex mb-3">
        <v-skeleton-loader class="ml-auto ml-1" type="button" />
        <v-skeleton-loader class="ml-1" type="avatar" />
      </div>
      <v-card class="mb-3">
        <v-skeleton-loader class="mx-auto" type="heading, list-item-three-line" />
      </v-card>
      <v-card class="mb-3">
        <v-skeleton-loader class="mx-auto" type="heading, list-item-three-line" />
      </v-card>
    </div>

    <template v-if="!isLoading && currentEncounter">
      <div class="Encounter">
        <EncounterActionbar
          :encounter="currentEncounter"
          :disableActions="npcs.length === 0"
          @nextTurn="nextTurn"
          @addCharacters="showCharacterLibrary = true"
          @rollInitiative="rollInitiative"
          @reset="reset"
        />

        <v-dialog v-model="showCharacterLibrary" max-width="80vw">
          <CharacterLibrary
            :encounterId="route.params.encounterId"
            @characterClicked="handleCharClicked"
            @closeClicked="showCharacterLibrary = false"
            button-text="Add"
          />
        </v-dialog>

        <div v-if="npcs.length > 0">
          <div class="p-4" style="overflow-y: auto; height: calc(100vh - 185px); margin-right: -16px;">
            <div v-for="(npc, index) in npcs" :key="index">
              <CharacterListItem
                :npc="npc"
                :isActive="currentNpcIndex - 1 === index"
                :hasActed="currentNpcIndex - 1 > index"
                :removable="true"
                @remove="removeNpcFromEncounter(npc.uuid)"
              />
            </div>
          </div>
        </div>

        <v-alert v-if="npcs.length === 0" type="info" variant="outlined">
          <p class="mb-3">Nobody is participating in this battle yet. Choose some combatants from the <strong>Characters</strong> library.</p>
          <v-btn variant="tonal" color="info" prepend-icon="mdi-account-multiple-plus" @click="showCharacterLibrary = true">
            Open character library
          </v-btn>
        </v-alert>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { DiceRoll } from '@dice-roller/rpg-dice-roller'
import { useEncountersStore } from '@/store/useEncountersStore'
import { useNpcsStore } from '@/store/useNpcsStore'
import { useSnackbarStore } from '@/store/useSnackbarStore'
import CharacterListItem from '@/components/characters/CharacterListItem.vue'
import CharacterLibrary from '@/components/characters/CharacterLibrary.vue'
import EncounterActionbar from '@/components/encounters/EncounterActionbar.vue'
import { modifierWithSign } from '@/utils/dnd'
import { Character as ICharacter } from '@/classes/Character'

const props = defineProps<{
  id: string
}>()

const route = useRoute()
const encountersStore = useEncountersStore()
const npcsStore = useNpcsStore()
const snackbar = useSnackbarStore()

const showCharacterLibrary = ref(false)

const isLoading = computed(() => encountersStore.isLoading)
const currentEncounter = computed(() => encountersStore.encountersCurrent)
const currentNpcIndex = computed(() => currentEncounter.value?.activeEntityIndex ?? 1)
const npcs = computed(() => encountersStore.encountersNpcs)

function removeNpcFromEncounter(npcID: string) {
  encountersStore.removeNpcFromEncounter({ npcID, encounterId: props.id })

  if (currentNpcIndex.value > npcs.value.length - 1) {
    encountersStore.updateActiveEntityIndex({
      encounterId: props.id,
      activeEntityIndex: (npcs.value.length - 1) || 1,
    })
  }
}

function rollInitiative(): void {
  if (currentEncounter.value && npcs.value) {
    npcs.value.forEach((npc) => {
      const mod = modifierWithSign(npc.dexterity)
      const newInitiative = new DiceRoll(`1d20${mod}`)
      npcsStore.updateInitiative({
        encounterId: props.id,
        npcId: npc.uuid,
        newInitiative: newInitiative.total,
      })
    })

    encountersStore.updateActiveEntityIndex({
      encounterId: props.id,
      activeEntityIndex: 1,
      currentTurn: 1,
    })

    encountersStore.updateRound({
      encounterId: props.id,
      newRoundIndex: 1,
    })
  }
}

function reset(): void {
  encountersStore.updateRound({ encounterId: props.id, newRoundIndex: 1 })
  encountersStore.updateActiveEntityIndex({ encounterId: props.id, activeEntityIndex: 1, currentTurn: 1 })
}

function nextTurn(): void {
  const npc = npcs.value[currentNpcIndex.value - 1]
  if (!npc) {
    console.warn('No npc for next round found.')
    return
  }

  const isLastInRound = currentNpcIndex.value === npcs.value.length
  const nextIndex = isLastInRound ? 1 : currentNpcIndex.value + 1

  npcsStore.updateNpcConditionRound({ encounterId: props.id, npcId: npc.uuid })

  if (isLastInRound) {
    encountersStore.updateRound({
      encounterId: props.id,
      newRoundIndex: (currentEncounter.value?.round ?? 1) + 1,
    })
  }

  encountersStore.updateActiveEntityIndex({
    encounterId: props.id,
    activeEntityIndex: nextIndex,
    currentTurn: (currentEncounter.value?.currentTurn ?? 1) + 1,
  })
}

function handleCharClicked(npcData: ICharacter) {
  if (!route.params.encounterId) return

  snackbar.show(`Added ${npcData.name}`)
  encountersStore.addNpcToEncounter({
    npcData: Object.assign({}, npcData),
    encounterId: route.params.encounterId as string,
  })
}
</script>
