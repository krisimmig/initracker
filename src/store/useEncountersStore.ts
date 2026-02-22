import { defineStore } from 'pinia'
import { ref } from 'vue'
import { v1 as uuid } from 'uuid'
import { db } from '@/store/firebase'
import { Character as ICharacter } from '@/classes/Character'
import { IEncounterEntity } from '@/types/encounters'
import { useUsersStore } from '@/store/useUsersStore'

export const useEncountersStore = defineStore('encounters', () => {
  const encountersAll = ref<IEncounterEntity[]>([])
  const encountersCurrent = ref<IEncounterEntity | null>(null)
  const encountersNpcs = ref<ICharacter[]>([])
  const npcInDetail = ref<ICharacter | null>(null)
  const isLoading = ref(true)

  const encountersActiveNpc = () => {
    if (encountersCurrent.value) {
      return encountersNpcs.value[encountersCurrent.value.activeEntityIndex - 1]
    }
    return undefined
  }

  const encountersCurrentId = () => {
    return encountersCurrent.value ? encountersCurrent.value.id : null
  }

  const npcUuidInDetail = () => {
    return npcInDetail.value ? npcInDetail.value.uuid : undefined
  }

  function fetchEncounters() {
    const usersStore = useUsersStore()
    isLoading.value = true
    const userUid = usersStore.userUid
    db.collection(`users/${userUid}/encounters`)
      .orderBy('createdAt', 'desc')
      .onSnapshot((data) => {
        const encounters: IEncounterEntity[] = []
        data.forEach((doc) => {
          encounters.push(doc.data() as IEncounterEntity)
        })
        encountersAll.value = encounters
        isLoading.value = false
      })
  }

  function fetchEncounterById({ encounterId }: { encounterId: string }) {
    const usersStore = useUsersStore()
    isLoading.value = true
    const userUid = usersStore.userUid
    db.doc(`users/${userUid}/encounters/${encounterId}`).onSnapshot(async (doc) => {
      const encounter = doc.data()
      encountersCurrent.value = encounter as IEncounterEntity
      await fetchEncountersCurrentNpcs({ encounterId })
      isLoading.value = false
    })
  }

  function fetchEncountersCurrentNpcs({ encounterId }: { encounterId: string }) {
    const usersStore = useUsersStore()
    isLoading.value = true
    const userUid = usersStore.userUid
    return new Promise<void>((resolve) => {
      db.collection(`users/${userUid}/encounters/${encounterId}/npcs`)
        .orderBy('initiative', 'desc')
        .onSnapshot((data) => {
          const npcs: ICharacter[] = []
          data.forEach((doc) => {
            npcs.push(doc.data() as ICharacter)
          })
          encountersNpcs.value = npcs
          isLoading.value = false
          resolve()
        })
    })
  }

  async function addNpcToEncounter(
    { npcData, encounterId }: { npcData: ICharacter; encounterId: string },
  ) {
    const usersStore = useUsersStore()
    const userUid = usersStore.userUid
    const id = uuid()

    npcData.uuid = id
    npcData.conditions = []
    npcData.initiative = 0
    npcData.hit_points_current = npcData.hit_points
    const npcsRef = await db.collection(`users/${userUid}/encounters/${encounterId}/npcs`)
    npcsRef.doc(id).set(npcData)
  }

  function removeNpcFromEncounter(
    { npcID, encounterId }: { npcID: string; encounterId: string },
  ) {
    const usersStore = useUsersStore()
    const userUid = usersStore.userUid
    db.collection(`users/${userUid}/encounters`)
      .doc(encounterId)
      .collection('npcs')
      .doc(npcID)
      .delete()
  }

  async function addNewEncounter({ encounterName }: { encounterName: string }) {
    const usersStore = useUsersStore()
    const userUid = usersStore.userUid
    const id = uuid()

    const encountersRef = await db.collection(`users/${userUid}/encounters`)
    const newEncounter: IEncounterEntity = {
      id,
      name: encounterName,
      round: 1,
      activeEntityIndex: 1,
      currentTurn: 1,
      createdAt: Date.now(),
    }
    encountersRef.doc(id).set(newEncounter)
  }

  function removeEncounter({ encounterId }: { encounterId: string }) {
    const usersStore = useUsersStore()
    const userUid = usersStore.userUid
    db.collection(`users/${userUid}/encounters`).doc(encounterId).delete()
  }

  async function updateName({ encounterId, newName }: { encounterId: string; newName: string }) {
    const usersStore = useUsersStore()
    const userUid = usersStore.userUid
    const encounterRef = await db.collection(`users/${userUid}/encounters`).doc(encounterId)
    encounterRef.set({ name: newName }, { merge: true })
  }

  async function updateRound({ encounterId, newRoundIndex }: { encounterId: string; newRoundIndex: number }) {
    const usersStore = useUsersStore()
    const userUid = usersStore.userUid
    const encounterRef = await db.collection(`users/${userUid}/encounters`).doc(encounterId)
    encounterRef.set({ round: newRoundIndex }, { merge: true })
  }

  async function updateActiveEntityIndex(
    { encounterId, activeEntityIndex, currentTurn }: { encounterId: string; activeEntityIndex: number; currentTurn?: number },
  ) {
    const usersStore = useUsersStore()
    const userUid = usersStore.userUid
    let newData: any = { activeEntityIndex }
    if (currentTurn) {
      newData = { ...newData, currentTurn }
    }
    const encounterRef = await db.collection(`users/${userUid}/encounters`).doc(encounterId)
    encounterRef.set(newData, { merge: true })
  }

  function setNpcInDetail(npc: ICharacter) {
    npcInDetail.value = npc
  }

  return {
    encountersAll,
    encountersCurrent,
    encountersNpcs,
    npcInDetail,
    isLoading,
    encountersActiveNpc,
    encountersCurrentId,
    npcUuidInDetail,
    fetchEncounters,
    fetchEncounterById,
    fetchEncountersCurrentNpcs,
    addNpcToEncounter,
    removeNpcFromEncounter,
    addNewEncounter,
    removeEncounter,
    updateName,
    updateRound,
    updateActiveEntityIndex,
    setNpcInDetail,
  }
})
