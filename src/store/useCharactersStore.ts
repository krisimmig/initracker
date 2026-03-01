import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db } from '@/store/firebase'
import { Character } from '@/classes/Character'
import { useUsersStore } from '@/store/useUsersStore'

export const useCharactersStore = defineStore('characters', () => {
  const characters = ref<Character[]>([])
  const isLoading = ref(false)

  let unsubCharacters: (() => void) | null = null

  function fetchCharacters() {
    if (unsubCharacters) return // Already listening

    const usersStore = useUsersStore()
    isLoading.value = true
    const userUid = usersStore.userUid

    unsubCharacters = db.collection(`users/${userUid}/characters`)
      .orderBy('meta.updatedAt', 'desc')
      .limit(50)
      .onSnapshot((data) => {
        isLoading.value = false
        characters.value = data.docs.map((doc) => new Character(doc.data() as Character))
      })
  }

  function cleanup() {
    unsubCharacters?.()
    unsubCharacters = null
  }

  return { characters, isLoading, fetchCharacters, cleanup }
})
