<template>
  <div>
    <PageTitle title="Welcome to YAIT" icon="mdi-home" />

    <v-container class="py-6" style="max-width: 1280px;">

      <!-- 1. Introduction -->
      <section class="mb-8">
        <h1 class="text-h4 font-weight-bold mb-1">Welcome to YAIT</h1>
        <p class="text-subtitle-1 text-medium-emphasis mb-4">
          Yet Another Initiative Tracker &mdash; built for Dungeon Masters and players.
        </p>
        <p class="text-body-1 mb-5">
          YAIT helps you run Dungeons &amp; Dragons combat sessions with less
          friction. Build your roster of characters and monsters, organise them
          into reusable encounters, and focus on what matters &mdash; the story.
        </p>

        <v-alert
          type="info"
          variant="tonal"
          icon="mdi-shield-sword"
          class="mb-3"
        >
          <strong>Less bookkeeping, more playing.</strong> YAIT tracks initiative
          order, HP, and conditions so you never lose the thread during a fight.
        </v-alert>

        <v-alert
          type="success"
          variant="tonal"
          icon="mdi-lightning-bolt"
          class="mb-0"
        >
          <strong>Pro tip:</strong> Build a library of reusable base characters
          and monsters once &mdash; then mix and match them into any encounter in seconds.
        </v-alert>
      </section>

      <v-divider class="mb-8" />

      <!-- 2. Character Builder CTA -->
      <section class="mb-8">
        <v-card variant="outlined" rounded="lg">
          <v-card-item>
            <template #prepend>
              <v-icon size="32" color="primary">mdi-account-group</v-icon>
            </template>
            <v-card-title class="text-h6">Character Builder</v-card-title>
            <v-card-subtitle>Build your roster of heroes, villains and monsters</v-card-subtitle>
          </v-card-item>

          <v-card-text>
            <p class="text-body-2 mb-0">
              Create detailed character sheets for player characters, NPCs and monsters.
              Every stat, ability score, condition and initiative value lives in one place.
              Start with a blank slate or save time by picking an existing character from
              the library as your base and customising from there.
            </p>
          </v-card-text>

          <v-card-actions class="pa-4 pt-0 flex-wrap gap-2">
            <v-btn
              color="primary"
              variant="flat"
              prepend-icon="mdi-account-plus"
              :to="{ name: 'characterEdit', params: { type: 'base-empty' } }"
            >
              Create from scratch
            </v-btn>
            <v-btn
              color="primary"
              variant="outlined"
              prepend-icon="mdi-bookshelf"
              @click="showCharacterLibrary = true"
            >
              Browse library
            </v-btn>
            <v-btn
              color="secondary"
              variant="text"
              prepend-icon="mdi-account-multiple"
              :to="{ name: 'characters' }"
            >
              My characters
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
      </section>

      <v-divider class="mb-8" />

      <!-- 3. Encounters CTA -->
      <section class="mb-8">
        <v-card variant="outlined" rounded="lg">
          <v-card-item>
            <template #prepend>
              <v-icon size="32" color="secondary">mdi-sword-cross</v-icon>
            </template>
            <v-card-title class="text-h6">Encounters</v-card-title>
            <v-card-subtitle>Plan battles and run them smoothly at the table</v-card-subtitle>
          </v-card-item>

          <v-card-text>
            <p class="text-body-2 mb-0">
              An encounter is a saved combat scene &mdash; give it a name, add your monsters and
              player characters, and it is ready to run. When the fight starts, YAIT tracks the
              initiative order and lets you update HP and conditions in real time.
              Save encounters to reuse them or tweak them for different parties.
            </p>
          </v-card-text>

          <v-card-actions class="pa-4 pt-0 flex-wrap gap-2">
            <v-btn
              color="secondary"
              variant="flat"
              prepend-icon="mdi-plus"
              :to="{ name: 'encounters' }"
            >
              Create an encounter
            </v-btn>
            <v-btn
              color="secondary"
              variant="outlined"
              prepend-icon="mdi-view-list"
              :to="{ name: 'encounters' }"
            >
              View all encounters
            </v-btn>
          </v-card-actions>
        </v-card>
      </section>

      <v-divider class="mb-8" />

      <!-- 4. Feedback & Roadmap -->
      <section class="mb-4">
        <v-card variant="outlined" rounded="lg">
          <v-card-item>
            <template #prepend>
              <v-icon size="32" color="info">mdi-bullhorn</v-icon>
            </template>
            <v-card-title class="text-h6">Feedback &amp; Roadmap</v-card-title>
            <v-card-subtitle>Help us build what you actually need</v-card-subtitle>
          </v-card-item>

          <v-card-text>
            <p class="text-body-2 mb-4">
              YAIT is actively developed. If you hit a bug or have a feature idea, we want to
              hear it. Your feedback directly shapes the roadmap.
            </p>

            <p class="text-overline mb-2">Coming up next</p>
            <v-list lines="one" density="compact" class="pa-0">
              <v-list-item
                v-for="item in roadmap"
                :key="item.text"
                :prepend-icon="item.icon"
              >
                {{ item.text }}
              </v-list-item>
            </v-list>
          </v-card-text>

          <v-card-actions class="pa-4 pt-0">
            <v-btn
              color="info"
              variant="flat"
              prepend-icon="mdi-message-text"
              :to="{ name: 'feedback' }"
            >
              Give feedback
            </v-btn>
          </v-card-actions>
        </v-card>
      </section>

    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import PageTitle from '@/components/common/PageTitle.vue'
import CharacterLibrary from '@/components/characters/CharacterLibrary.vue'

const router = useRouter()
const showCharacterLibrary = ref(false)

function handleCharacterClicked(characterData: any) {
  showCharacterLibrary.value = false
  if (characterData.uuid) {
    router.push({ name: 'characterEdit', params: { type: 'base-character', uuid: characterData.uuid } })
  } else {
    router.push({ name: 'characterEdit', params: { type: 'base-monster', uuid: characterData.id } })
  }
}

const roadmap = [
  { icon: 'mdi-link-variant', text: 'Share encounters with players via a unique URL' },
  { icon: 'mdi-account-edit', text: 'Player-editable character sheets for your campaign' },
  { icon: 'mdi-music', text: 'Background music and ambient soundscapes' },
  { icon: 'mdi-city', text: 'DM tools: town generators, name generators, loot tables' },
]
</script>
