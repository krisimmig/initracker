<template>
  <v-card variant="outlined" class="my-6">
    <v-card-title class="d-flex align-center py-3 px-4">
      <span class="text-subtitle-1 font-weight-bold">{{ title }}</span>
      <v-spacer />
      <CharacterAbilityDialogue @change="handleChangeEvent($event)">
        <template #button>
          <v-btn color="primary" variant="text" size="small">
            <v-icon start>mdi-plus</v-icon> Add
          </v-btn>
        </template>
      </CharacterAbilityDialogue>
    </v-card-title>

    <v-divider />

    <v-list lines="two" class="pa-0">
      <v-list-item
        v-if="abilities.length === 0"
        subtitle="Nothing here, yet."
        class="text-medium-emphasis"
      />

      <template v-for="(ability, index) in abilities" :key="`ability-${type}-${index}`">
        <v-divider v-if="index > 0" />
        <v-list-item :subtitle="ability.desc">
          <template #title>
            <span class="font-weight-bold">{{ ability.name }}</span>
          </template>
          <template #append>
            <CharacterAbilityDialogue :ability="{ ...ability, new: ability.new ?? false }" @change="handleChangeEvent($event, index)">
              <template #button>
                <v-btn size="small" color="primary" variant="text" icon>
                  <v-icon>mdi-pencil-outline</v-icon>
                </v-btn>
              </template>
            </CharacterAbilityDialogue>
            <v-btn size="small" color="error" variant="text" icon @click="removeAbility(index)">
              <v-icon>mdi-delete-outline</v-icon>
            </v-btn>
          </template>
        </v-list-item>
      </template>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import CharacterAbilityDialogue from '@/components/characters/character-builder/CharacterAbilityDialogue.vue'
import { useConfirmStore } from '@/store/useConfirmStore'

const props = defineProps<{
  type: string
  title: string
  abilities: Array<{ name: string; desc: string; new?: boolean }>
}>()

const emit = defineEmits<{
  change: [payload: object]
}>()

const confirmStore = useConfirmStore()

function handleChangeEvent(payload: object, index: number | null = null): void {
  emit('change', { ...payload, index, type: props.type })
}

async function removeAbility(index: number): Promise<void> {
  const result = await confirmStore.open({
    message: 'Do you really want to delete this ability?',
  })
  if (result) {
    emit('change', { remove: true, index, type: props.type })
  }
}
</script>
