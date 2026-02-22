<template>
  <span>
    <template v-for="(part, index) in parsedParts" :key="index">
      <DiceRoller
        v-if="part.isDice"
        :notation="part.text"
      />
      <span v-else>{{ part.text }}</span>
    </template>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import DiceRoller from './DiceRoller.vue'

interface TextPart {
  text: string
  isDice: boolean
}

const props = defineProps<{
  text: string
}>()

const diceRegex = /(\b\d+d\d+(?:\s*[+\-\u2013\u2014]\s*\d+)?\b)/gi

const parsedParts = computed((): TextPart[] => {
  if (!props.text) return []

  const parts: TextPart[] = []
  const splitText = props.text.split(diceRegex)

  splitText.forEach((part) => {
    if (part.match(diceRegex)) {
      parts.push({ text: part, isDice: true })
    } else if (part !== '') {
      parts.push({ text: part, isDice: false })
    }
  })

  return parts
})
</script>
