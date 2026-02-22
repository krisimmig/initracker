<template>
  <div class="my-8">
    <div class="d-flex justify-space-between align-center">
      <h3>{{ title }}</h3>
      <v-spacer></v-spacer>
      <CharacterAbilityDialogue @change="handleChangeEvent($event)">
        <template #button>
          <v-btn color="primary" variant="text">
            <v-icon start>mdi-plus</v-icon> Add
          </v-btn>
        </template>
      </CharacterAbilityDialogue>
    </div>

    <v-divider class="mb-4"></v-divider>

    <p v-if="abilities.length === 0" class="text-grey">Nothing here, yet.</p>

    <ul style="list-style: none" class="ma-0 pa-0">
      <li
        v-for="(ability, index) in abilities"
        :key="`ability-${type}-${index}`"
      >
        <div class="d-flex">
          <p><strong>{{ ability.name }}.</strong> {{ ability.desc }}</p>
          <v-spacer />
          <CharacterAbilityDialogue :ability="ability" @change="handleChangeEvent($event, index)" class="mr-2">
            <template #button>
              <v-btn size="small" color="primary" variant="text">
                <v-icon start>mdi-pencil-outline</v-icon> Edit
              </v-btn>
            </template>
          </CharacterAbilityDialogue>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import CharacterAbilityDialogue from '@/components/characters/character-builder/CharacterAbilityDialogue.vue'

const props = defineProps<{
  type: string
  title: string
  abilities: Array<{ name: string; desc: string }>
}>()

const emit = defineEmits<{
  change: [payload: object]
}>()

function handleChangeEvent(payload: object, index: number | null = null): void {
  emit('change', { ...payload, index, type: props.type })
}
</script>
