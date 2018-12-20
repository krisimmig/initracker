<template>
  <div class="Npc" v-if="npcData">
    <p>
      {{ npcData.name }} ({{ npcData.id }}) | {{ npcData.size }} | {{ npcData.type }} | {{ npcData.hit_points }}
    </p>
  </div>
</template>

<script lang='ts'>
// tslint:disable:variable-name
import { Component, Vue, Prop } from 'vue-property-decorator';
import * as npcsModule from '../store/npcsModule';

@Component
export default class Npc extends Vue {
  @Prop(String) public id!: string;

  get npcData() {
    return npcsModule.readGetNpcById(this.$store)(this.id);
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
