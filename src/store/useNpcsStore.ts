import { defineStore } from 'pinia'
import { ref } from 'vue'
import { arrayUnion, arrayRemove } from 'firebase/firestore'
import { db } from '@/store/firebase'
import { Character as ICharacter } from '@/classes/Character'
import { ICondition } from '@/types/conditionTypes'
import { useUsersStore } from '@/store/useUsersStore'
import { useEncountersStore } from '@/store/useEncountersStore'

export const useNpcsStore = defineStore('npcs', () => {
  const npcs = ref<ICharacter[]>([])

  let unsubNpcsConnection: (() => void) | null = null

  function getNpcById(npcID: string): ICharacter | undefined {
    return npcs.value.find((npc) => npc.id === npcID)
  }

  function getSearchResults(query: string): ICharacter[] {
    return npcs.value.filter((npc) =>
      npc.name.toLowerCase().includes(query),
    )
  }

  async function fetchNpcs() {
    const monstersQuerySnapshot = await db.collection('monsters').get()
    const monstersData: ICharacter[] = monstersQuerySnapshot.docs.reduce(
      (acc: ICharacter[], current) => {
        const newNpc: ICharacter = current.data() as ICharacter
        newNpc.id = current.id
        acc.push(newNpc)
        return acc
      }, [],
    )
    npcs.value = monstersData
  }

  function openNpcsConnection() {
    if (unsubNpcsConnection) return // Already listening

    unsubNpcsConnection = db.collection('npcs').onSnapshot((data) => {
      npcs.value = data.docs.reduce((acc: ICharacter[], current) => {
        const newNpc: ICharacter = current.data() as ICharacter
        newNpc.id = current.id
        acc.push(newNpc)
        return acc
      }, [])
    })
  }

  function updateCondition(
    { encounterId, npcId, newCondition }: { encounterId: string; npcId: string; newCondition: ICondition },
  ) {
    const usersStore = useUsersStore()
    const userUid = usersStore.userUid
    const npcRef = db.doc(`users/${userUid}/encounters/${encounterId}/npcs/${npcId}`)
    npcRef.update({ conditions: arrayUnion(newCondition) })
  }

  function removeConditionFromNpc(
    { encounterId, npcId, conditionId }: { encounterId: string; npcId: string; conditionId: string },
  ) {
    const encountersStore = useEncountersStore()
    const npc = encountersStore.encountersNpcs.find(n => n.uuid === npcId)
    const conditionToRemove = npc?.conditions.find(c => c.id === conditionId)
    if (!conditionToRemove) return

    const usersStore = useUsersStore()
    const userUid = usersStore.userUid
    const npcRef = db.doc(`users/${userUid}/encounters/${encounterId}/npcs/${npcId}`)
    npcRef.update({ conditions: arrayRemove(conditionToRemove) })
  }

  function updateInitiative(
    { encounterId, npcId, newInitiative }: { encounterId: string; npcId: string; newInitiative: number },
  ) {
    const usersStore = useUsersStore()
    const userUid = usersStore.userUid
    const npcRef = db.doc(`users/${userUid}/encounters/${encounterId}/npcs/${npcId}`)
    npcRef.update({ initiative: newInitiative })
  }

  function updateHitPointCurrent(
    { encounterId, npcId, newHitPoints }: { encounterId: string; npcId: string; newHitPoints: number },
  ) {
    const usersStore = useUsersStore()
    const userUid = usersStore.userUid
    const encounterRef = db.collection(`users/${userUid}/encounters`).doc(encounterId)
    const npcRef = encounterRef.collection('npcs').doc(npcId)
    npcRef.update({ hit_points_current: newHitPoints })
  }

  function updateNpcConditionRound(
    { encounterId, npcId }: { encounterId: string; npcId: string },
  ) {
    const encountersStore = useEncountersStore()
    const npc = encountersStore.encountersNpcs.find(n => n.uuid === npcId)
    if (!npc || !npc.conditions || npc.conditions.length === 0) return // Skip NPCs with no conditions

    const updatedConditions = npc.conditions
      .map(c => c.duration ? { ...c, duration: c.duration - 1 } : c)
      .filter(c => !Object.hasOwn(c, 'duration') || c.duration! >= 1)

    // Only write if conditions actually changed
    if (JSON.stringify(updatedConditions) === JSON.stringify(npc.conditions)) return

    const usersStore = useUsersStore()
    const userUid = usersStore.userUid
    db.doc(`users/${userUid}/encounters/${encounterId}/npcs/${npcId}`).update({ conditions: updatedConditions })
  }

  function cleanup() {
    unsubNpcsConnection?.()
    unsubNpcsConnection = null
  }

  return {
    npcs,
    getNpcById,
    getSearchResults,
    fetchNpcs,
    openNpcsConnection,
    updateCondition,
    removeConditionFromNpc,
    updateInitiative,
    updateHitPointCurrent,
    updateNpcConditionRound,
    cleanup,
  }
})
