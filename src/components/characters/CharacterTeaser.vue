<template>
  <div class="CharacterTeaser">
    <h3>CharacterTeaser</h3>
    <p>{{ name }}</p>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class CharacterTeaser extends Vue {
  @Prop(String) public name!: string;
}
</script>

<style>
</style>
