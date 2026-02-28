<template>
  <div class="NpcCondition mt-3">
    <v-chip
      v-for="(condition, index) in conditions"
      :key="index"
      size="small"
      color="secondary"
      variant="outlined"
      class="mr-1 mb-1"
      @click="setSelectedCondition(condition.id)"
    >
      {{ condition.name }}
      <span v-if="condition.duration" class="ml-1">({{ condition.duration }})</span>
    </v-chip>

    <v-btn
      size="small"
      variant="text"
      color="primary"
      class="mb-1"
      @click="showConditionSelect = true"
    >
      <v-icon start>mdi-plus</v-icon>
      <template v-if="conditions.length < 4">condition</template>
    </v-btn>

    <v-dialog v-model="showConditionSelect" max-width="860">
      <v-card>
        <v-card-title class="d-flex align-center justify-space-between pt-4 px-4">
          <span>Status Effects</span>
          <v-btn icon="mdi-close" variant="text" @click="showConditionSelect = false" />
        </v-card-title>
        <v-card-subtitle class="px-4 pb-2">{{ name }}</v-card-subtitle>

        <v-divider />

        <v-card-text class="pa-4 pb-2">
          <!-- Word cloud -->
          <div class="d-flex flex-wrap ga-2 mb-4">
            <v-chip
              v-for="condition in npcConditions"
              :key="condition.id"
              :color="selectedCondition?.id === condition.id ? 'secondary' : isActiveCondition(condition.id) ? 'primary' : undefined"
              :variant="selectedCondition?.id === condition.id || isActiveCondition(condition.id) ? 'tonal' : 'outlined'"
              :prepend-icon="isActiveCondition(condition.id) ? 'mdi-check-circle' : undefined"
              size="default"
              @click="selectedCondition = condition"
            >
              {{ condition.name }}
            </v-chip>
          </div>

          <v-divider class="mb-4" />

          <!-- Condition detail -->
          <div style="min-height: 120px;">
            <template v-if="selectedCondition">
              <p class="text-subtitle-1 font-weight-bold mb-2">{{ selectedCondition.name }}</p>
              <p
                v-for="(effect, i) in selectedCondition.effects"
                :key="i"
                class="text-body-2 mb-2"
              >{{ effect }}</p>
            </template>
            <template v-else>
              <v-alert type="info" variant="tonal">
                Select a condition above to see its effects.
              </v-alert>
            </template>
          </div>
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-4">
          <template v-if="selectedCondition">
            <template v-if="isActiveCondition(selectedCondition.id)">
              <v-spacer />
              <v-btn
                color="error"
                variant="tonal"
                prepend-icon="mdi-minus-circle"
                @click="removeCondition(selectedCondition.id)"
              >
                Remove {{ selectedCondition.name }}
              </v-btn>
            </template>
            <template v-else>
              <v-text-field
                v-model="selectedCondition.duration"
                label="Duration (rounds)"
                density="compact"
                variant="outlined"
                prepend-inner-icon="mdi-clock-outline"
                hint="Leave empty for permanent"
                persistent-hint
                hide-details="auto"
                style="max-width: 220px;"
                type="number"
              />
              <v-spacer />
              <v-btn
                color="primary"
                variant="tonal"
                prepend-icon="mdi-plus-circle"
                @click="addCondition(selectedCondition)"
              >
                Add {{ selectedCondition.name }}
              </v-btn>
            </template>
          </template>
          <template v-else>
            <v-spacer />
            <v-btn variant="text" @click="showConditionSelect = false">Close</v-btn>
          </template>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { find } from 'lodash'
import { useEncountersStore } from '@/store/useEncountersStore'
import { useNpcsStore } from '@/store/useNpcsStore'
import { useSnackbarStore } from '@/store/useSnackbarStore'
import { ICondition, conditionList } from '@/types/conditionTypes'

const props = defineProps<{
  uuid: string
  name: string
  conditions: ICondition[]
}>()

const showConditionSelect = ref(false)
const npcConditions = ref<ICondition[]>(conditionList)
const selectedCondition = ref<ICondition | null>(null)

const encountersStore = useEncountersStore()
const npcsStore = useNpcsStore()
const snackbar = useSnackbarStore()

function isActiveCondition(conditionId: string): boolean {
  return !!find(props.conditions, (c) => c.id === conditionId)
}

function addCondition(condition: ICondition) {
  const encounterId = encountersStore.encountersCurrentId()
  if (!encounterId) return

  npcsStore.updateCondition({
    encounterId,
    npcId: props.uuid,
    newCondition: condition,
  })

  const rounds = condition.duration ? ` for ${condition.duration} rounds` : ''
  snackbar.show(`${props.name} is ${condition.name.toLowerCase()}${rounds}.`)
}

function setSelectedCondition(conditionId: string) {
  const condition = npcConditions.value.find((c) => c.id === conditionId)
  if (condition) {
    showConditionSelect.value = true
    selectedCondition.value = condition
  }
}

function removeCondition(conditionId: string) {
  const encounterId = encountersStore.encountersCurrentId()
  if (!encounterId) return

  npcsStore.removeConditionFromNpc({
    encounterId,
    npcId: props.uuid,
    conditionId,
  })

  const condition = npcConditions.value.find(({ id }) => id === conditionId)
  if (condition) {
    snackbar.show(`${props.name} is no longer ${condition.name.toLowerCase()}.`)
  }
}
</script>


