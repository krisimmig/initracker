<template>
  <div class="Npc">
    <p><strong>Name: {{ name }}</strong></p>
    <p v-if="id">{{ id }}</p>
    <p v-if="hit_dice">{{ hit_dice }}</p>
  </div>
</template>

<script lang='ts'>
// tslint:disable:variable-name
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class Npc extends Vue {
  @Prop(String) public name!: string;
  @Prop(String) public id!: string;
  @Prop(String) public hit_dice!: string;
}
</script>

<style>
.Npc {
  border: 1px solid gainsboro;
  background-color: ghostwhite;
  padding: 10px;
  margin-bottom: 15px;
}
</style>
