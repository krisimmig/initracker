<template>
  <div class="Npc" v-if="npcData">
    <p>
      {{ npcData.name }} ({{ npcData.id }}) | {{ npcData.size }} | {{ npcData.type }} | {{ npcData.hit_points }}
    </p>
    <p @click="showEncounterList = !showEncounterList">Add to encounter</p>
    <ul v-if="showEncounterList">
      <li
        v-for="encounter in encounters"
        :key="encounter.id"
        @click="addToEncounter(encounter.id)"
      >
        {{ encounter.name }}
      </li>
    </ul>
  </div>
</template>

<script lang='ts'>
// tslint:disable:variable-name
import { Component, Vue, Prop } from 'vue-property-decorator';
import * as npcsModule from '../store/npcsModule';
import * as encountersModule from '../store/encountersModule';

@Component
export default class NpcSearchResult extends Vue {
  @Prop(String) public id!: string;

  public showEncounterList: boolean = false;

  get npcData() {
    return npcsModule.readGetNpcById(this.$store)(this.id);
  }

  get encounters() {
    return encountersModule.readGetEncounters(this.$store);
  }

  public addToEncounter(encounterId: string) {
    if (!this.npcData) {
      return;
    }

    encountersModule.dispatchAddNpcToEncounter(this.$store, {
      npcId: this.npcData.id,
      encounterId,
    });
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
