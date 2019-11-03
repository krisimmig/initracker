<template>
  <div class="Form-item Form-item--input">
    <label
      :for="label"
      class="Form-label"
    >
      {{ label }}:
    </label>
    <input
      class="Form-input"
      :id="label"
      v-bind:value="value"
      v-on:input="$emit('input', $event.target.value)"
      :type="isNumberField ? 'number' : ''"
    >
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({})
export default class FormInput extends Vue {
  @Prop(String) public label!: string;
  @Prop() public value!: string | number;

  public get isNumberField() {
    return typeof(this.value) === 'number';
  }

}
</script>

<style>
</style>
