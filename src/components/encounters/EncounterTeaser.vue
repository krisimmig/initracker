<template>
  <div class="mb-2">
    <!-- Display mode -->
    <v-card
      v-if="!isEditingName"
      variant="outlined"
      class="EncounterTeaser"
      @click="toEncounterView(id)"
    >
      <v-card-text class="pa-3 d-flex align-start">
        <div class="flex-grow-1 min-width-0">
          <div class="text-subtitle-1 font-weight-bold text-truncate">{{ name }}</div>
          <div class="text-caption text-medium-emphasis mb-2">
            Created {{ getReadableCreatedAt() || 'sometime in the past' }}
          </div>
          <div class="d-flex align-center gap-2 flex-wrap">
            <v-chip size="x-small" label color="primary" variant="tonal" prepend-icon="mdi-sword-cross">
              Round {{ round ?? 0 }}
            </v-chip>
          </div>
        </div>

        <div class="ml-2 flex-shrink-0 d-flex">
          <v-btn size="small" icon variant="text" @click.stop="renameEncounter()">
            <v-icon>mdi-pencil-outline</v-icon>
          </v-btn>
          <v-btn size="small" icon variant="text" color="error" @click.stop="deleteEncounter()">
            <v-icon>mdi-delete-outline</v-icon>
          </v-btn>
        </div>
      </v-card-text>
    </v-card>

    <!-- Edit name mode -->
    <v-card v-if="isEditingName" variant="outlined">
      <v-card-text class="pa-3">
        <v-text-field
          label="Edit encounter name"
          hide-details="auto"
          @keyup.enter="saveNewName"
          v-model="newName"
          autofocus
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click.stop="isEditingName = false" variant="text">Cancel</v-btn>
        <v-btn @click="saveNewName" variant="text" color="primary">Save</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useEncountersStore } from '@/store/useEncountersStore'
import { useConfirmStore } from '@/store/useConfirmStore'

const props = defineProps<{
  id: string
  name: string
  round?: number
  createdAt?: number
}>()

const router = useRouter()
const encountersStore = useEncountersStore()
const confirmStore = useConfirmStore()

const isEditingName = ref(false)
const newName = ref(props.name)

function toEncounterView(encounterId: string) {
  router.push({ name: 'encounterDetails', params: { encounterId: props.id } })
}

async function deleteEncounter() {
  const confirmed = await confirmStore.open({
    message: 'Do you want to delete this encounter?',
  })
  if (confirmed) {
    encountersStore.removeEncounter({ encounterId: props.id })
  }
}

async function saveNewName() {
  await encountersStore.updateName({ encounterId: props.id, newName: newName.value })
  isEditingName.value = false
}

function renameEncounter() {
  isEditingName.value = !isEditingName.value
}

function getReadableCreatedAt() {
  if (!props.createdAt) return false
  const date = new Date(props.createdAt)
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
}
</script>
