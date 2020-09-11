<template>
  <div>
    <div @click="isCollapsed = !isCollapsed">
      <slot name="title"></slot>
    </div>

    <div v-if="!isCollapsed">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script lang='ts'>
  import { Component, Vue } from 'vue-property-decorator';

  @Component
  export default class Collapsable extends Vue {
    private isCollapsed: boolean = true;
  }
</script>

<style lang="scss">
</style>
