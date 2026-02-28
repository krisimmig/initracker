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
        <h1 class="my-0 font-weight-light">{{ currentEncounter.name }}</h1>
        <div class="d-flex align-center mb-2">
          <p class="text-subtitle-1 mb-0">
            Round <span class="font-weight-bold">{{ currentRound }}</span>
            Turn <span class="font-weight-bold">{{ currentEncounter.currentTurn }}</span>
            Elapsed time <span class="font-weight-bold">{{ elapsedTimeGame }}</span>
          </p>

          <v-spacer></v-spacer>

          <div>
            <v-btn @click="nextTurn" :disabled="npcs.length === 0">
              <v-icon start>mdi-skip-next</v-icon>
              Next
            </v-btn>
            <v-dialog v-model="showCharacterLibrary" max-width="80vw">
              <CharacterLibrary
                :encounterId="route.params.encounterId"
                @characterClicked="handleCharClicked"
                @closeClicked="showCharacterLibrary = false"
                button-text="Add"
              />
            </v-dialog>

            <v-menu location="bottom end">
              <template v-slot:activator="{ props: activatorProps }">
                <v-btn icon v-bind="activatorProps" class="ml-2">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click.stop="showCharacterLibrary = true">
                  <template #prepend>
                    <v-icon>mdi-account-multiple-plus</v-icon>
                  </template>
                  <v-list-item-title>Add</v-list-item-title>
                </v-list-item>

                <v-list-item
                  v-if="currentRound === 1 && currentNpcIndex === 1"
                  @click="rollInitiative"
                  :disabled="npcs.length === 0"
                >
                  <template #prepend>
                    <v-icon>mdi-dice-d20-outline</v-icon>
                  </template>
                  <v-list-item-title>Roll ini</v-list-item-title>
                </v-list-item>

                <v-list-item v-else @click="reset">
                  <template #prepend>
                    <v-icon>mdi-backup-restore</v-icon>
                  </template>
                  <v-list-item-title>Reset</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </div>

        <div v-if="npcs.length > 0">
          <div class="pr-4" style="overflow-y: auto; height: calc(100vh - 185px); margin-right: -16px;">
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

        <v-alert type="info" v-if="npcs.length === 0">
          Nobody is participating in this battle yet.
          Choose some combatants from the <b>Characters</b> library.
          <br>
          <v-btn class="mt-4" @click="showCharacterLibrary = true">
            <v-icon start>mdi-account-multiple-plus</v-icon>
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
const currentRound = computed(() => currentEncounter.value?.round)
const currentNpcIndex = computed(() => currentEncounter.value?.activeEntityIndex ?? 1)
const npcs = computed(() => encountersStore.encountersNpcs)

const elapsedTimeGame = computed((): string => {
  const seconds = ((currentEncounter.value?.currentTurn ?? 1) - 1) * 6
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `${h}:${m}:${s}`
})

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

  const nextIndex = currentNpcIndex.value === npcs.value.length ? 1 : currentNpcIndex.value + 1

  npcsStore.updateNpcConditionRound({ encounterId: props.id, npcId: npc.uuid })

  encountersStore.updateRound({
    encounterId: props.id,
    newRoundIndex: (currentRound.value ?? 1) + 1,
  })

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
