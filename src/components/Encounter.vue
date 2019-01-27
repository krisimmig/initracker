<template>
  <div v-if="encounterData">
    <p @click="showNpcsInEncounter = !showNpcsInEncounter">
      {{ encounterData.name }} -- ({{ encounterData.id }})
    </p>

    <ul v-if="showNpcsInEncounter && encounterHasNpcs()">
      <li
        v-for="npcID in encounterData.npcIDs"
        :key="npcID"
      >
        <Npc :id="npcID" :removable="true" v-on:remove="removeNpcFromEncounter(npcID)" />
      </li>
    </ul>

    <p v-if="showNpcsInEncounter && !encounterData.npcIDs">
      No Npcs in this encounter yet!
    </p>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';

import * as encountersModule from '../store/encountersModule';
import Npc from './Npc.vue';

@Component({
  components: { Npc },
})
export default class Encounter extends Vue {
  @Prop(String) public id!: string;

  public showNpcsInEncounter: boolean = false;

  get encounterData() {
    return encountersModule.readGetEncounterById(this.$store)(this.id);
  }

  public encounterHasNpcs(): boolean {
    if (this.encounterData) {
      return this.encounterData.npcIDs.length > 0;
    }
    return false;
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
