import { defineStore } from 'pinia'
import { ref } from 'vue'
import { v1 as uuid } from 'uuid'
import { nanoid } from 'nanoid'
import { db, firebase } from '@/store/firebase'
import { Character as ICharacter } from '@/classes/Character'
import { IEncounterEntity } from '@/types/encounters'
import { useUsersStore } from '@/store/useUsersStore'

export const useEncountersStore = defineStore('encounters', () => {
  const encountersAll = ref<IEncounterEntity[]>([])
  const encountersCurrent = ref<IEncounterEntity | null>(null)
  const encountersNpcs = ref<ICharacter[]>([])
  const npcInDetail = ref<ICharacter | null>(null)
  const isLoading = ref(true)

  // Player view (shared encounter) state
  const sharedEncounter = ref<IEncounterEntity | null>(null)
  const sharedEncounterNpcs = ref<ICharacter[]>([])
  const isLoadingShared = ref(true)
  const sharedError = ref<string | null>(null)

  // Listener unsubscribe functions
  let unsubEncounters: (() => void) | null = null
  let unsubEncounterById: (() => void) | null = null
  let unsubEncounterNpcs: (() => void) | null = null

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
    if (unsubEncounters) return // Already listening

    const usersStore = useUsersStore()
    isLoading.value = true
    const userUid = usersStore.userUid
    unsubEncounters = db.collection(`users/${userUid}/encounters`)
      .orderBy('createdAt', 'desc')
      .limit(50)
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
    // Tear down previous encounter listeners before setting up new ones
    unsubEncounterById?.()
    unsubEncounterNpcs?.()
    unsubEncounterById = null
    unsubEncounterNpcs = null

    const usersStore = useUsersStore()
    isLoading.value = true
    const userUid = usersStore.userUid
    unsubEncounterById = db.doc(`users/${userUid}/encounters/${encounterId}`).onSnapshot(async (doc) => {
      const encounter = doc.data()
      encountersCurrent.value = encounter as IEncounterEntity
      await fetchEncountersCurrentNpcs({ encounterId })
      isLoading.value = false
    })
  }

  function fetchEncountersCurrentNpcs({ encounterId }: { encounterId: string }) {
    unsubEncounterNpcs?.()
    unsubEncounterNpcs = null

    const usersStore = useUsersStore()
    const userUid = usersStore.userUid
    return new Promise<void>((resolve) => {
      unsubEncounterNpcs = db.collection(`users/${userUid}/encounters/${encounterId}/npcs`)
        .orderBy('initiative', 'desc')
        .onSnapshot((data) => {
          const npcs: ICharacter[] = []
          data.forEach((doc) => {
            npcs.push(doc.data() as ICharacter)
          })
          encountersNpcs.value = npcs
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

    // Propagate shareId if encounter is already shared
    if (encountersCurrent.value?.shareId) {
      (npcData as any).shareId = encountersCurrent.value.shareId
    }

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
    encounterRef.update({ name: newName })
  }

  async function updateRound({ encounterId, newRoundIndex }: { encounterId: string; newRoundIndex: number }) {
    const usersStore = useUsersStore()
    const userUid = usersStore.userUid
    const encounterRef = await db.collection(`users/${userUid}/encounters`).doc(encounterId)
    encounterRef.update({ round: newRoundIndex })
  }

  async function updateActiveEntityIndex(
    { encounterId, activeEntityIndex, currentTurn }: { encounterId: string; activeEntityIndex: number; currentTurn?: number },
  ) {
    const usersStore = useUsersStore()
    const userUid = usersStore.userUid
    const newData: Record<string, number> = { activeEntityIndex }
    if (currentTurn !== undefined) {
      newData.currentTurn = currentTurn
    }
    const encounterRef = await db.collection(`users/${userUid}/encounters`).doc(encounterId)
    encounterRef.update(newData)
  }

  async function updateTurnState(
    { encounterId, activeEntityIndex, currentTurn, round }: { encounterId: string; activeEntityIndex: number; currentTurn: number; round?: number },
  ) {
    const usersStore = useUsersStore()
    const userUid = usersStore.userUid
    const newData: Record<string, number> = { activeEntityIndex, currentTurn }
    if (round !== undefined) {
      newData.round = round
    }
    const encounterRef = await db.collection(`users/${userUid}/encounters`).doc(encounterId)
    encounterRef.update(newData)
  }

  function setNpcInDetail(npc: ICharacter) {
    npcInDetail.value = npc
  }

  async function generateShareLink({ encounterId }: { encounterId: string }): Promise<string> {
    const usersStore = useUsersStore()
    const userUid = usersStore.userUid

    // Check if encounter already has a shareId
    const encounterRef = db.doc(`users/${userUid}/encounters/${encounterId}`)
    const encounterDoc = await encounterRef.get()
    const existing = encounterDoc.data() as IEncounterEntity | undefined

    if (existing?.shareId) {
      return existing.shareId
    }

    const shareId = nanoid(10)

    // Batch: write shareId to encounter, create lookup doc, and denormalize onto NPC docs
    const batch = db.batch()
    batch.update(encounterRef, { shareId })
    batch.set(db.doc(`shared_encounters/${shareId}`), {
      ownerUid: userUid,
      encounterId,
      createdAt: Date.now(),
    })

    // Denormalize shareId onto each NPC doc (reduces security rule reads)
    const npcsSnapshot = await db.collection(`users/${userUid}/encounters/${encounterId}/npcs`).get()
    npcsSnapshot.forEach((npcDoc) => {
      batch.update(npcDoc.ref, { shareId })
    })

    await batch.commit()
    return shareId
  }

  async function revokeShareLink({ encounterId }: { encounterId: string }) {
    const usersStore = useUsersStore()
    const userUid = usersStore.userUid
    const encounterRef = db.doc(`users/${userUid}/encounters/${encounterId}`)
    const encounterDoc = await encounterRef.get()
    const existing = encounterDoc.data() as IEncounterEntity | undefined

    if (existing?.shareId) {
      const batch = db.batch()
      // Remove the shared_encounters lookup doc
      batch.delete(db.doc(`shared_encounters/${existing.shareId}`))
      // Remove shareId from encounter
      batch.update(encounterRef, { shareId: firebase.firestore.FieldValue.delete() })

      // Remove shareId from each NPC doc
      const npcsSnapshot = await db.collection(`users/${userUid}/encounters/${encounterId}/npcs`).get()
      npcsSnapshot.forEach((npcDoc) => {
        batch.update(npcDoc.ref, { shareId: firebase.firestore.FieldValue.delete() })
      })

      await batch.commit()
    }
  }

  function fetchSharedEncounter({ shareId }: { shareId: string }) {
    isLoadingShared.value = true
    sharedError.value = null

    let unsubscribeEncounter: (() => void) | null = null
    let unsubscribeNpcs: (() => void) | null = null

    // Watch the share lookup doc — fires immediately and on any change (including deletion)
    const unsubscribeShareDoc = db.doc(`shared_encounters/${shareId}`).onSnapshot((doc) => {
      if (!doc.exists) {
        // Sharing was revoked (or link was never valid)
        sharedError.value = 'This shared encounter link is invalid or has expired.'
        sharedEncounter.value = null
        sharedEncounterNpcs.value = []
        isLoadingShared.value = false
        unsubscribeEncounter?.()
        unsubscribeNpcs?.()
        unsubscribeShareDoc()
        return
      }

      // Only set up encounter listeners once (guard against repeated snapshots)
      if (unsubscribeEncounter) return

      const { ownerUid, encounterId } = doc.data() as { ownerUid: string; encounterId: string }

      unsubscribeEncounter = db.doc(`users/${ownerUid}/encounters/${encounterId}`).onSnapshot((encounterDoc) => {
        if (!encounterDoc.exists) {
          sharedError.value = 'This encounter no longer exists.'
          isLoadingShared.value = false
          return
        }
        sharedEncounter.value = encounterDoc.data() as IEncounterEntity
      })

      unsubscribeNpcs = db.collection(`users/${ownerUid}/encounters/${encounterId}/npcs`)
        .orderBy('initiative', 'desc')
        .onSnapshot((snapshot) => {
          const npcs: ICharacter[] = []
          snapshot.forEach((doc) => {
            npcs.push(doc.data() as ICharacter)
          })
          sharedEncounterNpcs.value = npcs
          isLoadingShared.value = false
        })
    }, (err) => {
      console.error('Error fetching shared encounter:', err)
      sharedError.value = 'Failed to load the shared encounter. Please try again.'
      isLoadingShared.value = false
    })
  }

  function cleanup() {
    unsubEncounters?.()
    unsubEncounterById?.()
    unsubEncounterNpcs?.()
    unsubEncounters = null
    unsubEncounterById = null
    unsubEncounterNpcs = null
  }

  return {
    encountersAll,
    encountersCurrent,
    encountersNpcs,
    npcInDetail,
    isLoading,
    sharedEncounter,
    sharedEncounterNpcs,
    isLoadingShared,
    sharedError,
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
    updateTurnState,
    setNpcInDetail,
    generateShareLink,
    revokeShareLink,
    fetchSharedEncounter,
    cleanup,
  }
})
