<template>
  <v-navigation-drawer
    v-model="activityLog.isOpen"
    location="right"
    temporary
    width="420"
  >
    <v-toolbar flat density="compact">
      <v-toolbar-title class="text-subtitle-1 font-weight-bold">Activity Log</v-toolbar-title>
      <v-spacer />
      <v-chip size="small" variant="tonal" class="mr-2">{{ activityLog.entries.length }}</v-chip>
      <v-btn icon="mdi-close" variant="text" size="small" @click="activityLog.toggle()" />
    </v-toolbar>

    <v-divider />

    <!-- Filters -->
    <div class="pa-3 pb-0">
      <v-chip-group v-model="activeFilter" mandatory selected-class="text-primary">
        <v-chip v-for="f in filters" :key="f.label" :value="f.label" size="small" variant="outlined">
          {{ f.label }}
        </v-chip>
      </v-chip-group>
    </div>

    <v-divider />

    <!-- Entries -->
    <div style="overflow-y: auto; height: calc(100% - 160px);">
      <v-list density="compact" class="py-0">
        <template v-if="filteredEntries.length > 0">
          <v-list-item
            v-for="entry in filteredEntries"
            :key="entry.id"
            :prepend-icon="iconMap[entry.type].icon"
            lines="two"
            class="py-1"
          >
            <template #prepend>
              <v-icon :color="iconMap[entry.type].color" size="small" />
            </template>
            <v-list-item-title class="text-body-2">{{ entry.message }}</v-list-item-title>
            <v-list-item-subtitle class="text-caption">
              <span>{{ formatTime(entry.timestamp) }}</span>
              <span v-if="entry.round" class="ml-2">R{{ entry.round }}<template v-if="entry.turn">/T{{ entry.turn }}</template></span>
            </v-list-item-subtitle>
            <v-list-item-subtitle v-if="entry.detail" class="text-caption text-medium-emphasis font-italic">
              {{ entry.detail }}
            </v-list-item-subtitle>
          </v-list-item>
        </template>
        <v-list-item v-else>
          <v-list-item-title class="text-body-2 text-medium-emphasis text-center py-6">
            No activity recorded yet.
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </div>

    <v-divider />

    <!-- Footer -->
    <v-toolbar flat density="compact">
      <v-btn
        size="small"
        variant="text"
        prepend-icon="mdi-delete-outline"
        :disabled="activityLog.entries.length === 0"
        @click="activityLog.clear()"
      >
        Clear
      </v-btn>
      <v-spacer />
      <v-btn
        size="small"
        variant="text"
        prepend-icon="mdi-content-copy"
        :disabled="activityLog.entries.length === 0"
        @click="copyToClipboard"
      >
        Copy
      </v-btn>
    </v-toolbar>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useActivityLogStore } from '@/store/useActivityLogStore'
import type { ActivityLogType } from '@/types/activityLog'

const activityLog = useActivityLogStore()

const iconMap: Record<ActivityLogType, { icon: string; color: string }> = {
  dice_roll: { icon: 'mdi-dice-multiple', color: 'primary' },
  hp_change: { icon: 'mdi-heart-pulse', color: 'error' },
  condition_add: { icon: 'mdi-alert-circle', color: 'warning' },
  condition_remove: { icon: 'mdi-alert-circle-check', color: 'info' },
  initiative_roll: { icon: 'mdi-dice-d20-outline', color: 'primary' },
  turn_advance: { icon: 'mdi-skip-next', color: '' },
  round_advance: { icon: 'mdi-sync', color: 'secondary' },
  character_add: { icon: 'mdi-account-plus', color: 'success' },
  character_remove: { icon: 'mdi-account-minus', color: 'error' },
  encounter_reset: { icon: 'mdi-backup-restore', color: 'warning' },
}

const filters = [
  { label: 'All', types: null },
  { label: 'Combat', types: ['hp_change', 'turn_advance', 'round_advance'] as ActivityLogType[] },
  { label: 'Rolls', types: ['dice_roll', 'initiative_roll'] as ActivityLogType[] },
  { label: 'Status', types: ['condition_add', 'condition_remove', 'character_add', 'character_remove'] as ActivityLogType[] },
]

const activeFilter = ref('All')

const filteredEntries = computed(() => {
  const filter = filters.find(f => f.label === activeFilter.value)
  const reversed = activityLog.entriesReversed
  if (!filter?.types) return reversed
  return reversed.filter(e => filter.types!.includes(e.type))
})

function formatTime(ts: number): string {
  const d = new Date(ts)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

async function copyToClipboard() {
  const text = activityLog.entries
    .map(e => {
      const time = formatTime(e.timestamp)
      const ctx = e.round ? ` [R${e.round}${e.turn ? `/T${e.turn}` : ''}]` : ''
      const detail = e.detail ? ` (${e.detail})` : ''
      return `${time}${ctx} ${e.message}${detail}`
    })
    .join('\n')

  try {
    await navigator.clipboard.writeText(text)
  } catch {
    // silently fail
  }
}
</script>
