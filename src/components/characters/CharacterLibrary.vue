<template>
  <v-sheet class="CharactersLibrary" style="height: 85vh;">
    <v-app-bar flat>
      <v-toolbar-title>
        <v-icon class="mr-2 mb-2">mdi-account-group</v-icon>
        Character library
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click.stop="emit('closeClicked')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-app-bar>

    <div class="d-flex pa-4">
      <v-row>
        <v-col cols="6">
          <div>
            <div class="d-flex align-center">
              <v-icon class="mr-2">mdi-filter</v-icon>
              <v-btn @click="switchTab('all')" class="mr-2" variant="text" :color="showType === 'all' ? 'primary' : ''">All</v-btn>
              <v-btn @click="switchTab('monsters')" class="mr-2" variant="text" :color="showType === 'monsters' ? 'primary' : ''">Monsters</v-btn>
              <v-btn @click="switchTab('characters')" variant="text" :color="showType === 'characters' ? 'primary' : ''">Custom Characters</v-btn>
            </div>
            <v-text-field
              label="Search by name"
              v-model="searchString"
              prepend-icon="mdi-account-search"
              clearable
            />
          </div>

          <v-virtual-scroll
            bench="10"
            :items="filteredNpcs"
            height="calc(85vh - 205px)"
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
          <div v-if="previewCharacter" class="CharacterPreview">
            <v-btn
              @click="emit('characterClicked', previewCharacter)"
              color="primary"
              variant="flat"
              class="CharacterPreview-addButton mr-4"
            >
              {{ buttonText }}
            </v-btn>
            <CharacterDetails :characterData="previewCharacter"/>
          </div>
          <v-alert type="info" v-else>Select a character on the left.</v-alert>
        </v-col>
      </v-row>
    </div>
  </v-sheet>
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

function switchTab(type: string) {
  showType.value = type
}

function characterPreviewSelected(npc: Character) {
  previewCharacter.value = npc
}

onMounted(() => {
  charactersStore.fetchCharacters()
})
</script>

<style>
.CharactersLibrary .CharacterDetails {
  max-height: calc(85vh - 100px);
  overflow-y: auto;
}

.CharacterPreview {
  position: relative;
}

.CharacterPreview-addButton {
  position: absolute;
  z-index: 100;
  top: 1rem;
  right: 0;
}
</style>
