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
      <button @click="next">Next</button>
      <p>Current round: {{ currentRound }}</p>
      <p>Current npcIndex: {{ currentNpcIndex }}</p>
      <p>Total npcs: {{ totalNpcs }}</p>
    </div>

    <ul>
      <li
        v-for="(npc, index) in encounterData.npcs"
        :key="index"
      >
        <Npc
          :id="npc.id"
          :npc="npc"
          :isActive="index === currentNpcIndex - 1"
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

  get currentEncounter() {
    return encountersModule.readGetCurrentEncounter(this.$store);
  }

  get currentRound() {
    if (this.currentEncounter) {
      return this.currentEncounter.round;
    }
    return 1;
  }

  get currentNpcIndex() {
    if (this.currentEncounter) {
      return this.currentEncounter.activeEntityIndex;
    }
    return 1;
  }

  get totalNpcs() {
    if (this.currentEncounter) {
      return this.currentEncounter.npcs.length;
    } else {
      return 0;
    }
  }

  public removeNpcFromEncounter(npcID: string) {
    encountersModule.dispatchRemoveNpcFromEncounter(this.$store, {
      npcID,
      encounterId: this.id,
    });
  }

  public rollInitiaitive(): void {
    if (this.currentEncounter && this.currentEncounter.npcs) {
      this.currentEncounter.npcs.forEach((npc) => {
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

  public next(): void {
    if (this.currentEncounter) {
      const npc = this.currentEncounter.npcs[this.currentNpcIndex - 1];
      if (npc) {
        if (this.currentNpcIndex === this.currentEncounter.npcs.length) {
          encountersModule.dispatchUpdateRound(this.$store, {
            encounterId: this.id,
            newRoundIndex: this.currentRound + 1,
          });

          encountersModule.dispatchUpdateActiveEntityIndex(this.$store, {
            encounterId: this.id,
            activeEntityIndex: 1,
          });
        } else {
          encountersModule.dispatchUpdateActiveEntityIndex(this.$store, {
            encounterId: this.id,
            activeEntityIndex: this.currentNpcIndex + 1,
          });
        }
      } else {
        console.warn('No npc for next round found.');
      }
    }
  }
}
</script>

<style>
</style>
