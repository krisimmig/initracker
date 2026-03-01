import { defineStore } from 'pinia'
import { ref } from 'vue'
import { v1 as uuid } from 'uuid'
import { db } from '@/store/firebase'
import { Character } from '@/classes/Character'
import { useUsersStore } from '@/store/useUsersStore'

export const useCharacterBuilderStore = defineStore('characterBuilder', () => {
  const character = ref<Character>(new Character())
  const isLoading = ref(false)
  const isSaving = ref(false)

  async function fetchCharacterById({ id }: { id: string }) {
    isLoading.value = true
    const characterDoc = await db.doc(`monsters/${id}`)

    characterDoc.get().then((doc) => {
      if (doc.exists) {
        const characterData = doc.data() as Character
        character.value = new Character(characterData)
        isLoading.value = false
      } else {
        console.warn('No such document!')
        isLoading.value = false
      }
    }).catch((error) => {
      console.error('Error getting document:', error)
      isLoading.value = false
    })
  }

  async function fetchCharacterByUuid({ characterUuid }: { characterUuid: string }) {
    const usersStore = useUsersStore()
    isLoading.value = true
    const userUid = usersStore.userUid
    const characterRef = db.doc(`users/${userUid}/characters/${characterUuid}`)

    characterRef.get().then((doc) => {
      if (doc.exists) {
        character.value = doc.data() as Character
        isLoading.value = false
      } else {
        console.warn('No such document!')
        isLoading.value = false
      }
    }).catch((error) => {
      console.error('Error getting document:', error)
      isLoading.value = false
    })
  }

  async function saveCharacter({ char, newCharacter = false }: { char: Character; newCharacter: boolean }) {
    const usersStore = useUsersStore()
    if (newCharacter) {
      char.uuid = uuid()
      char.meta.createdAt = new Date()
    }

    if (!char.uuid_ref) {
      char.uuid_ref = uuid()
    }

    char.meta.updatedAt = new Date()

    isSaving.value = true
    try {
      const userUid = usersStore.userUid
      const characterRef = db.doc(`users/${userUid}/characters/${char.uuid}`)
      await characterRef.set({ ...char }, { merge: true })

      if (!newCharacter) {
        await updateCharacterInEncounters({ character: char })
      }

      if (newCharacter) {
        const router = (await import('@/router')).default
        router.push({ name: 'characterEdit', params: { uuid: char.uuid, type: 'edit' } })
      }
    } finally {
      isSaving.value = false
    }
  }

  async function deleteCharacter({ characterUuid }: { characterUuid: string }) {
    const usersStore = useUsersStore()
    const userUid = usersStore.userUid
    return db.doc(`users/${userUid}/characters/${characterUuid}`).delete()
  }

  async function updateCharacterInEncounters({ character: char }: { character: Character }) {
    const usersStore = useUsersStore()
    const userUid = usersStore.userUid

    // Single collectionGroup query instead of N+1 pattern
    const npcsSnapshot = await db.collectionGroup('npcs')
      .where('uuid_ref', '==', char.uuid_ref)
      .get()

    if (npcsSnapshot.empty) return

    const batch = db.batch()
    npcsSnapshot.forEach((docRef) => {
      // Only update NPCs owned by this user
      const pathParts = docRef.ref.path.split('/')
      if (pathParts[1] !== userUid) return

      const oldData = docRef.data()
      const updatedChar = { ...char }
      updatedChar.conditions = oldData.conditions
      updatedChar.hit_points_current = oldData.hit_points_current
      updatedChar.uuid = oldData.uuid
      updatedChar.initiative = oldData.initiative
      batch.set(docRef.ref, updatedChar)
    })
    await batch.commit()
  }

  function setCharacter(newCharacter: Character) {
    character.value = newCharacter
  }

  return {
    character,
    isLoading,
    isSaving,
    fetchCharacterById,
    fetchCharacterByUuid,
    saveCharacter,
    deleteCharacter,
    updateCharacterInEncounters,
    setCharacter,
  }
})
