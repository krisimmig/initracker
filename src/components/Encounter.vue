<template>
  <div v-if="currentEncounter">
    <h3>{{ currentEncounter.name }}</h3>

    <div>
      <button
        @click="rollInitiative"
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
        v-for="(npc, index) in npcs"
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

  get currentEncounter() {
    return encountersModule.readGetEncountersCurrent(this.$store);
  }

  get currentRound() {
    return this.currentEncounter.round;
  }

  get currentNpcIndex() {
    if (this.currentEncounter) {
      return this.currentEncounter.activeEntityIndex;
    }
    return 1;
  }

  get npcs() {
    return encountersModule.readGetEncountersCurrentNpcs(this.$store);
  }

  get totalNpcs() {
    if (this.currentEncounter && this.npcs) {
      return this.npcs.length;
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

  public rollInitiative(): void {
    if (this.currentEncounter && this.npcs) {
      this.npcs.forEach((npc) => {
        const mod = stringifyModifier(calcModifier(npc.dexterity));
        const newInitiative = new DiceRoll(`1d20${mod}`);
        npcsModule.dispatchUpdateInitiative(this.$store, {
          encounterId: this.id,
          npcId: npc.uuid,
          newInitiative: newInitiative.total,
        });
      });
    }
  }

  public next(): void {
    if (this.currentEncounter) {
      const npc = this.npcs[this.currentNpcIndex - 1];
      if (npc) {
        if (this.currentNpcIndex === this.npcs.length) {
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
