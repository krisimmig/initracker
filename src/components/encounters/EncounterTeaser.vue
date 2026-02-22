<template>
  <div class="mb-3">
    <v-card hover v-if="!isEditingName" @click="toEncounterView(id)">
      <div>
        <v-card-title>{{ name }}</v-card-title>
        <v-card-subtitle>created {{ getReadableCreatedAt() }} | Rounds played: {{ round }}</v-card-subtitle>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn icon @click.stop="renameEncounter()">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon color="error" @click.stop="deleteEncounter()">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-card-actions>
      </div>
    </v-card>

    <v-card v-if="isEditingName">
      <v-card-text>
        <v-text-field
          label="Edit encounter name"
          hide-details="auto"
          @keyup.enter="saveNewName"
          v-model="newName"
        ></v-text-field>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
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

const props = defineProps<{
  id: string
  name: string
  round?: number
  createdAt?: number
}>()

const router = useRouter()
const encountersStore = useEncountersStore()

const isEditingName = ref(false)
const newName = ref(props.name)

function toEncounterView(encounterId: string) {
  router.push({ name: 'encounterDetails', params: { encounterId: props.id } })
}

function deleteEncounter() {
  encountersStore.removeEncounter({ encounterId: props.id })
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
