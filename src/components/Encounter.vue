<template>
  <div @click="showNpcsInEncounter = !showNpcsInEncounter" v-if="encounterData">
    {{ encounterData.name }} -- ({{ encounterData.id }})

    <ul v-if="showNpcsInEncounter && encounterData.npcs && encounterData.npcs.length > 0">
      <li
        v-for="npc in encounterData.npcs"
        :key="npc"
      >
        <Npc :id="npc" />
      </li>
    </ul>

    <p v-if="showNpcsInEncounter && !encounterData.npcs">
      No Npcs in this encounter yet!
    </p>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';

import { INpc } from '../store/npcsModule';
import * as encountersModule from '../store/encountersModule';
import Npc from './Npc.vue';

@Component({
  components: { Npc },
})
export default class Encounter extends Vue {
  @Prop(String) public id!: string;

  public showNpcsInEncounter: boolean = false;

  get encounterData(): encountersModule.IEncounter | undefined {
    return encountersModule.readGetEncounterById(this.$store)(this.id);
  }
}
</script>

<style>
</style>
