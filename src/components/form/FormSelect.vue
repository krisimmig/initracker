<template>
  <div class="Form-item Form-item--input">

    <label
      :for="label"
      class="Form-label"
    >
      {{ label }}:
    </label>

    <select
      class="Form-select"
      v-on:change="$emit('input', $event.target.value)"
    >
      <option
        v-for="(option, index) in options"
        v-bind:value="option.value"
        :key="index"
        :selected="option.value == optionSelected"
      >
        {{ option.name }}
      </option>
    </select>

  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({})
export default class FormSelect extends Vue {
  @Prop({ type: String, required: true }) public label!: string;
  @Prop({ type: Array, required: true }) public options!: [];
  @Prop({ type: String, required: true }) public optionSelected!: string;
}
</script>

<style>
</style>
