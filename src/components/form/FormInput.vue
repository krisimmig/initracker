<template>
  <div class="Form-item Form-item--input">
    <label
      :for="label"
      class="Form-label"
    >
      {{ label }}
    </label>
    <input
      class="Form-element Form-element--input"
      :id="label"
      v-bind:value="value"
      v-on:input="$emit('input', $event.target.value)"
      :type="isNumberField ? 'number' : ''"
      :placeholder="placeholder"
    >

  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({})
export default class FormInput extends Vue {
  @Prop({ type: String, required: false }) public label!: string;
  @Prop({ type: [Number, String], required: false }) public value!: string | number;
  @Prop({ type: [Number, String], required: false, default: '' }) public placeholder!: string | number;

  public get isNumberField() {
    return typeof(this.value) === 'number';
  }

}
</script>

<style lang="scss">
@import '@/scss/variables.scss';

</style>
