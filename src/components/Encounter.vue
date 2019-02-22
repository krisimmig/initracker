<template>
  <div v-if="encounterData">
    <h3>
      {{ encounterData.name }}
    </h3>

    <ul>
      <li
        v-for="(npc, index) in encounterData.npcs"
        :key="index"
      >
        <Npc :id="npc.id" :npc="npc" :removable="true" v-on:remove="removeNpcFromEncounter(npc.id)" />
      </li>
    </ul>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';

import * as encountersModule from '../store/encountersModule';
import Npc from './Npc.vue';

@Component({
  components: { Npc, Encounter },
})
export default class Encounter extends Vue {
  @Prop(String) public id!: string;

  public showNpcsInEncounter: boolean = false;

  get encounterData() {
    console.log('get encounterData');
    return encountersModule.readGetEncounterById(this.$store)(this.id);
  }

  public removeNpcFromEncounter(npcID: string) {
    encountersModule.dispatchRemoveNpcFromEncounter(this.$store, {
      npcID,
      encounterId: this.id,
    });
  }
}
</script>

<style>
</style>
