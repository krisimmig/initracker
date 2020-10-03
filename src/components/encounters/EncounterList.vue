<template>
  <div v-if="currentEncounter" class="Encounter bg-white shadow-lg">
    <div class="border-b">
      <div class="Encounter-titleArea pt-4 pb-2 pl-4 relative">
      <h4 class="uppercase">{{ currentEncounter.name }}</h4>
      <div class="flex">
        <div class="font-light text-gray-500 text-sm pt-2">
          Round <span class="font-bold">{{ currentRound }}</span>
          Turn <span class="font-bold">{{ currentEncounter.currentTurn }}</span>
          Elapsed time <span class="font-bold">{{ elapsedTimeGame }}</span>
        </div>
        <div class="ml-auto">
          <Button
              @click="rollInitiative"
              :disabled="npcs.length === 0"
              v-if="currentRound === 1 && currentNpcIndex === 1"
          >
            Roll Initiative
          </Button>
          <Button
            is-danger
            @click="reset"
            v-else
          >
            Reset
          </Button>
          <div class="Encounter-nextButton" @click="nextTurn" :disabled="npcs.length < 2">
            <div class="text-3xl">»</div>
            <div class="pb-4 text-sm italic">Next turn</div>
          </div>
        </div>
      </div>
    </div>
    </div>

    <div class="Encounter-npcsListWrapper u-scrollBoxParent">
      <div class="Encounter-npcsListScrollBox u-scrollBoxChild">
        <ul
            v-if="npcs.length > 0"
            class="Encounter-npcsList divide-y divide-gray-300 border-b"
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
import Button from '@/components/common/Button.vue';

@Component({
  components: {
    Button,
    CharacterListItem,
    Encounter: EncounterList,
  },
})
export default class EncounterList extends Vue {
  @Prop({ type: String, required: true }) public id!: string;

  currentTurn: number = 0;

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
        currentTurn: 1,
      });

      // Reset round counter
      dispatchUpdateRound(this.$store, {
        encounterId: this.id,
        newRoundIndex: 1,
      });
    }
  }

  public get elapsedTimeGame(): string {
    const seconds = (this.currentEncounter.currentTurn ? this.currentEncounter.currentTurn : 1) * 6;
    const numHours = Math.floor(((seconds % 31536000) % 86400) / 3600);
    const numMinutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
    const numSeconds = (((seconds % 31536000) % 86400) % 3600) % 60;
    return `${numHours}:${numMinutes}:${numSeconds}`;
  }

  public reset(): void {
    dispatchUpdateRound(this.$store, {
      encounterId: this.id,
      newRoundIndex: 1,
    });

    dispatchUpdateActiveEntityIndex(this.$store, {
      encounterId: this.id,
      activeEntityIndex: 1,
      currentTurn: 1,
    });
  }

  public nextTurn(): void {
    const npc = this.npcs[this.currentNpcIndex - 1];

    if (!npc) {
      console.warn('No npc for next round found.');
      return;
    }

    if (this.currentNpcIndex === this.npcs.length) {
      dispatchUpdateRound(this.$store, {
        encounterId: this.id,
        newRoundIndex: this.currentRound + 1,
      });

      dispatchUpdateActiveEntityIndex(this.$store, {
        encounterId: this.id,
        activeEntityIndex: 1,
        currentTurn: this.currentEncounter.currentTurn + 1,
      });
    } else {
      dispatchUpdateActiveEntityIndex(this.$store, {
        encounterId: this.id,
        activeEntityIndex: this.currentNpcIndex + 1,
        currentTurn: this.currentEncounter.currentTurn + 1,
      });
    }
  }
}
</script>

<style lang="scss">
.Encounter-titleArea {
  padding-right: 116px !important;
}

.Encounter-npcsListWrapper {
  height: calc(100vh - 152px) !important;
}

.Encounter-npcsList > li:last-child {
  border-bottom: 1px solid theme('colors.gray.300');
}

.Encounter-roundIndicator {
  padding: 1px 7px;
  border-radius: 30%;
  background: theme('colors.blue.200');
  border: 1px solid theme('colors.blue.600');
}

.Encounter-nextButton {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  border-radius: 0;
  width: 100px;
  margin-bottom: 0;
  @apply
  text-blue-100
  border-blue-300
  transition
  duration-200
  ease-in-out
  bg-blue-600
  cursor-pointer
  text-center
  flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.Encounter-nextButton:hover {
  @apply bg-blue-300 text-blue-600 shadow-md;
}
</style>
