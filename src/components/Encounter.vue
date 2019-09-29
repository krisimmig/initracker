<template>
  <div v-if="encounterData">
    <h3>{{ encounterData.name }}</h3>

    <div>
      <button
        @click="rollInitiaitive"
        class="IT-Button"
      >
        Roll Ini
      </button>
    </div>

    <ul>
      <li
        v-for="(npc, index) in encounterData.npcs"
        :key="index"
      >
        <Npc
          :id="npc.id"
          :npc="npc"
          :removable="true" @remove="removeNpcFromEncounter(npc.id)"
        />
      </li>
    </ul>

  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';

import * as encountersModule from '../store/encountersModule';
import * as npcsModule from '../store/npcsModule';
import Npc from './Npc.vue';
import { calcModifier, stringifyModifier } from '../utils/dnd';
// require the dice-roller library
import { DiceRoll } from 'rpg-dice-roller';


@Component({
  components: { Npc, Encounter },
})
export default class Encounter extends Vue {
  @Prop(String) public id!: string;

  public showNpcsInEncounter: boolean = false;

  get encounterData() {
    return encountersModule.readGetEncounterById(this.$store)(this.id);
  }

  public removeNpcFromEncounter(npcID: string) {
    encountersModule.dispatchRemoveNpcFromEncounter(this.$store, {
      npcID,
      encounterId: this.id,
    });
  }

  public rollInitiaitive(): void {
    const encounter = encountersModule.readGetCurrentEncounter(this.$store);
    if (encounter && encounter.npcs) {
      encounter.npcs.forEach((npc) => {
        const mod = stringifyModifier(calcModifier(npc.dexterity));
        const newInitiative = new DiceRoll(`1d20${mod}`);
        console.log(`${npc.name} rolled ${newInitiative}`);
        npcsModule.dispatchUpdateInitiative(this.$store, {
          encounterId: this.id,
          npcId: npc.id,
          newInitiative: newInitiative.total,
        });
      });
    }
  }
}
</script>

<style>
</style>
