<template>
  <div class="Form-item Form-item--input">
    <label
      :for="random"
      class="Form-label"
    >
      {{ label }}
    </label>
    <input
      class="Form-element Form-element--input"
      :id="random"
      v-bind="$attrs"
      v-bind:value="value"
      v-on="inputListeners"
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

  private inheritAttrs: boolean = false;

  public get isNumberField() {
    return typeof(this.value) === 'number';
  }

  public get random() {
    return Math.random();
  }

  public get inputListeners() {
    const vm = this;
    // `Object.assign` merges objects together to form a new object
    return Object.assign({},
      // We add all the listeners from the parent
      this.$listeners,
      // Then we can add custom listeners or override the
      // behavior of some listeners.
      {
        // This ensures that the component works with v-model
        input: (event) => vm.$emit('input', event.target.value),
      },
    );
  }
}
</script>
