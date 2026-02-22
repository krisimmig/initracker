<template>
  <div class="Form-item Form-item--input">
    <label
      :for="randomId"
      class="Form-label"
    >
      {{ label }}
    </label>
    <input
      class="Form-element Form-element--input"
      :id="randomId"
      v-bind="$attrs"
      :value="value"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      :type="isNumberField ? 'number' : ''"
      :placeholder="placeholder"
    >
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  label?: string
  value?: string | number
  placeholder?: string | number
  modelValue?: string | number
}>(), {
  placeholder: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  input: [value: string]
}>()

const isNumberField = computed(() => typeof props.value === 'number' || typeof props.modelValue === 'number')
const randomId = computed(() => String(Math.random()))
</script>
