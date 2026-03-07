<template>
  <div>
    <div class="py-6">

      <!-- ===== GUEST EXPERIENCE ===== -->
      <template v-if="!isLoggedIn">

        <!-- Hero -->
        <section class="mb-14 text-center">
          <img src="@/assets/logo.svg" alt="Top Of The Round" style="height: 160px; width: auto;" class="mb-3" />
          <h2 class="app-name text-h5 mb-6">TOP OF THE ROUND</h2>
          <h1 class="text-h3 font-weight-bold mb-2">Run D&D Combat Without the Chaos</h1>
          <p class="text-h6 font-weight-regular text-medium-emphasis mb-6" style="max-width: 640px; margin: 0 auto;">
            <span class="app-name">TOP OF THE ROUND</span> tracks initiative, HP, conditions, and turns &mdash; so you can focus on the story.
          </p>

          <div class="d-flex justify-center ga-3 flex-wrap">
            <v-btn
              color="primary"
              size="large"
              variant="flat"
              prepend-icon="mdi-play-circle"
              :to="{ name: 'demo' }"
            >
              Try a Live Demo
            </v-btn>
            <v-btn
              size="large"
              variant="outlined"
              prepend-icon="mdi-account-plus"
              :to="{ name: 'login' }"
            >
              Create a Free Account
            </v-btn>
          </div>
        </section>

        <!-- Feature highlights -->
        <section class="mb-14">
          <v-row>
            <v-col v-for="feature in features" :key="feature.title" cols="12" md="4">
              <v-card variant="tonal" rounded="lg" class="pa-4 h-100">
                <div class="d-flex align-center mb-3">
                  <v-icon :icon="feature.icon" size="28" color="primary" class="mr-3" />
                  <span class="text-h6">{{ feature.title }}</span>
                </div>
                <p class="text-body-2 text-medium-emphasis mb-0">{{ feature.description }}</p>
              </v-card>
            </v-col>
          </v-row>
        </section>

        <v-divider class="mb-12" />

        <!-- Character Builder CTA (guest version) -->
        <section class="mb-12">
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
                Create detailed character sheets with every stat, ability score, and action in one place.
                Start from scratch or pick a monster from the library as your base. No account needed to try it out.
              </p>
            </v-card-text>

            <v-card-actions class="pa-4 pt-0 flex-wrap gap-2">
              <v-btn
                color="primary"
                variant="flat"
                prepend-icon="mdi-account-plus"
                :to="{ name: 'demoCharacterEdit', params: { type: 'base-empty' } }"
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

        <v-divider class="mb-12" />

        <!-- Sign-up nudge -->
        <section class="mb-12">
          <v-alert type="info" variant="tonal" icon="mdi-cloud-check" rounded="lg">
            <strong>Ready to save your work?</strong> Create a free account to keep your characters
            and encounters synced across devices.
            <template #append>
              <v-btn variant="flat" color="primary" size="small" :to="{ name: 'login' }">
                Sign up free
              </v-btn>
            </template>
          </v-alert>
        </section>

        <v-divider class="mb-12" />

        <!-- Feedback & Roadmap -->
        <section class="mb-6">
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
                <span class="app-name">TOP OF THE ROUND</span> is actively developed. If you hit a bug or have a feature idea, we want to
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
          </v-card>
        </section>

      </template>

      <!-- ===== LOGGED-IN EXPERIENCE (unchanged) ===== -->
      <template v-else>

        <!-- 1. Introduction -->
        <section class="mb-12">
          <div class="text-center mb-6">
            <img src="@/assets/logo.svg" alt="Top Of The Round" style="height: 140px; width: auto;" class="mb-3" />
            <h2 class="app-name text-h5 mb-2">TOP OF THE ROUND</h2>
            <p class="text-subtitle-1 text-medium-emphasis mb-0">
              Built for Dungeon Masters and players.
            </p>
          </div>
          <p class="text-body-1 mb-5">
            <span class="app-name">TOP OF THE ROUND</span> helps you run Dungeons &amp; Dragons combat sessions with less
            friction. Build your roster of characters and monsters, organise them
            into reusable encounters, and focus on what matters &mdash; the story.
          </p>

          <v-alert
            type="info"
            variant="tonal"
            icon="mdi-shield-sword"
            class="mb-3"
          >
            <strong>Less bookkeeping, more playing.</strong> <span class="app-name">TOP OF THE ROUND</span> tracks initiative
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

        <v-divider class="mb-12" />

        <!-- 2. Character Builder CTA -->
        <section class="mb-12">
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

        <v-divider class="mb-12" />

        <!-- 3. Encounters CTA -->
        <section class="mb-12">
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
                player characters, and it is ready to run. When the fight starts, <span class="app-name">TOP OF THE ROUND</span> tracks the
                initiative order and lets you update HP and conditions in real time.
                Every action is recorded in the activity log so you can review dice rolls, damage, and conditions at any point.
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

        <v-divider class="mb-12" />

        <!-- 4. Feedback & Roadmap -->
        <section class="mb-6">
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
                <span class="app-name">TOP OF THE ROUND</span> is actively developed. If you hit a bug or have a feature idea, we want to
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

      </template>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUsersStore } from '@/store/useUsersStore'
import CharacterLibrary from '@/components/characters/CharacterLibrary.vue'

const router = useRouter()
const usersStore = useUsersStore()
const showCharacterLibrary = ref(false)

const isLoggedIn = computed(() => usersStore.isLoggedIn)

function handleCharacterClicked(characterData: any) {
  showCharacterLibrary.value = false

  // Guest users go to the demo character editor
  const editRoute = isLoggedIn.value ? 'characterEdit' : 'demoCharacterEdit'

  if (characterData.uuid) {
    router.push({ name: editRoute, params: { type: 'base-character', uuid: characterData.uuid } })
  } else {
    router.push({ name: editRoute, params: { type: 'base-monster', uuid: characterData.id } })
  }
}

const features = [
  {
    icon: 'mdi-sort-ascending',
    title: 'Initiative Tracking',
    description: 'Roll initiative with one click, automatically sorted. Track rounds, turns, and elapsed game time.',
  },
  {
    icon: 'mdi-heart-pulse',
    title: 'HP & Conditions',
    description: 'Deal damage, heal, and apply D&D 5e conditions with auto-expiring durations. See who is standing at a glance.',
  },
  {
    icon: 'mdi-bookshelf',
    title: 'Character Library',
    description: 'Build reusable characters and monsters once, then drop them into any encounter. Hundreds of monsters included.',
  },
  {
    icon: 'mdi-text-box-outline',
    title: 'Activity Log',
    description: 'Every dice roll, HP change, condition, and turn is recorded. Review what happened at any point during the session.',
  },
]

const roadmap = [
  { icon: 'mdi-account-edit', text: 'Player-editable character sheets for your campaign' },
  { icon: 'mdi-music', text: 'Background music and ambient soundscapes' },
  { icon: 'mdi-city', text: 'DM tools: town generators, name generators, loot tables' },
]
</script>
