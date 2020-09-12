<template>
  <div v-if="currentEncounter" class="Encounter">
    <div class="mt-4 mb-2">
      <h1 class="text-xl font-bold">{{ currentEncounter.name }}</h1>
      <div class="flex">
        <div>Round <b>{{ currentRound }}</b></div>
        <div class="ml-auto">
          <button
              @click="rollInitiative"
              :disabled="npcs.length === 0"
              v-if="currentRound === 1"
          >
            Roll Initiative
          </button>
          <button
              @click="reset"
              v-if="currentRound > 1"
          >
            Reset
          </button>
          <button @click="next" :disabled="npcs.length < 2">Next</button>
        </div>
      </div>
    </div>

    <div class="Encounter-npcsListWrapper u-scrollBoxParent shadow-lg">
      <div class="Encounter-npcsListScrollBox u-scrollBoxChild bg-white ">
        <ul
            v-if="npcs.length > 0"
            class="Encounter-npcsList divide-y divide-gray-300"
        >
          <li v-for="(npc, index) in npcs" :key="index">
            <CharacterListItem
              :npc="npc"
              :isActive="currentNpcIndex - 1 === index"
              :removable="true"
              @remove="removeNpcFromEncounter(npc.uuid)"
            />
          </li>
        </ul>
        <p v-else class="u-tip text-gray-600">Nobody is participating in this battle yet. Choose some combatans from the <b>Monsters</b> and <b>Player Characters</b> on the left.</p>
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
import CharacterListItem from '@/components/characters/CharacterListItem.vue';
import { modifierWithSign } from '@/utils/dnd';

@Component({
  components: {
    CharacterListItem,
    Encounter: EncounterList,
  },
})
export default class EncounterList extends Vue {
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

  public removeNpcFromEncounter(npcID: string) {
    dispatchRemoveNpcFromEncounter(this.$store, {
      npcID,
      encounterId: this.id,
    });

    // Correct active entity index when removing single entity
    if (this.currentNpcIndex > this.npcs.length - 1) {
      dispatchUpdateActiveEntityIndex(this.$store, {
        encounterId: this.id,
        activeEntityIndex: (this.npcs.length - 1) || 1,
      });
    }
  }

  public rollInitiative(): void {
    if (this.currentEncounter && this.npcs) {
      this.npcs.forEach((npc) => {
        const mod = modifierWithSign(npc.dexterity);
        const newInitiative = new DiceRoll(`1d20${mod}`);
        dispatchUpdateInitiative(this.$store, {
          encounterId: this.id,
          npcId: npc.uuid,
          newInitiative: newInitiative.total,
        });
      });

      // Reset active entity index
      dispatchUpdateActiveEntityIndex(this.$store, {
        encounterId: this.id,
        activeEntityIndex: 1,
      });

      // Reset round counter
      dispatchUpdateRound(this.$store, {
        encounterId: this.id,
        newRoundIndex: 1,
      });
    }
  }

  public reset(): void {
    dispatchUpdateRound(this.$store, {
      encounterId: this.id,
      newRoundIndex: 1,
    });
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
.Encounter-npcsListWrapper {
  height: calc(100vh - 180px) !important;
}

.Encounter-npcsList > li:last-child {
  border-bottom: 1px solid theme('colors.gray.300');
}
</style>
