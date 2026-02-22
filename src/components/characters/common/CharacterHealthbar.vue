<template>
  <div class="CharacterHealthBar">
    <div @click.stop="showDialog = true">
      <div class="d-flex align-center">
        <v-progress-linear
          :model-value="hpInPercent"
          color="red-darken-2"
          height="8"
          rounded
        >
        </v-progress-linear>
        <p class="ml-4 ma-0 text-no-wrap text-body-2">{{ hp }} / {{ maxHp }}</p>
      </div>
    </div>

    <v-dialog v-model="showDialog" max-width="450">
      <v-card>
        <v-app-bar flat>
          <v-toolbar-title>Update Healthpoints</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click.stop="showDialog = false; hitPointChangeAmount = 0">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-app-bar>
        <v-card-text>
          <div class="my-4 d-flex align-baseline">
            <v-text-field
              v-model="hitPointChangeAmount"
              hide-details
              type="number"
              class="mx-3"
              label="Amount"
              min="0"
            />

            <v-btn class="mx-1" :disabled="hitPointChangeAmount < 10" rounded variant="outlined" size="small" @click="hitPointChangeAmount = Number(hitPointChangeAmount) - 10">
              <v-icon start>mdi-minus</v-icon>
              10
            </v-btn>
            <v-btn class="mx-1" :disabled="hitPointChangeAmount <= 0" rounded variant="outlined" size="small" @click="hitPointChangeAmount = Number(hitPointChangeAmount - 1)">
              <v-icon start>mdi-minus</v-icon>
              1
            </v-btn>

            <v-btn class="mx-1" rounded variant="outlined" size="small" @click="hitPointChangeAmount = Number(hitPointChangeAmount) + 1">
              <v-icon start>mdi-plus</v-icon>
              1
            </v-btn>
            <v-btn class="mx-1" rounded variant="outlined" size="small" @click="hitPointChangeAmount = Number(hitPointChangeAmount) + 10">
              <v-icon start>mdi-plus</v-icon>
              10
            </v-btn>
          </div>

          <v-row class="mb-2">
            <v-col>
              <v-btn block @click="changeHitPoints()" color="error">
                <v-icon start>mdi-minus</v-icon>
                Damage
              </v-btn>
            </v-col>

            <v-col>
              <v-btn block @click="changeHitPoints({ subtract: false })" color="primary">
                <v-icon start>mdi-plus</v-icon>
                Heal
              </v-btn>
            </v-col>
          </v-row>

          <v-btn block @click="resetHitPoints()">
            <v-icon start>mdi-repeat</v-icon>
            Reset to full health
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useEncountersStore } from '@/store/useEncountersStore'
import { useNpcsStore } from '@/store/useNpcsStore'

const props = defineProps<{
  uuid?: string
  name?: string
  hp: number
  maxHp?: number
}>()

const showDialog = ref(false)
const hitPointChangeAmount = ref(0)

const encountersStore = useEncountersStore()
const npcsStore = useNpcsStore()

const hpInPercent = computed(() => {
  if (props.hp < 0) return 0
  if (props.maxHp && props.hp > props.maxHp) return 100
  return props.maxHp ? props.hp / (props.maxHp / 100) : 0
})

function resetHitPoints() {
  const encounterId = encountersStore.encountersCurrentId()
  if (!encounterId || !props.maxHp) return

  npcsStore.updateHitPointCurrent({
    encounterId,
    npcId: props.uuid!,
    newHitPoints: props.maxHp,
  })

  showDialog.value = false
  hitPointChangeAmount.value = 0
}

function changeHitPoints({ subtract } = { subtract: true }) {
  const encounterId = encountersStore.encountersCurrentId()
  if (!encounterId) return

  let newHitPoints: number
  if (subtract) {
    newHitPoints = props.hp - hitPointChangeAmount.value
  } else {
    newHitPoints = props.hp + hitPointChangeAmount.value
  }

  npcsStore.updateHitPointCurrent({
    encounterId,
    npcId: props.uuid!,
    newHitPoints,
  })

  showDialog.value = false
  hitPointChangeAmount.value = 0
}
</script>

<style lang="scss">
.CharacterHealthBar {
  border-radius: 3px;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  margin-left: -0.5rem;
  margin-right: -0.5rem;
  transition: background-color 100ms ease-in-out;
}

.CharacterHealthBar:hover {
  background-color: rgba(0,0,0,0.1);
}
</style>
