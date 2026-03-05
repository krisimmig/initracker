<template>
  <div>
    <DemoBanner />

    <div v-if="!isLoading">
      <CharacterBuilder
        :character="character"
        :is-new-character="type !== 'edit'"
        @change="changeHandler"
      />
    </div>

    <v-alert type="info" v-else>Loading..</v-alert>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import { v1 as uuidV1 } from 'uuid'
import CharacterBuilder from '@/components/characters/character-builder/CharacterBuilder.vue'
import DemoBanner from '@/components/demo/DemoBanner.vue'
import { useCharacterBuilderStore } from '@/store/useCharacterBuilderStore'
import { useConfirmStore } from '@/store/useConfirmStore'
import { useSnackbarStore } from '@/store/useSnackbarStore'
import { Character } from '@/classes/Character'

const STORAGE_KEY = 'yait_demo_characters'

const props = withDefaults(defineProps<{
  uuid?: string
  type?: string
}>(), {
  uuid: '',
  type: 'edit',
})

const router = useRouter()
const builderStore = useCharacterBuilderStore()
const confirmStore = useConfirmStore()
const snackbar = useSnackbarStore()

const hasUnsavedChanges = ref(false)

const isLoading = computed(() => builderStore.isLoading)
const character = computed(() => builderStore.character)

// Save originals for restoration
const originalSave = builderStore.saveCharacter
const originalDelete = builderStore.deleteCharacter
const originalFetchByUuid = builderStore.fetchCharacterByUuid

function getDemoCharacters(): Character[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveDemoCharacters(characters: Character[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(characters))
}

// Patch saveCharacter to use localStorage
builderStore.saveCharacter = async ({ char, newCharacter = false }) => {
  if (newCharacter) {
    char.uuid = uuidV1()
    char.meta.createdAt = new Date()
  }
  if (!char.uuid_ref) {
    char.uuid_ref = uuidV1()
  }
  char.meta.updatedAt = new Date()

  const characters = getDemoCharacters()
  const existingIndex = characters.findIndex((c) => c.uuid === char.uuid)
  if (existingIndex >= 0) {
    characters[existingIndex] = { ...char }
  } else {
    characters.push({ ...char })
  }
  saveDemoCharacters(characters)

  snackbar.show('Character saved locally. Sign up to keep it forever!', { timeout: 5000 })

  if (newCharacter) {
    router.push({ name: 'demoCharacterEdit', params: { uuid: char.uuid, type: 'edit' } })
  }
}

// Patch deleteCharacter to use localStorage
builderStore.deleteCharacter = async ({ characterUuid }) => {
  const characters = getDemoCharacters().filter((c) => c.uuid !== characterUuid)
  saveDemoCharacters(characters)
  router.push({ name: 'home' })
}

// Patch fetchCharacterByUuid to load from localStorage
builderStore.fetchCharacterByUuid = async ({ characterUuid }) => {
  builderStore.isLoading = true
  const characters = getDemoCharacters()
  const found = characters.find((c) => c.uuid === characterUuid)
  if (found) {
    builderStore.character = new Character(found as Character)
  } else {
    console.warn('Demo character not found:', characterUuid)
    builderStore.character = new Character()
  }
  builderStore.isLoading = false
}

onMounted(() => {
  switch (props.type) {
    case 'edit':
    case 'base-character':
      builderStore.fetchCharacterByUuid({ characterUuid: props.uuid })
      break
    case 'base-empty':
      builderStore.setCharacter(new Character())
      break
    case 'base-monster':
      // This reads from public `monsters` collection — works without auth
      builderStore.fetchCharacterById({ id: props.uuid })
      break
    default:
      break
  }
})

onUnmounted(() => {
  // Restore original methods
  builderStore.saveCharacter = originalSave
  builderStore.deleteCharacter = originalDelete
  builderStore.fetchCharacterByUuid = originalFetchByUuid
})

function changeHandler(hasChanges: boolean) {
  hasUnsavedChanges.value = hasChanges
}

onBeforeRouteLeave((to, from, next) => {
  if (hasUnsavedChanges.value) {
    confirmStore.open({
      title: 'Unsaved changes',
      message: 'You have unsaved changes. Are you sure you want to leave?',
    }).then((ok) => next(ok))
  } else {
    next()
  }
})
</script>
