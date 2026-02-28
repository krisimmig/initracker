<template>
  <div class="pb-20">

    <!-- Preview modal (visible only on small screens) -->
    <v-dialog v-model="previewOpen" fullscreen scrollable>
      <v-card>
        <v-toolbar color="primary" density="compact">
          <v-toolbar-title>Preview</v-toolbar-title>
          <v-spacer />
          <v-btn icon @click="previewOpen = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <CharacterDetails :characterData="character" />
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-row>
      <v-col cols="12" lg="8">
        <v-sheet class="CharacterBuilder-wrapper pa-4" elevation="0">
          <form class="Form">
            <v-text-field class="text-h6" v-model="character.name" label="Name" />
            <div class="d-flex">
              <v-text-field v-model="character.challenge_rating" label="Challenge rating" />
              <v-select
                variant="outlined"
                v-model="character.category"
                :items="optionsCategory"
                item-title="name"
                item-value="value"
                label="Category"
              />
            </div>

            <div class="d-flex">
              <v-select variant="outlined" v-model="character.size" :items="optionsSize" item-title="name" item-value="value" label="Size" />
              <v-select variant="outlined" v-model="character.type" :items="optionsTypes" item-title="name" item-value="value" label="Type" />
              <v-select variant="outlined" v-model="character.alignment" :items="optionsAlignment" item-title="name" item-value="value" label="Alignment" />
            </div>

            <div class="d-flex">
              <v-text-field v-model.number="character.armor_class" prepend-icon="mdi-shield" label="Armor Class" type="number" min="0" />
              <v-text-field v-model="character.armor_desc" label="Armor Description" />
            </div>

            <div class="d-flex">
              <v-text-field v-model.number="character.hit_points" prepend-icon="mdi-heart" label="Hit points" type="number" min="0" />
              <v-text-field v-model="character.hit_dice" label="Hit dice" />
            </div>

            <div class="d-flex">
              <v-text-field v-model.number="character.strength" label="STR" type="number" min="0" />
              <v-text-field v-model.number="character.dexterity" label="DEX" type="number" min="0" />
              <v-text-field v-model.number="character.constitution" label="CON" type="number" min="0" />
              <v-text-field v-model.number="character.intelligence" label="INT" type="number" min="0" />
              <v-text-field v-model.number="character.wisdom" label="WIS" type="number" min="0" />
              <v-text-field v-model.number="character.charisma" label="CHR" type="number" min="0" />
            </div>

            <p><b>Speed:</b></p>
            <div class="d-flex">
              <v-text-field v-model.number="character.speed.walk" label="Walk" type="number" min="0" />
              <v-text-field v-model.number="character.speed.swim" label="Swim" type="number" min="0" />
              <v-text-field v-model.number="character.speed.climb" label="Climb" type="number" min="0" />
              <v-text-field v-model.number="character.speed.fly" label="Fly" type="number" min="0" />
              <v-text-field v-model.number="character.speed.burrow" label="Burrow" type="number" min="0" />
            </div>

            <v-text-field v-model="character.senses" hint="e.g. darkvision 60 ft., passive Perception 12" label="Senses" />
            <v-text-field v-model="character.languages" hint="e.g. Common, Dwarvish" label="Languages" />
            <v-text-field v-model="character.damage_immunities" hint="e.g. lightning, poison" label="Damage Immunities" />
            <v-text-field v-model="character.damage_resistances" hint="e.g. cold; bludgeoning, piercing, and slashing from nonmagical weapons" label="Damage Resistances" />
            <v-text-field v-model="character.damage_vulnerabilities" hint="e.g. bludgeoning, fire" label="Damage Vulnerabilities" />
          </form>

          <CharacterAbilitiesEditor
            title="Special abilites"
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
            title="Legendary actions"
            type="legendary_actions"
            :abilities="character.legendary_actions"
            @change="handleAbilityChange"
          />

        </v-sheet>
      </v-col>

      <v-col class="d-none d-lg-block" lg="4">
        <CharacterDetails :characterData="character"/>
      </v-col>
    </v-row>

    <!-- Fixed bottom action bar -->
    <v-footer app elevation="4" class="py-3 justify-center">
      <v-btn-group elevation="1" rounded="lg">
        <v-btn color="success" @click="saveCharacter" :disabled="!hasChanged || builderStore.isSaving" :loading="builderStore.isSaving" prepend-icon="mdi-content-save">Save</v-btn>
        <v-btn color="error" v-if="!isNewCharacter" @click="deleteCharacter" prepend-icon="mdi-delete">Delete</v-btn>
        <v-btn class="d-lg-none" @click="previewOpen = true" prepend-icon="mdi-eye">Preview</v-btn>
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

<style>
.CharacterBuilder-wrapper .v-input {
  margin-right: 0.7rem;
}

.CharacterBuilder .Form {
  margin-bottom: 3rem;
}
</style>
