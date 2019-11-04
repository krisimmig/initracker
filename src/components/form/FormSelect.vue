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
  @Prop(String) public label!: string;
  @Prop(Array) public options!: [];
  @Prop(String) public optionSelected!: string;
}
</script>

<style>
</style>
