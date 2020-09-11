<template>
  <svg :class="className" xmlns="http://www.w3.org/2000/svg" :title="title" :alt="title">
    <title v-if="title">{{ title }}</title>
    <use :xlink:href="iconPath" xmlns:xlink="http://www.w3.org/1999/xlink"/>
  </svg>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class SvgIcon extends Vue {
  @Prop({ default: 'placeholder' }) public name!: string;

  public get iconPath() {
    let icon = require(`@/assets/icons/${this.name}.svg`);
    if (Object.prototype.hasOwnProperty.call(icon, 'default')) {
      icon = icon.default;
    }

    return icon.url;
  }

  public get className() {
    return 'SvgIcon SvgIcon--' + this.name;
  }

  public get title() {
    return this.name + ' icon';
  }
}
</script>

<style>
  .SvgIcon {
    fill: currentColor;
    height: 1em;
    width: 1em;
  }
</style>
