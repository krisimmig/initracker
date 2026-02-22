<template>
  <div class="NpcCondition mt-3">
    <v-btn
      v-for="(condition, index) in conditions"
      @click="setSelectedCondition(condition.id)"
      :key="index"
      size="small"
      variant="outlined"
      color="secondary"
      class="mr-1 mb-1"
    >
      {{ condition.name }}
      <span v-if="condition.duration" class="ml-1">
        ({{ condition.duration }})
      </span>
    </v-btn>

    <v-btn
      @click="showConditionSelect = true"
      size="small"
      variant="text"
      color="primary"
      class="mb-1"
    >
      <v-icon start>mdi-plus</v-icon>
      <template v-if="conditions.length < 4"> condition</template>
    </v-btn>

    <v-dialog v-model="showConditionSelect" width="min(80vw, 900px)">
      <v-card>
        <v-app-bar flat>
          <v-toolbar-title>Set this characters status effects</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click.stop="showConditionSelect = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-app-bar>

        <v-card-text style="height: 500px;">
          <v-container>
            <v-row>
              <v-col>
                <div style="column-count: 2">
                  <div v-for="condition in npcConditions" :key="condition.id">
                    <v-btn
                      size="small"
                      variant="text"
                      @click="selectedCondition = condition"
                      :color="isActiveCondition(condition.id) ? 'primary' : ''"
                      :class="[{'text-decoration-underline': selectedCondition?.id === condition.id}, 'mb-2 mr-2']"
                    >
                      {{ condition.name }}
                    </v-btn>
                  </div>
                </div>
              </v-col>
              <v-col>
                <template v-if="selectedCondition">
                  <h4 class="title">{{ selectedCondition.name }}</h4>
                  <ul class="u-list mb-4 text-body-1">
                    <li v-for="(effect, index) in selectedCondition.effects" :key="index">{{ effect }}</li>
                  </ul>
                </template>
                <template v-else>
                  <v-alert type="info" variant="outlined">
                    Select a condition from the list to see more info.
                  </v-alert>
                </template>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <template v-if="selectedCondition">
            <div v-if="isActiveCondition(selectedCondition.id)">
              <v-btn
                color="primary"
                @click="removeCondition(selectedCondition.id)"
                class="mb-5 mr-3"
              >
                <v-icon start>mdi-minus</v-icon>
                Remove {{ selectedCondition.name }}
              </v-btn>
            </div>
            <div v-else class="d-flex align-middle">
              <v-text-field
                v-model="selectedCondition.duration"
                label="Duration (in Rounds)"
                class="pt-0 mt-0"
                prepend-inner-icon="mdi-clock"
                hint="Leave empty for permanent conditions"
              />
              <v-btn
                color="primary"
                style="width: 200px; margin: 0 1rem;"
                @click="addCondition(selectedCondition)"
              >
                <v-icon start>mdi-plus</v-icon>
                Add {{ selectedCondition.name }}
              </v-btn>
            </div>
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

<style lang="scss">
.NpcCondition-condition,
.NpcCondition-add {
  font-size: .8em;
  color: theme('colors.blue.600');
  cursor: pointer;
  margin-right: .7em;
  border: 1px solid theme('colors.blue.400');;
  border-radius: 1em;
  height: 1.4rem;
  display: inline-block;
  text-align: center;
  padding: 0 7px 3px 7px;
}

.NpcCondition-addText {
  display: inline-block;
}

.NpcCondition-condition {
  margin-right: .7em;
  cursor: pointer;
}

.NpcCondition-add:hover,
.NpcCondition-condition:hover {
  color: theme('colors.blue.100');
  border-color: theme('colors.blue.500');
  background-color: theme('colors.blue.600');
}
</style>
