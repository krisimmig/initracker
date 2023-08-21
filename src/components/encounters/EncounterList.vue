<template >
  <div >

    <div v-if="isLoading">
      <v-skeleton-loader
          class="mx-auto mb-2"
          type="heading"
      />
      <v-skeleton-loader type="text"/>
      <div class="d-flex mb-3">

        <v-skeleton-loader
            class="ml-auto ml-1"
            type="button"
        />
        <v-skeleton-loader
            class="ml-1"
            type="button"
        />
        <v-skeleton-loader
            class="ml-1"
            type="button"
        />
      </div >

      <v-card class="mb-3">
        <v-skeleton-loader
            class="mx-auto "
            type="card-heading, list-item-three-line"
        />
      </v-card >

      <v-card class="mb-3">
        <v-skeleton-loader
            class="mx-auto"
            type="card-heading, list-item-three-line"
        />
      </v-card >
    </div >

    <template v-if="!isLoading">
      <div class="Encounter">
        <h1 class="my-0 font-weight-light">{{ currentEncounter.name }}</h1 >
        <div class="d-flex align-center mb-2">
          <p class="subtitle-1 mb-0">
            Round <span class="font-weight-bold">{{ currentRound }}</span >
            Turn <span class="font-weight-bold">{{ currentEncounter.currentTurn }}</span >
            Elapsed time <span class="font-weight-bold">{{ elapsedTimeGame }}</span >
          </p >

          <v-spacer ></v-spacer >

          <div >
            <v-btn @click.stop="showCharacterLibrary = true">
              <v-icon left>mdi-account-multiple-plus</v-icon >
              Add
            </v-btn >
            <v-dialog
                v-model="showCharacterLibrary"
                max-width="80vw"
            >
              <CharacterLibrary
                  :encounterId="$route.params.encounterId"
                  @characterClicked="handleCharClicked"
                  @closeClicked="showCharacterLibrary = false"
                  button-text="Add"
              />
            </v-dialog >

            <v-btn
                @click="rollInitiative"
                :disabled="npcs.length === 0"
                v-if="currentRound === 1 && currentNpcIndex === 1"
                class="mx-2"
            >
              <v-icon left>mdi-dice-d20-outline</v-icon >
              Roll ini
            </v-btn >
            <v-btn
                @click="reset"
                class="mx-2"
                v-else
            >
              <v-icon left>mdi-backup-restore</v-icon >
              Reset
            </v-btn >

            <v-btn
                @click="nextTurn"
                :disabled="npcs.length === 0"
            >
              <v-icon left>mdi-skip-next</v-icon >
              Next
            </v-btn >
          </div >
        </div >

        <div v-if="npcs.length > 0">
          <perfect-scrollbar
              class="pr-4"
              style="margin-right: -16px;"
          >
            <div
                v-for="(npc, index) in npcs"
                :key="index"
            >
              <CharacterListItem
                  :npc="npc"
                  :isActive="currentNpcIndex - 1 === index"
                  :hasActed="currentNpcIndex - 1 > index"
                  :removable="true"
                  @remove="removeNpcFromEncounter(npc.uuid)"
              />
            </div >
          </perfect-scrollbar >
        </div >

        <v-alert
            type="info"
            v-if="npcs.length === 0"
        >
          Nobody is participating in this battle yet.
          Choose some combatants from the <b >Characters</b > library.
          <br >
          <v-btn
              class="mt-4"
              @click="showCharacterLibrary = true"
          >
            <v-icon left>mdi-account-multiple-plus</v-icon >
            Open character library
          </v-btn >
        </v-alert >
      </div >
    </template >
  </div >
</template >

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';
import { DiceRoll } from '@dice-roller/rpg-dice-roller';


import {
  readGetEncountersCurrent,
  readGetEncountersCurrentNpcs,
  dispatchRemoveNpcFromEncounter,
  dispatchUpdateRound,
  dispatchUpdateActiveEntityIndex,
  dispatchAddNpcToEncounter,
  readGetIsLoading,
} from '@/store/encountersModule';
import { dispatchUpdateInitiative, dispatchUpdateNpcConditionRound } from '@/store/npcsModule';
import CharacterListItem from '@/components/characters/CharacterListItem.vue';
import { modifierWithSign } from '@/utils/dnd';
import CharacterLibrary from "@/components/characters/CharacterLibrary.vue";

@Component({
  components: {
    CharacterListItem,
    Encounter: EncounterList,
    CharacterLibrary,
  },
})
export default class EncounterList extends Vue {
  @Prop({type: String, required: true}) public id!: string;

  public showCharacterLibrary: boolean = false;

  get isLoading() {
    return readGetIsLoading(this.$store);
  }

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
    const turn = this.currentEncounter.currentTurn ? this.currentEncounter.currentTurn : 1;
    const seconds = (turn - 1) * 6;
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

    const nextIndex = this.currentNpcIndex === this.npcs.length ? 1 : this.currentNpcIndex + 1;

    dispatchUpdateNpcConditionRound(this.$store, {
      encounterId: this.id,
      npcId: npc.uuid,
    });

    dispatchUpdateRound(this.$store, {
      encounterId: this.id,
      newRoundIndex: this.currentRound + 1,
    });

    dispatchUpdateActiveEntityIndex(this.$store, {
      encounterId: this.id,
      activeEntityIndex: nextIndex,
      currentTurn: this.currentEncounter.currentTurn + 1,
    });
  }

  public handleCharClicked(npcData) {
    if (!this.$route.params.encounterId) {
      return;
    }

    this.$toast(`Added ${npcData.name}`);
    dispatchAddNpcToEncounter(this.$store, {
      npcData: Object.assign({}, npcData),
      encounterId: this.$route.params.encounterId,
    });
  }
}
</script >

<style lang="scss">
.Encounter .ps {
  height: calc(100vh - 185px);
}
</style >
