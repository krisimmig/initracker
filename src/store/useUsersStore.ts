import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { firebase } from '@/store/firebase'
import { LoginCredentials } from '@/types/users'
import { useEncountersStore } from '@/store/useEncountersStore'
import { useCharactersStore } from '@/store/useCharactersStore'
import { useNpcsStore } from '@/store/useNpcsStore'

export const useUsersStore = defineStore('users', () => {
  const user = ref<firebase.User | null>(null)

  const isLoggedIn = computed(() => user.value !== null)

  const userString = computed(() => {
    if (!user.value) return null
    return user.value.displayName ? user.value.displayName : user.value.email
  })

  const userPhotoUrl = computed(() => {
    if (!user.value) return null
    return user.value.photoURL ? user.value.photoURL : false
  })

  const userEmail = computed(() => {
    if (!user.value) return null
    return user.value.email ? user.value.email : 'No email provided'
  })

  const userUid = computed(() => user.value ? user.value.uid : false)

  async function validateUser(loginCredentials: LoginCredentials): Promise<void> {
    try {
      const router = (await import('@/router')).default
      const response = await firebase.auth().signInWithEmailAndPassword(
        loginCredentials.email,
        loginCredentials.password,
      )
      user.value = response.user
      router.push({ name: 'home' })
    } catch (error) {
      console.warn('Error', error)
    }
  }

  async function logoutUser(): Promise<void> {
    try {
      // Tear down all Firestore listeners before signing out
      useEncountersStore().cleanup()
      useCharactersStore().cleanup()
      useNpcsStore().cleanup()

      const router = (await import('@/router')).default
      await firebase.auth().signOut()
      user.value = null
      router.push({ name: 'home' })
    } catch (error) {
      console.warn('Error', error)
    }
  }

  function loginUser(newUser: firebase.User) {
    user.value = newUser
  }

  return { user, isLoggedIn, userString, userPhotoUrl, userEmail, userUid, validateUser, logoutUser, loginUser }
})
