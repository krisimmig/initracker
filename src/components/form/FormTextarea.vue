<template>
  <div class="Form-item Form-item--input">
    <label
      :for="label"
      class="Form-label"
    >
      {{ label }}:
    </label>
    <textarea
      class="Form-textarea"
      :id="label"
      v-bind:value="value"
      v-on:input="$emit('input', $event.target.value)"
    ></textarea>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({})
export default class FormTextarea extends Vue {
  @Prop(String) public label!: string;
  @Prop(String) public value!: string;
}
</script>

<style>
</style>
