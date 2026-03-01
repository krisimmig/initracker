<template>
  <div class="pb-20">

    <!-- Preview modal (visible only on small screens) -->
    <v-dialog v-model="previewOpen" fullscreen scrollable>
      <v-card>
        <v-card-title class="d-flex align-center justify-space-between px-4 pt-4">
          <span>Preview</span>
          <v-btn icon="mdi-close" variant="text" @click="previewOpen = false" />
        </v-card-title>
        <v-divider />
        <v-card-text>
          <CharacterDetails :characterData="character" />
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-row>
      <v-col cols="12" lg="8">
        <div class="pa-4">

          <!-- Identity -->
          <v-card variant="outlined" class="mb-6">
            <v-card-title class="text-subtitle-1 font-weight-bold px-4 pt-4 pb-2">Identity</v-card-title>
            <v-card-text class="pt-0">
              <v-text-field
                v-model="character.name"
                label="Name"
                variant="outlined"
                density="compact"
                class="mb-2"
              />
              <v-row dense>
                <v-col cols="6" sm="4">
                  <v-text-field
                    v-model="character.challenge_rating"
                    label="Challenge Rating"
                    variant="outlined"
                    density="compact"
                  />
                </v-col>
                <v-col cols="6" sm="4">
                  <v-select
                    v-model="character.category"
                    :items="optionsCategory"
                    item-title="name"
                    item-value="value"
                    label="Category"
                    variant="outlined"
                    density="compact"
                  />
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12" sm="4">
                  <v-select
                    v-model="character.size"
                    :items="optionsSize"
                    item-title="name"
                    item-value="value"
                    label="Size"
                    variant="outlined"
                    density="compact"
                  />
                </v-col>
                <v-col cols="12" sm="4">
                  <v-select
                    v-model="character.type"
                    :items="optionsTypes"
                    item-title="name"
                    item-value="value"
                    label="Type"
                    variant="outlined"
                    density="compact"
                  />
                </v-col>
                <v-col cols="12" sm="4">
                  <v-select
                    v-model="character.alignment"
                    :items="optionsAlignment"
                    item-title="name"
                    item-value="value"
                    label="Alignment"
                    variant="outlined"
                    density="compact"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Defense -->
          <v-card variant="outlined" class="mb-6">
            <v-card-title class="text-subtitle-1 font-weight-bold px-4 pt-4 pb-2">Defense</v-card-title>
            <v-card-text class="pt-0">
              <v-row dense>
                <v-col cols="4" sm="3">
                  <v-text-field
                    v-model.number="character.armor_class"
                    label="Armor Class"
                    type="number"
                    min="0"
                    variant="outlined"
                    density="compact"
                    prepend-inner-icon="mdi-shield-outline"
                  />
                </v-col>
                <v-col cols="8" sm="9">
                  <v-text-field
                    v-model="character.armor_desc"
                    label="Armor Description"
                    variant="outlined"
                    density="compact"
                    hint="e.g. natural armor, chain mail"
                  />
                </v-col>
                <v-col cols="4" sm="3">
                  <v-text-field
                    v-model.number="character.hit_points"
                    label="Hit Points"
                    type="number"
                    min="0"
                    variant="outlined"
                    density="compact"
                    prepend-inner-icon="mdi-heart-outline"
                  />
                </v-col>
                <v-col cols="8" sm="9">
                  <v-text-field
                    v-model="character.hit_dice"
                    label="Hit Dice"
                    variant="outlined"
                    density="compact"
                    hint="e.g. 10d10 + 40"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Ability scores -->
          <v-card variant="outlined" class="mb-6">
            <v-card-title class="text-subtitle-1 font-weight-bold px-4 pt-4 pb-2">Ability Scores</v-card-title>
            <v-card-text class="pt-0">
              <v-row dense>
                <v-col v-for="stat in abilityScores" :key="stat.key" cols="4" sm="2">
                  <v-text-field
                    v-model.number="character[stat.key]"
                    :label="stat.label"
                    type="number"
                    min="1"
                    max="30"
                    variant="outlined"
                    density="compact"
                    hide-details
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Speed -->
          <v-card variant="outlined" class="mb-6">
            <v-card-title class="text-subtitle-1 font-weight-bold px-4 pt-4 pb-2">Speed</v-card-title>
            <v-card-text class="pt-0">
              <v-row dense>
                <v-col v-for="speed in speedTypes" :key="speed.key" cols="4" sm="2">
                  <v-text-field
                    v-model.number="character.speed[speed.key]"
                    :label="speed.label"
                    type="number"
                    min="0"
                    variant="outlined"
                    density="compact"
                    hide-details
                    suffix="ft."
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Traits -->
          <v-card variant="outlined" class="mb-6">
            <v-card-title class="text-subtitle-1 font-weight-bold px-4 pt-4 pb-2">Traits</v-card-title>
            <v-card-text class="pt-0">
              <v-row dense>
                <v-col cols="12">
                  <v-text-field
                    v-model="character.senses"
                    label="Senses"
                    variant="outlined"
                    density="compact"
                    hint="e.g. darkvision 60 ft., passive Perception 12"
                    persistent-hint
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="character.languages"
                    label="Languages"
                    variant="outlined"
                    density="compact"
                    hint="e.g. Common, Dwarvish"
                    persistent-hint
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="character.damage_immunities"
                    label="Damage Immunities"
                    variant="outlined"
                    density="compact"
                    hint="e.g. lightning, poison"
                    persistent-hint
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="character.damage_resistances"
                    label="Damage Resistances"
                    variant="outlined"
                    density="compact"
                    hint="e.g. cold; bludgeoning, piercing, and slashing from nonmagical weapons"
                    persistent-hint
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="character.damage_vulnerabilities"
                    label="Damage Vulnerabilities"
                    variant="outlined"
                    density="compact"
                    hint="e.g. bludgeoning, fire"
                    persistent-hint
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <CharacterAbilitiesEditor
            title="Special Abilities"
            type="special_abilities"
            :abilities="character.special_abilities"
            @change="handleAbilityChange"
          />

          <CharacterAbilitiesEditor
            title="Actions"
            type="actions"
            :abilities="character.actions"
            @change="handleAbilityChange"
          />

          <CharacterAbilitiesEditor
            title="Legendary Actions"
            type="legendary_actions"
            :abilities="character.legendary_actions"
            @change="handleAbilityChange"
          />

        </div>
      </v-col>

      <v-col class="d-none d-lg-block" lg="4">
        <CharacterDetails :characterData="character" />
      </v-col>
    </v-row>

    <!-- Fixed bottom action bar -->
    <v-footer app elevation="4" class="py-3 justify-center">
      <v-btn-group elevation="1" rounded="lg">
        <v-btn
          color="success"
          variant="tonal"
          prepend-icon="mdi-content-save"
          :disabled="!hasChanged || builderStore.isSaving"
          :loading="builderStore.isSaving"
          @click="saveCharacter"
        >
          Save
        </v-btn>
        <v-btn
          v-if="!isNewCharacter"
          color="error"
          variant="tonal"
          prepend-icon="mdi-delete-outline"
          @click="deleteCharacter"
        >
          Delete
        </v-btn>
        <v-btn
          class="d-lg-none"
          variant="tonal"
          prepend-icon="mdi-eye-outline"
          @click="previewOpen = true"
        >
          Preview
        </v-btn>
      </v-btn-group>
    </v-footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { cloneDeep, isEqual } from 'lodash'
import { $enum } from 'ts-enum-util'
import { useRouter } from 'vue-router'
import { Character } from '@/classes/Character'
import CreatureTypes from '@/types/creatureTypes'
import { useCharacterBuilderStore } from '@/store/useCharacterBuilderStore'
import { useConfirmStore } from '@/store/useConfirmStore'
import { useSnackbarStore } from '@/store/useSnackbarStore'
import CharacterDetails from '@/components/characters/CharacterDetails.vue'
import { CharacterRaces } from '@/types/characterRaces'
import CharacterAlignments from '@/types/characterAlignments'
import CharacterSizes from '@/types/characterSizes'
import CharacterAbilitiesEditor from '@/components/characters/character-builder/CharacterAbilitiesEditor.vue'
import CharacterCategories from '@/types/characterCategories'

const props = withDefaults(defineProps<{
  character: Character
  isNewCharacter?: boolean
}>(), {
  isNewCharacter: false,
})

const emit = defineEmits<{
  change: [hasChanges: boolean]
}>()

const router = useRouter()
const builderStore = useCharacterBuilderStore()
const confirmStore = useConfirmStore()
const snackbarStore = useSnackbarStore()

const originalCharacter = ref<Character | null>(null)
const previewOpen = ref(false)

const abilityScores = [
  { key: 'strength', label: 'STR' },
  { key: 'dexterity', label: 'DEX' },
  { key: 'constitution', label: 'CON' },
  { key: 'intelligence', label: 'INT' },
  { key: 'wisdom', label: 'WIS' },
  { key: 'charisma', label: 'CHA' },
] as const

const speedTypes = [
  { key: 'walk', label: 'Walk' },
  { key: 'swim', label: 'Swim' },
  { key: 'climb', label: 'Climb' },
  { key: 'fly', label: 'Fly' },
  { key: 'burrow', label: 'Burrow' },
] as const

const hasChanged = computed(() => !isEqual(originalCharacter.value, props.character))

const optionsSize = computed(() => $enum(CharacterSizes).map((value, name) => ({ value, name })))
const optionsCategory = computed(() => $enum(CharacterCategories).map((value, name) => ({ value, name })))
const optionsTypes = computed(() => {
  const types = { ...CreatureTypes, ...CharacterRaces }
  return $enum(types).map((name, value) => ({ value, name }))
})
const optionsAlignment = computed(() => $enum(CharacterAlignments).map((value) => ({ value, name: value })))

watch(() => props.character, () => {
  emit('change', !isEqual(originalCharacter.value, props.character))
}, { deep: true })

watch(originalCharacter, () => {
  emit('change', !isEqual(originalCharacter.value, props.character))
}, { deep: true })

async function saveCharacter(): Promise<void> {
  await builderStore.saveCharacter({ char: props.character, newCharacter: props.isNewCharacter })
  originalCharacter.value = cloneDeep(props.character)
  snackbarStore.show('Character saved successfully.')
}

async function deleteCharacter() {
  const result = await confirmStore.open({
    message: 'Do you want to delete this character?',
  })
  if (result) {
    await builderStore.deleteCharacter({ characterUuid: props.character.uuid })
    router.push({ name: 'characters' })
  }
}

function handleAbilityChange(payload: any) {
  const abilities = [...props.character[payload.type]]

  if (payload.remove) {
    abilities.splice(payload.index, 1)
    props.character[payload.type] = abilities
    return
  }

  const newAbility = { name: payload.name, desc: payload.desc }

  if (payload.new) {
    abilities.push(newAbility)
  } else {
    abilities[payload.index] = newAbility
  }

  props.character[payload.type] = abilities
}

onMounted(() => {
  originalCharacter.value = cloneDeep(props.character)
})
</script>


