<template>
  <div class="Form-item Form-item--input">
    <label
      :for="label"
      class="Form-label"
    >
      {{ label }}:
    </label>
    <textarea
      class="Form-element Form-element--textArea"
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
  @Prop({ type: String, required: true }) public label!: string;
  @Prop({ type: String, required: false }) public value!: string;
}
</script>

<style>
</style>
