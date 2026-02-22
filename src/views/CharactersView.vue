<template>
  <div class="Characters">
    <PageTitle title="Characters" subtitle="Create or edit your own monsters and characters" />

    <v-row>
      <v-col>
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
            <v-card
              hover
              v-for="character in characters"
              :key="character.uuid"
              class="pa-4 mb-3"
            >
              <CharacterTeaser :character-data="character" @click="handleTeaserActioned(character)">
                <v-btn variant="outlined" color="primary" @click="handleTeaserActioned(character)">
                  <v-icon start>mdi-pencil</v-icon>
                  Edit
                </v-btn>
              </CharacterTeaser>
            </v-card>
          </template>
          <v-alert variant="outlined" type="info" v-else>No custom characters found.</v-alert>
        </template>
      </v-col>

      <v-col cols="4">
        <v-card>
          <v-card-text class="text-body-1 text-center">
            <p>Create a new character from scratch:</p>
            <router-link :to="{ name: 'characterEdit', params: { type: 'base-empty' } }" style="text-decoration: none; color: inherit;">
              <v-btn color="primary">
                <v-icon start>mdi-account-plus</v-icon>
                New character sheet
              </v-btn>
            </router-link>
            <div class="d-flex my-4 align-center">
              <v-divider />
              <span class="px-4 font-weight-bold">or</span>
              <v-divider />
            </div>
            <p>Base your new character on an existing one from the library:</p>
            <v-btn @click="showCharacterLibrary = true" color="primary">
              <v-icon start>mdi-account-multiple-plus</v-icon>
              Open library
            </v-btn>
          </v-card-text>
          <v-dialog v-model="showCharacterLibrary" max-width="80vw">
            <CharacterLibrary
              @characterClicked="handleCharacterClicked"
              @closeClicked="showCharacterLibrary = false"
              buttonText="Use as base"
            />
          </v-dialog>
        </v-card>
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
import PageTitle from '@/components/common/PageTitle.vue'
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

<style lang="scss">
.CharacterList li {
  @apply text-gray-600 block;
}
</style>
