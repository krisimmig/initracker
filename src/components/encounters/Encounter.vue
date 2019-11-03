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
          :npc="npc"
          :isActive="index === currentNpcIndex - 1"
          :removable="true"
          @remove="removeNpcFromEncounter(npc.uuid)"
        />
      </li>
    </ul>

  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';

import {
  readGetEncountersCurrent,
  readGetEncountersCurrentNpcs,
  dispatchRemoveNpcFromEncounter,
  dispatchUpdateRound,
  dispatchUpdateActiveEntityIndex,
} from '@/store/encountersModule';
import { dispatchUpdateInitiative } from '@/store/npcsModule';
import Npc from '../npcs/Npc.vue';
import { calcModifier, stringifyModifier } from '@/utils/dnd';
// require the dice-roller library
import { DiceRoll } from 'rpg-dice-roller';


@Component({
  components: { Npc, Encounter },
})
export default class Encounter extends Vue {
  @Prop(String) public id!: string;

  public showNpcsInEncounter: boolean = false;

  get currentEncounter() {
    return readGetEncountersCurrent(this.$store);
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
    return readGetEncountersCurrentNpcs(this.$store);
  }

  get totalNpcs() {
    if (this.currentEncounter && this.npcs) {
      return this.npcs.length;
    } else {
      return 0;
    }
  }

  public removeNpcFromEncounter(npcID: string) {
    dispatchRemoveNpcFromEncounter(this.$store, {
      npcID,
      encounterId: this.id,
    });
  }

  public rollInitiative(): void {
    if (this.currentEncounter && this.npcs) {
      this.npcs.forEach((npc) => {
        const mod = stringifyModifier(calcModifier(npc.dexterity));
        const newInitiative = new DiceRoll(`1d20${mod}`);
        dispatchUpdateInitiative(this.$store, {
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
          dispatchUpdateRound(this.$store, {
            encounterId: this.id,
            newRoundIndex: this.currentRound + 1,
          });

          dispatchUpdateActiveEntityIndex(this.$store, {
            encounterId: this.id,
            activeEntityIndex: 1,
          });
        } else {
          dispatchUpdateActiveEntityIndex(this.$store, {
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
