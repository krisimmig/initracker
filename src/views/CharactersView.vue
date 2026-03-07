<template>
  <div class="Characters">
    <v-row>
      <!-- New character: first on mobile, right column on md+ -->
      <v-col cols="12" md="4" class="order-1 order-md-2">
        <v-card variant="outlined">
          <v-card-title class="d-flex align-center pa-3 pb-0">
            <v-icon color="primary" class="mr-2">mdi-account-plus</v-icon>
            <span class="text-subtitle-1 font-weight-bold">New character</span>
          </v-card-title>

          <v-card-text class="pa-3">
            <p class="text-body-2 text-medium-emphasis mb-3">
              Create a new character from scratch or base it on an existing one from the library.
            </p>
            <v-btn
              color="primary"
              variant="flat"
              prepend-icon="mdi-account-plus"
              block
              :to="{ name: 'characterEdit', params: { type: 'base-empty' } }"
            >
              New character sheet
            </v-btn>
          </v-card-text>

          <v-card-actions class="pa-3 pt-0">
            <v-btn
              color="primary"
              variant="outlined"
              prepend-icon="mdi-account-multiple-plus"
              block
              @click="showCharacterLibrary = true"
            >
              Open library
            </v-btn>
          </v-card-actions>
        </v-card>

        <v-dialog v-model="showCharacterLibrary" max-width="80vw">
          <CharacterLibrary
            @characterClicked="handleCharacterClicked"
            @closeClicked="showCharacterLibrary = false"
            buttonText="Use as base"
          />
        </v-dialog>
      </v-col>

      <!-- Character list: second on mobile, left column on md+ -->
      <v-col cols="12" md="8" class="order-2 order-md-1">
        <div v-if="isLoading">
          <v-card class="mb-3">
            <v-skeleton-loader class="mx-auto" type="heading, list-item-three-line" />
          </v-card>
          <v-card class="mb-3">
            <v-skeleton-loader class="mx-auto" type="heading, list-item-three-line" />
          </v-card>
        </div>

        <template v-if="!isLoading">
          <template v-if="characters.length > 0">
            <CharacterTeaser
              v-for="character in characters"
              :key="character.uuid"
              :character-data="character"
              @click="handleTeaserActioned(character)"
            >
              <v-btn size="small" icon variant="text" @click.stop="handleTeaserActioned(character)">
                <v-icon>mdi-pencil-outline</v-icon>
              </v-btn>
            </CharacterTeaser>
          </template>
          <v-alert variant="outlined" type="info" v-else>No custom characters found.</v-alert>
        </template>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCharactersStore } from '@/store/useCharactersStore'
import CharacterTeaser from '@/components/characters/CharacterTeaser.vue'
import { Character } from '@/classes/Character'
import CharacterLibrary from '@/components/characters/CharacterLibrary.vue'

const router = useRouter()
const charactersStore = useCharactersStore()

const showCharacterLibrary = ref(false)

const isLoading = computed(() => charactersStore.isLoading)
const characters = computed(() => charactersStore.characters)

onMounted(() => {
  charactersStore.fetchCharacters()
})

function handleTeaserActioned(characterData: Character) {
  router.push({
    name: 'characterEdit',
    params: { type: 'edit', uuid: characterData.uuid },
  })
}

function handleCharacterClicked(characterData: Character) {
  if (characterData.uuid) {
    router.push({
      name: 'characterEdit',
      params: { type: 'base-character', uuid: characterData.uuid },
    })
  } else {
    router.push({
      name: 'characterEdit',
      params: { type: 'base-monster', uuid: (characterData as any).id },
    })
  }
}
</script>

<style>
.CharacterList li {
  @apply text-gray-600 block;
}
</style>
