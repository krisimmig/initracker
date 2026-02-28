<template>
  <v-dialog v-model="showInitiativeInput" max-width="320">
    <template #activator="{ props: activatorProps }">
      <v-list-item
        v-bind="activatorProps"
        prepend-icon="mdi-sword"
        title="Set initiative"
      />
    </template>

    <v-card>
      <v-card-title class="d-flex align-center justify-space-between pt-4 px-4">
        <span>Set initiative</span>
        <v-btn icon="mdi-close" variant="text" @click="showInitiativeInput = false" />
      </v-card-title>

      <v-card-text class="px-4 pb-2">
        <v-text-field
          v-model.number="manuelInitiative"
          label="Initiative"
          type="number"
          min="1"
          variant="outlined"
          density="compact"
          prepend-inner-icon="mdi-sword"
          autofocus
          @keyup.enter="setInitiative"
        />
      </v-card-text>

      <v-card-actions class="px-4 pb-4">
        <v-spacer />
        <v-btn variant="text" @click="showInitiativeInput = false">Cancel</v-btn>
        <v-btn color="primary" variant="tonal" prepend-icon="mdi-check" @click="setInitiative">Confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useEncountersStore } from '@/store/useEncountersStore'
import { useNpcsStore } from '@/store/useNpcsStore'

const props = defineProps<{
  uuid: string
  initiative: number
}>()

const emit = defineEmits<{ confirm: [] }>()

const showInitiativeInput = ref(false)
const manuelInitiative = ref(props.initiative ?? 1)

const encountersStore = useEncountersStore()
const npcsStore = useNpcsStore()

function setInitiative() {
  const encounterId = encountersStore.encountersCurrentId()
  if (!encounterId) return

  npcsStore.updateInitiative({
    encounterId,
    npcId: props.uuid,
    newInitiative: manuelInitiative.value,
  })

  manuelInitiative.value = 0
  showInitiativeInput.value = false
  emit('confirm')
}
</script>
