import { defineStore } from 'pinia'
import { ref } from 'vue'
import { remove } from 'lodash'
import { v1 as uuid } from 'uuid'
import { useEncountersStore } from '@/store/useEncountersStore'
import { useNpcsStore } from '@/store/useNpcsStore'
import { useSnackbarStore } from '@/store/useSnackbarStore'
import { demoEncounter, demoParticipants } from '@/data/demoEncounterData'
import { Character as ICharacter } from '@/classes/Character'
import { ICondition } from '@/types/conditionTypes'

export const useDemoStore = defineStore('demo', () => {
  const isDemoActive = ref(false)
  const interactionCount = ref(0)
  const ctaShown = ref(false)

  // Saved original methods for restoration
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let savedEncountersMethods: Record<string, any> = {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let savedNpcsMethods: Record<string, any> = {}

  function trackInteraction() {
    interactionCount.value++
    if (interactionCount.value === 5 && !ctaShown.value) {
      ctaShown.value = true
      const snackbar = useSnackbarStore()
      snackbar.show('Enjoying YAIT? Create a free account to save your encounters.', { timeout: 6000 })
    }
  }

  function findNpc(npcId: string): ICharacter | undefined {
    const encountersStore = useEncountersStore()
    return encountersStore.encountersNpcs.find((n) => n.uuid === npcId)
  }

  function activateDemo() {
    const encountersStore = useEncountersStore()
    const npcsStore = useNpcsStore()

    // Save original methods
    savedEncountersMethods = {
      fetchEncounterById: encountersStore.fetchEncounterById,
      updateTurnState: encountersStore.updateTurnState,
      updateActiveEntityIndex: encountersStore.updateActiveEntityIndex,
      updateRound: encountersStore.updateRound,
      addNpcToEncounter: encountersStore.addNpcToEncounter,
      removeNpcFromEncounter: encountersStore.removeNpcFromEncounter,
    }

    savedNpcsMethods = {
      updateHitPointCurrent: npcsStore.updateHitPointCurrent,
      updateCondition: npcsStore.updateCondition,
      removeConditionFromNpc: npcsStore.removeConditionFromNpc,
      updateInitiative: npcsStore.updateInitiative,
      updateNpcConditionRound: npcsStore.updateNpcConditionRound,
    }

    // Populate stores with demo data (deep copy to avoid mutating the source)
    encountersStore.encountersCurrent = { ...demoEncounter }
    encountersStore.encountersNpcs = demoParticipants.map((p) => ({ ...p, conditions: [...p.conditions] })) as ICharacter[]
    encountersStore.isLoading = false
    encountersStore.npcInDetail = null

    // Patch encountersStore methods

    encountersStore.fetchEncounterById = () => {
      // no-op: data already loaded
    }

    encountersStore.updateTurnState = ({ activeEntityIndex, currentTurn, round }) => {
      if (encountersStore.encountersCurrent) {
        const update: Record<string, number> = { activeEntityIndex, currentTurn }
        if (round !== undefined) update.round = round
        encountersStore.encountersCurrent = { ...encountersStore.encountersCurrent, ...update }
      }
      trackInteraction()
    }

    encountersStore.updateActiveEntityIndex = ({ activeEntityIndex, currentTurn }) => {
      if (encountersStore.encountersCurrent) {
        const update: Record<string, number> = { activeEntityIndex }
        if (currentTurn !== undefined) update.currentTurn = currentTurn
        encountersStore.encountersCurrent = { ...encountersStore.encountersCurrent, ...update }
      }
      trackInteraction()
    }

    encountersStore.updateRound = ({ newRoundIndex }) => {
      if (encountersStore.encountersCurrent) {
        encountersStore.encountersCurrent = { ...encountersStore.encountersCurrent, round: newRoundIndex }
      }
    }

    encountersStore.addNpcToEncounter = ({ npcData }) => {
      const clone = { ...npcData } as ICharacter
      clone.uuid = uuid()
      clone.conditions = []
      clone.initiative = 0
      clone.hit_points_current = clone.hit_points
      encountersStore.encountersNpcs = [...encountersStore.encountersNpcs, clone]
      trackInteraction()
    }

    encountersStore.removeNpcFromEncounter = ({ npcID }) => {
      encountersStore.encountersNpcs = encountersStore.encountersNpcs.filter((n) => n.uuid !== npcID)
      trackInteraction()
    }

    // Patch npcsStore methods

    npcsStore.updateHitPointCurrent = ({ npcId, newHitPoints }) => {
      const npc = findNpc(npcId)
      if (npc) {
        npc.hit_points_current = newHitPoints
        encountersStore.encountersNpcs = [...encountersStore.encountersNpcs]
      }
      trackInteraction()
    }

    npcsStore.updateCondition = ({ npcId, newCondition }: { encounterId: string; npcId: string; newCondition: ICondition }) => {
      const npc = findNpc(npcId)
      if (npc) {
        npc.conditions = [...npc.conditions, newCondition]
        encountersStore.encountersNpcs = [...encountersStore.encountersNpcs]
      }
      trackInteraction()
    }

    npcsStore.removeConditionFromNpc = ({ npcId, conditionId }: { encounterId: string; npcId: string; conditionId: string }) => {
      const npc = findNpc(npcId)
      if (npc) {
        remove(npc.conditions, (c) => c.id === conditionId)
        encountersStore.encountersNpcs = [...encountersStore.encountersNpcs]
      }
      trackInteraction()
    }

    npcsStore.updateInitiative = ({ npcId, newInitiative }: { encounterId: string; npcId: string; newInitiative: number }) => {
      const npc = findNpc(npcId)
      if (npc) {
        npc.initiative = newInitiative
        // Re-sort by initiative descending
        encountersStore.encountersNpcs = [...encountersStore.encountersNpcs].sort(
          (a, b) => b.initiative - a.initiative,
        )
      }
      trackInteraction()
    }

    npcsStore.updateNpcConditionRound = ({ npcId }: { encounterId: string; npcId: string }) => {
      const npc = findNpc(npcId)
      if (npc) {
        npc.conditions.forEach((condition) => {
          if (condition.duration) {
            condition.duration -= 1
          }
        })
        remove(npc.conditions, (c) => Object.hasOwn(c, 'duration') && c.duration! < 1)
        encountersStore.encountersNpcs = [...encountersStore.encountersNpcs]
      }
    }

    isDemoActive.value = true
    interactionCount.value = 0
    ctaShown.value = false
  }

  function deactivateDemo() {
    const encountersStore = useEncountersStore()
    const npcsStore = useNpcsStore()

    // Restore original methods
    Object.entries(savedEncountersMethods).forEach(([key, fn]) => {
      ;(encountersStore as Record<string, unknown>)[key] = fn
    })
    Object.entries(savedNpcsMethods).forEach(([key, fn]) => {
      ;(npcsStore as Record<string, unknown>)[key] = fn
    })

    // Clear demo state
    encountersStore.encountersCurrent = null
    encountersStore.encountersNpcs = []
    encountersStore.npcInDetail = null

    savedEncountersMethods = {}
    savedNpcsMethods = {}
    isDemoActive.value = false
  }

  return { isDemoActive, activateDemo, deactivateDemo }
})
