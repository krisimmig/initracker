<template>
  <div class="Encounter-actionbar d-flex align-center mb-3">
    <div>
      <h1 class="text-h5 font-weight-light mb-0">{{ encounter.name }}</h1>
      <div class="d-flex ga-3 text-caption text-medium-emphasis">
        <span>Round <strong class="text-body-2 text-high-emphasis">{{ encounter.round }}</strong></span>
        <span>Turn <strong class="text-body-2 text-high-emphasis">{{ encounter.currentTurn }}</strong></span>
        <v-tooltip location="bottom" text="Elapsed time">
          <template #activator="{ props: tooltipProps }">
            <span v-bind="tooltipProps" class="d-flex align-center ga-1">
              <v-icon size="12">mdi-clock-outline</v-icon>
              {{ elapsedTimeGame }}
            </span>
          </template>
        </v-tooltip>
      </div>
    </div>

    <v-spacer />

    <v-btn
      color="primary"
      variant="tonal"
      prepend-icon="mdi-skip-next"
      :disabled="disableActions"
      @click="emit('nextTurn')"
    >
      Next
    </v-btn>

    <v-tooltip v-if="!demoStore.isDemoActive" location="bottom" text="Share with players">
      <template #activator="{ props: shareTooltipProps }">
        <v-btn
          v-bind="shareTooltipProps"
          :icon="encounter.shareId ? 'mdi-link-variant' : 'mdi-share-variant'"
          :color="encounter.shareId ? 'primary' : undefined"
          variant="text"
          class="ml-1"
          :loading="isGeneratingLink"
          @click="handleShareClick"
        />
      </template>
    </v-tooltip>

    <v-tooltip v-else location="bottom" text="Share with players">
      <template #activator="{ props: shareTooltipProps }">
        <v-btn
          v-bind="shareTooltipProps"
          icon="mdi-share-variant"
          variant="text"
          class="ml-1"
          @click="showDemoShareDialog = true"
        />
      </template>
    </v-tooltip>

    <v-menu location="bottom end" :close-on-content-click="true">
      <template #activator="{ props: activatorProps }">
        <v-btn icon="mdi-dots-vertical" variant="text" v-bind="activatorProps" class="ml-1" />
      </template>
      <v-list density="compact" nav>
        <v-list-item
          prepend-icon="mdi-account-multiple-plus"
          title="Add characters"
          @click="emit('addCharacters')"
        />
        <v-list-item
          v-if="isAtStart"
          prepend-icon="mdi-dice-d20-outline"
          title="Roll initiative"
          :disabled="disableActions"
          @click="emit('rollInitiative')"
        />
        <v-list-item
          v-else
          prepend-icon="mdi-backup-restore"
          title="Reset encounter"
          @click="emit('reset')"
        />
      </v-list>
    </v-menu>

    <!-- Demo share dialog -->
    <v-dialog v-model="showDemoShareDialog" max-width="480">
      <v-card>
        <v-card-title class="d-flex align-center pt-4 px-4">
          <v-icon class="mr-2">mdi-share-variant</v-icon>
          Share with Players
        </v-card-title>
        <v-card-text class="pa-4">
          <p class="text-body-1 mb-2">
            Share your encounter with players via a unique link. They can follow the initiative order and conditions in real time — no account needed on their end.
          </p>
          <p class="text-body-2 text-medium-emphasis">
            Create a free account to unlock sharing and save your encounters.
          </p>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0">
          <v-btn variant="text" @click="showDemoShareDialog = false">Close</v-btn>
          <v-spacer />
          <v-btn color="primary" variant="flat" :to="{ name: 'login' }">Create account</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Share dialog -->
    <v-dialog v-model="showShareDialog" max-width="480">
      <v-card>
        <v-card-title class="d-flex align-center pt-4 px-4">
          <v-icon class="mr-2">mdi-share-variant</v-icon>
          Share with Players
        </v-card-title>
        <v-card-subtitle class="px-4 pb-2">
          Players can view initiative order and conditions in real time.
        </v-card-subtitle>

        <v-divider />

        <v-card-text class="pa-4">
          <v-text-field
            :model-value="shareUrl"
            label="Player link"
            readonly
            variant="outlined"
            density="compact"
            prepend-inner-icon="mdi-link-variant"
            append-inner-icon="mdi-content-copy"
            @click:append-inner="copyShareLink"
            @focus="($event.target as HTMLInputElement).select()"
          />
          <p v-if="copied" class="text-caption text-success mt-1">
            <v-icon size="14">mdi-check</v-icon> Copied to clipboard
          </p>
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-4">
          <v-btn
            color="error"
            variant="text"
            prepend-icon="mdi-link-variant-off"
            @click="handleRevokeShare"
          >
            Stop sharing
          </v-btn>
          <v-spacer />
          <v-btn variant="text" @click="showShareDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { IEncounterEntity } from '@/types/encounters'
import { useEncountersStore } from '@/store/useEncountersStore'
import { useSnackbarStore } from '@/store/useSnackbarStore'
import { useDemoStore } from '@/store/useDemoStore'

const props = defineProps<{
  encounter: IEncounterEntity
  disableActions: boolean
}>()

const emit = defineEmits<{
  nextTurn: []
  addCharacters: []
  rollInitiative: []
  reset: []
}>()

const encountersStore = useEncountersStore()
const snackbar = useSnackbarStore()
const demoStore = useDemoStore()

const showShareDialog = ref(false)
const showDemoShareDialog = ref(false)
const isGeneratingLink = ref(false)
const copied = ref(false)

const isAtStart = computed(() => props.encounter.round === 1 && props.encounter.activeEntityIndex === 1)

const shareUrl = computed(() => {
  if (!props.encounter.shareId) return ''
  return `${window.location.origin}/play/${props.encounter.shareId}`
})

const elapsedTimeGame = computed((): string => {
  const seconds = ((props.encounter.currentTurn ?? 1) - 1) * 6
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(h)}:${pad(m)}:${pad(s)}`
})

async function handleShareClick() {
  if (props.encounter.shareId) {
    showShareDialog.value = true
    return
  }

  isGeneratingLink.value = true
  try {
    await encountersStore.generateShareLink({ encounterId: props.encounter.id })
    showShareDialog.value = true
  } catch (e) {
    console.error('Failed to generate share link:', e)
    snackbar.show('Failed to generate share link.')
  } finally {
    isGeneratingLink.value = false
  }
}

async function handleRevokeShare() {
  try {
    await encountersStore.revokeShareLink({ encounterId: props.encounter.id })
    showShareDialog.value = false
    snackbar.show('Share link revoked.')
  } catch (e) {
    console.error('Failed to revoke share link:', e)
    snackbar.show('Failed to revoke share link.')
  }
}

async function copyShareLink() {
  try {
    await navigator.clipboard.writeText(shareUrl.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    snackbar.show('Failed to copy link.')
  }
}
</script>
