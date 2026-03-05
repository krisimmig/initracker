<template>
  <div class="CharacterHealthBar" @click.stop="showDialog = true">
    <div class="d-flex align-center ga-3">
      <v-progress-linear
        :model-value="hpInPercent"
        :color="hpColor"
        bg-color="surface-variant"
        height="6"
        rounded
        class="flex-grow-1"
      />
      <span class="text-caption text-medium-emphasis text-no-wrap">{{ hp }} / {{ maxHp }}</span>
    </div>
  </div>

  <v-dialog v-model="showDialog" max-width="400">
    <v-card>
      <v-card-title class="d-flex align-center justify-space-between pt-4 px-4">
        <span>Hit Points</span>
        <v-btn icon="mdi-close" variant="text" @click="closeDialog" />
      </v-card-title>
      <v-card-subtitle class="px-4 pb-0">{{ name }}</v-card-subtitle>

      <v-card-text class="px-4 pt-3 pb-2">
        <!-- Current HP display -->
        <div class="d-flex align-center justify-center ga-2 mb-4">
          <v-progress-circular
            :model-value="hpInPercent"
            :color="hpColor"
            bg-color="surface-variant"
            size="72"
            width="6"
          >
            <span class="text-body-2 font-weight-bold">{{ hp }}</span>
          </v-progress-circular>
          <div class="text-medium-emphasis text-caption">
            <div>of {{ maxHp }} HP</div>
          </div>
        </div>

        <v-divider class="mb-4" />

        <!-- Amount input with quick-adjust buttons -->
        <v-text-field
          v-model.number="hitPointChangeAmount"
          label="Amount"
          type="number"
          min="0"
          variant="outlined"
          density="compact"
          prepend-inner-icon="mdi-heart-pulse"
          hide-details
          class="mb-3"
        >
          <template #append>
            <div class="d-flex ga-1">
              <v-btn icon="mdi-minus" size="small" variant="text" :disabled="hitPointChangeAmount <= 0" @click.stop="hitPointChangeAmount = Math.max(0, hitPointChangeAmount - 1)" />
              <v-btn icon="mdi-plus" size="small" variant="text" @click.stop="hitPointChangeAmount++" />
            </div>
          </template>
        </v-text-field>

        <div class="d-flex ga-2 mb-2">
          <v-btn
            v-for="n in quickAmounts"
            :key="n"
            size="small"
            variant="tonal"
            class="flex-grow-1"
            @click.stop="hitPointChangeAmount = n"
          >{{ n }}</v-btn>
        </div>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4 ga-2">
        <v-btn
          color="error"
          variant="tonal"
          prepend-icon="mdi-heart-broken"
          :disabled="hitPointChangeAmount <= 0"
          @click="changeHitPoints()"
        >
          Damage
        </v-btn>
        <v-btn
          color="success"
          variant="tonal"
          prepend-icon="mdi-heart-plus"
          :disabled="hitPointChangeAmount <= 0"
          @click="changeHitPoints({ subtract: false })"
        >
          Heal
        </v-btn>
        <v-spacer />
        <v-btn
          variant="text"
          prepend-icon="mdi-heart"
          @click="resetHitPoints"
        >
          Full
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useEncountersStore } from '@/store/useEncountersStore'
import { useNpcsStore } from '@/store/useNpcsStore'
import { useActivityLogStore } from '@/store/useActivityLogStore'

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
const activityLog = useActivityLogStore()

const quickAmounts = [1, 5, 10, 20]

const hpInPercent = computed(() => {
  if (props.hp < 0) return 0
  if (props.maxHp && props.hp > props.maxHp) return 100
  return props.maxHp ? props.hp / (props.maxHp / 100) : 0
})

const hpColor = computed(() => {
  if (hpInPercent.value > 60) return 'success'
  if (hpInPercent.value > 25) return 'warning'
  return 'error'
})

function closeDialog() {
  showDialog.value = false
  hitPointChangeAmount.value = 0
}

function resetHitPoints() {
  const encounterId = encountersStore.encountersCurrentId()
  if (!encounterId || !props.maxHp) return

  activityLog.log('hp_change', `${props.name} fully healed (HP: ${props.hp} → ${props.maxHp})`, {
    actorName: props.name,
  })

  npcsStore.updateHitPointCurrent({
    encounterId,
    npcId: props.uuid!,
    newHitPoints: props.maxHp,
  })

  closeDialog()
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

  if (subtract) {
    activityLog.log('hp_change', `${props.name} took ${hitPointChangeAmount.value} damage (HP: ${props.hp} → ${newHitPoints})`, {
      actorName: props.name,
    })
  } else {
    activityLog.log('hp_change', `${props.name} healed ${hitPointChangeAmount.value} HP (HP: ${props.hp} → ${newHitPoints})`, {
      actorName: props.name,
    })
  }

  npcsStore.updateHitPointCurrent({
    encounterId,
    npcId: props.uuid!,
    newHitPoints,
  })

  closeDialog()
}
</script>

<style>
.CharacterHealthBar {
  cursor: pointer;
  border-radius: 4px;
  padding: 2px 4px;
  margin: 0 -4px;
  transition: background-color 100ms ease-in-out;
}

.CharacterHealthBar:hover {
  background-color: rgba(var(--v-theme-on-surface), 0.06);
}
</style>
