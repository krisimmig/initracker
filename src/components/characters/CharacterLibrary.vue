<template>
  <v-card class="CharactersLibrary" style="height: 85vh;" rounded="lg">
    <v-card-title class="d-flex align-center pa-4 pb-3">
      <v-icon color="primary" class="mr-2">mdi-account-group</v-icon>
      <span class="text-subtitle-1 font-weight-bold">Character library</span>
      <v-spacer />
      <v-btn icon variant="text" @click.stop="emit('closeClicked')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>

    <v-divider />

    <v-card-text class="pa-4 CharactersLibrary-body">
      <v-row>
        <v-col cols="6" class="d-flex flex-column">
          <div class="mb-3">
            <v-btn-toggle v-model="showType" mandatory color="primary" variant="outlined" density="compact" class="mb-3">
              <v-btn value="all">All</v-btn>
              <v-btn value="monsters">Monsters</v-btn>
              <v-btn value="characters">Custom</v-btn>
            </v-btn-toggle>
            <v-text-field
              label="Search by name"
              v-model="searchString"
              prepend-inner-icon="mdi-account-search"
              clearable
              hide-details="auto"
              variant="outlined"
              density="compact"
            />
          </div>

          <v-virtual-scroll
            bench="10"
            :items="filteredNpcs"
            height="calc(85vh - 230px)"
            item-height="130"
          >
            <template v-slot:default="{ item }">
              <div class="mr-4">
                <CharacterTeaser :characterData="item" @click="characterPreviewSelected(item)">
                  <v-btn size="small" icon variant="text" @click.stop="characterPreviewSelected(item)">
                    <v-icon>mdi-eye-outline</v-icon>
                  </v-btn>
                </CharacterTeaser>
              </div>
            </template>
          </v-virtual-scroll>
        </v-col>

        <v-col>
          <template v-if="previewCharacter">
            <div class="d-flex justify-end mb-3">
              <v-btn
                @click="emit('characterClicked', previewCharacter)"
                color="primary"
                variant="flat"
                prepend-icon="mdi-account-plus"
              >
                {{ buttonText }}
              </v-btn>
            </div>
            <CharacterDetails :characterData="previewCharacter" />
          </template>
          <v-alert type="info" variant="outlined" v-else>Select a character on the left.</v-alert>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import CharacterTeaser from '@/components/characters/CharacterTeaser.vue'
import { useNpcsStore } from '@/store/useNpcsStore'
import { useCharactersStore } from '@/store/useCharactersStore'
import { Character } from '@/classes/Character'
import CharacterDetails from '@/components/characters/CharacterDetails.vue'

const props = withDefaults(defineProps<{
  buttonText?: string
}>(), {
  buttonText: '',
})

const emit = defineEmits<{
  characterClicked: [character: Character]
  closeClicked: []
}>()

const searchString = ref('')
const showType = ref('all')
const previewCharacter = ref<Character | null>(null)

const npcsStore = useNpcsStore()
const charactersStore = useCharactersStore()

const npcs = computed(() => {
  if (showType.value === 'monsters') return npcsStore.npcs
  if (showType.value === 'characters') return charactersStore.characters
  return [...npcsStore.npcs, ...charactersStore.characters]
})

const filteredNpcs = computed(() => {
  if (!searchString.value) return npcs.value
  return npcs.value.filter((npc) => npc.name.toLowerCase().includes(searchString.value.toLowerCase()))
})

function characterPreviewSelected(npc: Character) {
  previewCharacter.value = npc
}

onMounted(() => {
  charactersStore.fetchCharacters()
})
</script>

<style>
.CharactersLibrary .CharacterDetails {
  max-height: calc(85vh - 160px);
  overflow-y: auto;
}
</style>
