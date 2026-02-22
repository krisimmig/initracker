<template>
  <v-dialog v-model="showInitiativeInput" max-width="350px">
    <template v-slot:activator="{ props: activatorProps }">
      <v-list-item v-bind="activatorProps">
        Set initiative
      </v-list-item>
    </template>

    <v-card>
      <v-app-bar flat>
        <v-toolbar-title>Set initiative</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click.stop="showInitiativeInput = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-app-bar>
      <v-card-text>
        <div class="d-flex align-baseline mt-4">
          <v-text-field
            min="1"
            placeholder="Enter initiative"
            type="number"
            v-model.number="manuelInitiative"
            @keyup.enter="setInitiative"
          />
          <v-btn @click="setInitiative" class="ml-4">Set initiative</v-btn>
        </div>
      </v-card-text>
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

const showInitiativeInput = ref(false)
const manuelInitiative = ref(1)

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
}
</script>
