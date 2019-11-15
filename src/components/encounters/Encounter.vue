<template>
  <div v-if="currentEncounter">
    <h1>{{ currentEncounter.name }}</h1>
    <p>Current round: <b>{{ currentRound }}</b> | Total npcs: <b>{{ totalNpcs }}</b> | Time elapsed: <b>00:02:13</b></p>

    <div>
      <button @click="rollInitiative">Roll Ini</button>
      <button @click="next">Next</button>
    </div>

    <div class="Encounter-npcsListWrapper u-scrollBoxParent">
      <div class="Encounter-npcsListScrollBox u-scrollBoxChild">
        <ul class="Encounter-npcsList">
          <li v-for="(npc, index) in npcs" :key="index">
            <NpcListItem
              :npc="npc"
              :isActive="currentNpcIndex - 1 === index"
              :removable="true"
              @remove="removeNpcFromEncounter(npc.uuid)"
            />
          </li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';
import { DiceRoll } from 'rpg-dice-roller';

import {
  readGetEncountersCurrent,
  readGetEncountersCurrentNpcs,
  dispatchRemoveNpcFromEncounter,
  dispatchUpdateRound,
  dispatchUpdateActiveEntityIndex,
} from '@/store/encountersModule';
import { dispatchUpdateInitiative } from '@/store/npcsModule';
import NpcListItem from '../npcs/NpcListItem.vue';
import { calcModifier, stringifyModifier } from '@/utils/dnd';

@Component({
  components: { NpcListItem, Encounter },
})
export default class Encounter extends Vue {
  @Prop({ type: String, required: true }) public id!: string;

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

<style lang="scss">
Encounter-npcsListWrapper {
  max-height: calc(100vh - 200px);
  overflow-y: scroll;
}

.Encounter-npcsListWrapper {
  height: calc(100vh - 200px);
}
</style>
