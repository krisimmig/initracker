<template>
  <div class="Form-item Form-item--input">
    <label
      :for="randomId"
      class="Form-label"
    >
      {{ label }}:
    </label>
    <textarea
      class="Form-element Form-element--textArea"
      :id="randomId"
      :value="value"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    ></textarea>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineProps<{
  label: string
  value?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const randomId = computed(() => String(Math.random()))
</script>
