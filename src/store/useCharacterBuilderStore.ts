import { defineStore } from 'pinia'
import { ref } from 'vue'
import { v1 as uuid } from 'uuid'
import { db } from '@/store/firebase'
import { Character } from '@/classes/Character'
import { useUsersStore } from '@/store/useUsersStore'

export const useCharacterBuilderStore = defineStore('characterBuilder', () => {
  const character = ref<Character>(new Character())
  const isLoading = ref(false)

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

    const userUid = usersStore.userUid
    const characterRef = db.doc(`users/${userUid}/characters/${char.uuid}`)
    characterRef.set({ ...char }, { merge: true })

    if (!newCharacter) {
      await updateCharacterInEncounters({ character: char })
    }

    if (newCharacter) {
      const router = (await import('@/router')).default
      router.push({ name: 'characterEdit', params: { uuid: char.uuid, type: 'edit' } })
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
    console.log('updating characterUuid', char.uuid_ref)

    const encountersQuerySnapshot = await db.collection(`users/${userUid}/encounters`).get()

    for (const encounterDoc of encountersQuerySnapshot.docs) {
      const npcsQuerySnapshot = await encounterDoc.ref
        .collection('npcs')
        .where('uuid_ref', '==', char.uuid_ref)
        .get()

      npcsQuerySnapshot.forEach((docRef) => {
        const encounterId = docRef.ref.parent.parent?.id
        const oldCharacterData = docRef.data()
        char.conditions = oldCharacterData.conditions
        char.hit_points_current = oldCharacterData.hit_points_current
        char.uuid = oldCharacterData.uuid
        char.initiative = oldCharacterData.initiative
        const charRef = db.doc(`users/${userUid}/encounters/${encounterId}/npcs/${docRef.id}`)
        charRef.set(char)
      })
    }
  }

  function setCharacter(newCharacter: Character) {
    character.value = newCharacter
  }

  return {
    character,
    isLoading,
    fetchCharacterById,
    fetchCharacterByUuid,
    saveCharacter,
    deleteCharacter,
    updateCharacterInEncounters,
    setCharacter,
  }
})
