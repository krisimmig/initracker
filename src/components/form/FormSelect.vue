<template>
  <div class="Form-item Form-item--input">
    <label
      :for="label"
      class="Form-label"
    >
      {{ label }}
    </label>

    <select
      class="Form-element Form-element--select"
      @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option
        v-for="(option, index) in options"
        :value="option.value"
        :key="index"
        :selected="option.value == optionSelected"
      >
        {{ option.name }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  options: Array<{ value: string; name: string }>
  optionSelected: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>
