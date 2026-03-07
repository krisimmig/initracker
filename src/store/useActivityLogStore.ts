import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { nanoid } from 'nanoid'
import type { ActivityLogEntry, ActivityLogType } from '@/types/activityLog'

const STORAGE_KEY = 'activityLog'

function loadAllEntries(): Record<string, ActivityLogEntry[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export const useActivityLogStore = defineStore('activityLog', () => {
  const allEntries = ref<Record<string, ActivityLogEntry[]>>(loadAllEntries())
  const activeEncounterId = ref<string | null>(null)
  const isOpen = ref(false)

  const entries = computed(() => {
    if (!activeEncounterId.value) return []
    return allEntries.value[activeEncounterId.value] ?? []
  })

  const entriesReversed = computed(() => [...entries.value].reverse())

  watch(allEntries, (val) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
  }, { deep: true })

  function setEncounter(encounterId: string) {
    activeEncounterId.value = encounterId
  }

  function log(
    type: ActivityLogType,
    message: string,
    opts?: { actorName?: string; detail?: string; round?: number; turn?: number },
  ) {
    const id = activeEncounterId.value
    if (!id) return
    if (!allEntries.value[id]) {
      allEntries.value[id] = []
    }
    allEntries.value[id].push({
      id: nanoid(8),
      type,
      timestamp: Date.now(),
      round: opts?.round,
      turn: opts?.turn,
      actorName: opts?.actorName,
      message,
      detail: opts?.detail,
    })
  }

  function clear() {
    if (activeEncounterId.value) {
      allEntries.value[activeEncounterId.value] = []
    }
  }

  function toggle() {
    isOpen.value = !isOpen.value
  }

  return { entries, entriesReversed, isOpen, setEncounter, log, clear, toggle }
})
