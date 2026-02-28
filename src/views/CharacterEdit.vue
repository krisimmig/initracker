<template>
  <div class="">
    <PageTitle
      title="Character editor"
      subtitle="Here you can create or edit an existing character."
      icon="mdi-pencil"
    />

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
import { ref, computed, onMounted } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import PageTitle from '@/components/common/PageTitle.vue'
import { useCharacterBuilderStore } from '@/store/useCharacterBuilderStore'
import { useConfirmStore } from '@/store/useConfirmStore'
import { Character } from '@/classes/Character'
import CharacterBuilder from '@/components/characters/character-builder/CharacterBuilder.vue'

const props = withDefaults(defineProps<{
  uuid?: string
  type?: string
}>(), {
  uuid: '',
  type: 'edit',
})

const builderStore = useCharacterBuilderStore()
const confirmStore = useConfirmStore()

const hasUnsavedChanges = ref(false)

const isLoading = computed(() => builderStore.isLoading)
const character = computed(() => builderStore.character)

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
      builderStore.fetchCharacterById({ id: props.uuid })
      break
    default:
      break
  }
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
