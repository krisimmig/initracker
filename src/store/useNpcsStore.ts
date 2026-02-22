import { defineStore } from 'pinia'
import { ref } from 'vue'
import { arrayUnion } from 'firebase/firestore'
import { db } from '@/store/firebase'
import { Character as ICharacter } from '@/classes/Character'
import { ICondition } from '@/types/conditionTypes'
import { remove } from 'lodash'
import { useUsersStore } from '@/store/useUsersStore'

export const useNpcsStore = defineStore('npcs', () => {
  const npcs = ref<ICharacter[]>([])

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
    db.collection('npcs').onSnapshot((data) => {
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
    npcRef.set({ conditions: arrayUnion(newCondition) }, { merge: true })
  }

  async function removeConditionFromNpc(
    { encounterId, npcId, conditionId }: { encounterId: string; npcId: string; conditionId: string },
  ) {
    const usersStore = useUsersStore()
    const userUid = usersStore.userUid
    const npcRef = db.doc(`users/${userUid}/encounters/${encounterId}/npcs/${npcId}`)
    try {
      const npc = (await npcRef.get()).data() as ICharacter
      remove(npc.conditions, (condition) => condition.id === conditionId)
      npcRef.set({ conditions: npc.conditions }, { merge: true })
    } catch (e) {
      console.error(e)
    }
  }

  function updateInitiative(
    { encounterId, npcId, newInitiative }: { encounterId: string; npcId: string; newInitiative: number },
  ) {
    const usersStore = useUsersStore()
    const userUid = usersStore.userUid
    const npcRef = db.doc(`users/${userUid}/encounters/${encounterId}/npcs/${npcId}`)
    npcRef.set({ initiative: newInitiative }, { merge: true })
  }

  function updateHitPointCurrent(
    { encounterId, npcId, newHitPoints }: { encounterId: string; npcId: string; newHitPoints: number },
  ) {
    const usersStore = useUsersStore()
    const userUid = usersStore.userUid
    const encounterRef = db.collection(`users/${userUid}/encounters`).doc(encounterId)
    const npcRef = encounterRef.collection('npcs').doc(npcId)
    npcRef.set({ hit_points_current: newHitPoints }, { merge: true })
  }

  function updateNpcConditionRound(
    { encounterId, npcId }: { encounterId: string; npcId: string },
  ) {
    const usersStore = useUsersStore()
    const userUid = usersStore.userUid
    const npcRef = db.doc(`users/${userUid}/encounters/${encounterId}/npcs/${npcId}`).get()
    npcRef.then((doc) => {
      const npc = doc.data() as ICharacter
      const conditions = npc.conditions
      conditions.forEach((condition) => {
        if (condition.duration) {
          condition.duration -= 1
        }
      })

      remove(conditions, (condition) => {
        return Object.hasOwn(condition, 'duration') && condition.duration! < 1
      })

      db.doc(`users/${userUid}/encounters/${encounterId}/npcs/${npcId}`).set({ conditions }, { merge: true })
    })
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
  }
})
