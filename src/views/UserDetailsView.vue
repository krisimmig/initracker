<template>
  <div class="UserDetails">
    <v-row>
      <!-- Profile info card -->
      <v-col cols="12" md="4">
        <v-card variant="outlined">
          <v-card-title class="d-flex align-center pa-3 pb-0">
            <v-icon color="primary" class="mr-2">mdi-account</v-icon>
            <span class="text-subtitle-1 font-weight-bold">Account</span>
          </v-card-title>

          <v-card-text class="pa-3">
            <div class="d-flex flex-column align-center mb-4">
              <v-avatar size="80" class="mb-3">
                <v-img v-if="photoUrl" :src="photoUrl" alt="User Avatar" />
                <v-icon v-else size="48" color="primary">mdi-account-circle</v-icon>
              </v-avatar>
              <div class="text-h6 font-weight-bold">{{ displayName }}</div>
              <div class="text-body-2 text-medium-emphasis">{{ email }}</div>
            </div>
          </v-card-text>

          <v-card-actions class="pa-3 pt-0">
            <v-btn
              color="error"
              variant="outlined"
              prepend-icon="mdi-logout"
              block
              @click="handleLogout"
            >
              Sign out
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- Stats -->
      <v-col cols="12" md="8">
        <div class="text-subtitle-2 font-weight-bold text-medium-emphasis mb-2 text-uppercase">
          Stats
        </div>

        <v-row>
          <v-col cols="6" sm="3">
            <v-card variant="outlined" class="text-center pa-3">
              <div v-if="isLoading">
                <v-skeleton-loader type="heading" />
              </div>
              <template v-else>
                <div class="text-h4 font-weight-bold text-primary">{{ encounterCount }}</div>
                <div class="text-caption text-medium-emphasis">Encounters</div>
              </template>
            </v-card>
          </v-col>

          <v-col cols="6" sm="3">
            <v-card variant="outlined" class="text-center pa-3">
              <div v-if="isLoading">
                <v-skeleton-loader type="heading" />
              </div>
              <template v-else>
                <div class="text-h4 font-weight-bold text-primary">{{ characterCount }}</div>
                <div class="text-caption text-medium-emphasis">Characters</div>
              </template>
            </v-card>
          </v-col>

          <v-col cols="6" sm="3">
            <v-card variant="outlined" class="text-center pa-3">
              <div v-if="isLoading">
                <v-skeleton-loader type="heading" />
              </div>
              <template v-else>
                <div class="text-h4 font-weight-bold text-primary">{{ sharedEncounterCount }}</div>
                <div class="text-caption text-medium-emphasis">Shared</div>
              </template>
            </v-card>
          </v-col>

          <v-col cols="6" sm="3">
            <v-card variant="outlined" class="text-center pa-3">
              <div v-if="isLoading">
                <v-skeleton-loader type="heading" />
              </div>
              <template v-else>
                <div class="text-h4 font-weight-bold text-primary">{{ totalRounds }}</div>
                <div class="text-caption text-medium-emphasis">Total rounds</div>
              </template>
            </v-card>
          </v-col>

          <v-col cols="12">
            <v-card variant="outlined" class="pa-3">
              <div v-if="isLoading">
                <v-skeleton-loader type="heading" />
              </div>
              <template v-else>
                <div class="d-flex align-center ga-3">
                  <v-icon color="primary">mdi-clock-outline</v-icon>
                  <div>
                    <div class="text-body-2 text-medium-emphasis">In-game time played</div>
                    <div class="text-h6 font-weight-bold">{{ totalGameTime }}</div>
                  </div>
                </div>
              </template>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6">
            <v-card
              variant="outlined"
              class="pa-3"
              :to="longestEncounter ? { name: 'encounterDetails', params: { encounterId: longestEncounter.id } } : undefined"
            >
              <div v-if="isLoading">
                <v-skeleton-loader type="heading" />
              </div>
              <template v-else>
                <div class="d-flex align-center ga-3">
                  <v-icon color="primary">mdi-trophy-outline</v-icon>
                  <div class="min-width-0">
                    <div class="text-caption text-medium-emphasis">Longest encounter</div>
                    <div class="text-body-1 font-weight-bold text-truncate">{{ longestEncounter?.name ?? '—' }}</div>
                    <div class="text-body-2 text-medium-emphasis">{{ longestEncounter?.round ?? 0 }} rounds</div>
                  </div>
                </div>
              </template>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6">
            <v-card
              variant="outlined"
              class="pa-3"
              :to="mostParticipantsEncounter ? { name: 'encounterDetails', params: { encounterId: mostParticipantsEncounter.id } } : undefined"
            >
              <div v-if="isLoading">
                <v-skeleton-loader type="heading" />
              </div>
              <template v-else>
                <div class="d-flex align-center ga-3">
                  <v-icon color="primary">mdi-account-multiple</v-icon>
                  <div class="min-width-0">
                    <div class="text-caption text-medium-emphasis">Most participants</div>
                    <div class="text-body-1 font-weight-bold text-truncate">{{ mostParticipantsEncounter?.name ?? '—' }}</div>
                    <div class="text-body-2 text-medium-emphasis">{{ mostParticipantsCount }} combatants</div>
                  </div>
                </div>
              </template>
            </v-card>
          </v-col>
        </v-row>

        <!-- Quick links -->
        <div class="text-subtitle-2 font-weight-bold text-medium-emphasis mb-2 mt-4 text-uppercase">
          Quick links
        </div>

        <v-row>
          <v-col cols="12" sm="6">
            <v-card variant="outlined" :to="{ name: 'encounters' }" class="pa-3 d-flex align-center ga-3">
              <v-icon color="primary">mdi-sword-cross</v-icon>
              <div>
                <div class="text-body-2 font-weight-bold">Encounters</div>
                <div class="text-caption text-medium-emphasis">Manage your encounters</div>
              </div>
              <v-spacer />
              <v-icon color="medium-emphasis">mdi-chevron-right</v-icon>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6">
            <v-card variant="outlined" :to="{ name: 'characters' }" class="pa-3 d-flex align-center ga-3">
              <v-icon color="primary">mdi-account-group</v-icon>
              <div>
                <div class="text-body-2 font-weight-bold">Characters</div>
                <div class="text-caption text-medium-emphasis">Manage your characters</div>
              </div>
              <v-spacer />
              <v-icon color="medium-emphasis">mdi-chevron-right</v-icon>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUsersStore } from '@/store/useUsersStore'
import { db } from '@/store/firebase'
import { IEncounterEntity } from '@/types/encounters'

const usersStore = useUsersStore()

const photoUrl = ref(usersStore.userPhotoUrl)
const displayName = ref(usersStore.userString)
const email = ref(usersStore.userEmail)

// Stats — all populated once on mount
const isLoading = ref(true)

const encounterCount = ref(0)
const characterCount = ref(0)
const sharedEncounterCount = ref(0)
const totalRounds = ref(0)
const totalGameTime = ref('0s')
const longestEncounter = ref<IEncounterEntity | null>(null)
const mostParticipantsEncounter = ref<IEncounterEntity | null>(null)
const mostParticipantsCount = ref(0)

function formatGameTime(totalTurns: number): string {
  let remaining = totalTurns * 6 // seconds
  const days = Math.floor(remaining / 86400)
  remaining %= 86400
  const hours = Math.floor(remaining / 3600)
  remaining %= 3600
  const minutes = Math.floor(remaining / 60)
  const seconds = Math.floor(remaining % 60)
  const parts: string[] = []
  if (days) parts.push(`${days}d`)
  if (hours) parts.push(`${hours}h`)
  if (minutes) parts.push(`${minutes}m`)
  if (seconds || parts.length === 0) parts.push(`${seconds}s`)
  return parts.join(' ')
}

onMounted(async () => {
  const userUid = usersStore.userUid
  if (!userUid) return

  // Single parallel fetch: encounters + characters count
  const [encountersSnap, charactersSnap] = await Promise.all([
    db.collection(`users/${userUid}/encounters`).get(),
    db.collection(`users/${userUid}/characters`).get(),
  ])

  const encounters = encountersSnap.docs.map(d => d.data() as IEncounterEntity)

  // Compute encounter-level stats
  encounterCount.value = encounters.length
  characterCount.value = charactersSnap.size
  sharedEncounterCount.value = encounters.filter(e => e.shareId).length
  totalRounds.value = encounters.reduce((sum, e) => sum + (e.round ?? 0), 0)
  totalGameTime.value = formatGameTime(encounters.reduce((sum, e) => sum + (e.currentTurn ?? 0), 0))
  longestEncounter.value = encounters.reduce<IEncounterEntity | null>(
    (best, e) => (e.round ?? 0) > (best?.round ?? 0) ? e : best, null
  )

  // Fetch all NPC sub-collections in parallel to find the most-populated encounter
  if (encounters.length) {
    const npcSnaps = await Promise.all(
      encounters.map(e => db.collection(`users/${userUid}/encounters/${e.id}/npcs`).get())
    )
    let maxCount = -1
    npcSnaps.forEach((snap, i) => {
      if (snap.size > maxCount) {
        maxCount = snap.size
        mostParticipantsEncounter.value = encounters[i]
        mostParticipantsCount.value = snap.size
      }
    })
  }

  isLoading.value = false
})

function handleLogout() {
  usersStore.logoutUser()
}
</script>
