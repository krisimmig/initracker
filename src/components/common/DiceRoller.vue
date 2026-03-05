<template>
  <v-chip
    size="small"
    label
    variant="outlined"
    color="primary"
    class="DiceRoller px-1 mx-1 px-3"
    @click.stop="roll"
  >
    <v-icon size="x-small" start>mdi-dice-multiple</v-icon>
    {{ notation }}
  </v-chip>
</template>

<script setup lang="ts">
import { DiceRoll } from '@dice-roller/rpg-dice-roller'
import { useSnackbarStore } from '@/store/useSnackbarStore'
import { useActivityLogStore } from '@/store/useActivityLogStore'

const props = defineProps<{
  notation: string
}>()

const snackbar = useSnackbarStore()
const activityLog = useActivityLogStore()

function roll(): void {
  try {
    const normalizedNotation = props.notation.replace(/[\u2013\u2014]/g, '-')
    const result = new DiceRoll(normalizedNotation)
    snackbar.show(`Rolled ${props.notation}: <strong>${result.total}</strong> (${result.output})`, {
      timeout: 500000,
    })
    activityLog.log('dice_roll', `Rolled ${props.notation}: ${result.total}`, {
      detail: result.output,
    })
  } catch (e) {
    console.error('Invalid dice notation:', props.notation)
  }
}
</script>

<style scoped>
.DiceRoller {
  cursor: pointer;
  height: 20px;
  vertical-align: middle;
  transition: background-color 0.2s;
}
</style>
