import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db } from '@/store/firebase'
import { Character } from '@/classes/Character'
import { useUsersStore } from '@/store/useUsersStore'

export const useCharactersStore = defineStore('characters', () => {
  const characters = ref<Character[]>([])
  const isLoading = ref(false)

  function fetchCharacters() {
    const usersStore = useUsersStore()
    isLoading.value = true
    const userUid = usersStore.userUid

    db.collection(`users/${userUid}/characters`)
      .orderBy('meta.updatedAt', 'desc')
      .onSnapshot((data) => {
        isLoading.value = false
        characters.value = data.docs.map((doc) => new Character(doc.data() as Character))
      })
  }

  return { characters, isLoading, fetchCharacters }
})
