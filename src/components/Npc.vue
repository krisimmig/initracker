<template>
  <div class="Npc">
    <p>
      <strong>{{ name }}</strong> | 
      <a href="#" @click.prevent="addToEncounter"> + Add to encounter</a><br>
      <span v-if="type">Type: {{ type }}</span>
      <span v-if="size"> | Size: {{ size }}</span>
      <span v-if="challenge_rating"> | CR: {{ challenge_rating }}</span>
      <span v-if="hit_points"> | HP: {{ hit_points }}</span>
    </p>
  </div>
</template>

<script lang='ts'>
// tslint:disable:variable-name
import { Component, Vue, Prop } from 'vue-property-decorator';
import { INpc } from '@/store/npcsModule';

@Component
export default class Npc extends Vue {
  @Prop(String) public name!: string;
  @Prop(String) public id!: string;
  @Prop(String) public hit_dice!: string;
  @Prop(String) public challenge_rating!: string;
  @Prop(String) public size!: string;
  @Prop(String) public type!: string;
  @Prop(Number) public hit_points!: number;

  public fullInfo: INpc | null = null;

  public addToEncounter() {
    console.log('addToEncounter', this.id);
  }
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
