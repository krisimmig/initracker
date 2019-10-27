<template>
  <div
    class="Npc" v-if="npcData"
    :class="{ 'is-active': isActive }"
  >
    <h4 @click="showInDetail">{{ npcData.name }}</h4>
    <p>
       <span @click="showHitPointChangeInput = true" class="Npc-HP">
          {{ npcData.hit_points_current }}/{{ npcData.hit_points }} HP
        </span> {{ npcData.armor_class }}AC | {{ npcData.size }} | {{ npcData.type }}
    </p>

    <div v-if="showHitPointChangeInput">
      <input
        type="number"
        v-model.number="hitPointChangeAmount"
        placeholder="Enter HP healed or damaged"
      >
      <button class="IT_Button" @click="increaseHitPoints">Heal</button>
      <button class="IT_Button IT-Buton--secondary" @click="decreaseHitPoints">Damage</button>
    </div>

    <p>Initiative: {{ npcData.initiative }}</p>
    <div v-if="!showInitiativeInput">
      <button
        class="It-Button"
        @click="showInitiativeInput = true"
      >
        Set initiative
      </button>
    </div>
    <div v-else>
      <input
        placeholde="Enter inititive"
        type="number"
        v-model.number="manuelInititive"
        @keyup.enter="setInititive"
      >
      <button
        class="It-Button"
        @click="setInititive"
      >
        Set initiative
      </button>
    </div>

    <div>
      <span
        v-for="(status, index) in npcData.status"
        @click="removeStatus(status)"
        :key="index"
        class="Npc-status"
      >{{ statusString(status) }} - </span>
    </div>

    <select
      v-model="newStatus"
      @change="addStatus"
    >
      <option disabled value="default">Select new state</option>
      <option
        v-for="(state, index) in npcStates"
        v-bind:value="state.id"
        :key="index"
      >{{ state.name }}</option>
    </select>
    <p v-if="removable" @click="$emit('remove')" class="IT-Button IT-Button--secondary">Remove</p>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';
import * as npcsModule from '../store/npcsModule';
import * as encountersModule from '@/store/encountersModule';

@Component
export default class Npc extends Vue {
  @Prop(String) public id!: string;
  @Prop(Boolean) public removable!: boolean;
  @Prop(Object) public npc!: npcsModule.NpcEntity;
  @Prop(Boolean) public isActive!: boolean;
  public newStatus: npcsModule.StatusTypes | 'default' = 'default';
  public manuelInititive: number = 0;
  public showInitiativeInput: boolean = false;
  public hitPointChangeAmount: number = 0;
  public showHitPointChangeInput: boolean = false;

  public statusString(enumValue: npcsModule.StatusTypes): string {
    return npcsModule.StatusTypes[enumValue];
  }

  public showInDetail() {
    if (this.npcData) {
      encountersModule.commitSetNpcInDetail(this.$store, this.npcData);
    }
  }

  public removeStatus(statusIndex: npcsModule.StatusTypes) {
    const encounterId = encountersModule.readGetEncounterId(this.$store);
    npcsModule.dispatchRemoveStatusFromNpc(this.$store, {
      encounterId,
      npcId: this.id,
      statusIndex,
    });
  }

  get npcData(): npcsModule.NpcEntity | undefined {
    if (this.npc) {
      return this.npc;
    }

    return npcsModule.readGetNpcById(this.$store)(this.id);
  }

  get npcStates() {
    return npcsModule.readGetNpcStates(this.$store);
  }

  public addStatus() {
    if (this.newStatus === 'default') { return; }
    const encounterId = encountersModule.readGetEncounterId(this.$store);

    npcsModule.dispatchUpdateStatus(this.$store, {
      encounterId,
      npcId: this.npc.id,
      newStatus: this.newStatus,
    });

    this.newStatus = 'default';
  }

  public setInititive() {
    npcsModule.dispatchUpdateInitiative(this.$store, {
      encounterId: encountersModule.readGetEncounterId(this.$store),
      npcId: this.id,
      newInitiative: this.manuelInititive,
    });
    this.showInitiativeInput = false;
    this.manuelInititive = 10;
  }

  public increaseHitPoints() {
    if (!this.npcData) { return; }
    const newHitPoints = Math.min(this.npcData.hit_points, this.npcData.hit_points_current + this.hitPointChangeAmount);
    npcsModule.dispatchUpdateHitPointCurrent(this.$store, {
      encounterId: encountersModule.readGetEncounterId(this.$store),
      npcId: this.id,
      newHitPoints,
    });
    this.showHitPointChangeInput = false;
    this.hitPointChangeAmount = 0;
  }

  public decreaseHitPoints() {
    if (!this.npcData) { return; }
    const newHitPoints = this.npcData.hit_points_current - this.hitPointChangeAmount;
    npcsModule.dispatchUpdateHitPointCurrent(this.$store, {
      encounterId: encountersModule.readGetEncounterId(this.$store),
      npcId: this.id,
      newHitPoints,
    });
    this.showHitPointChangeInput = false;
    this.hitPointChangeAmount = 0;
  }
}
</script>

<style>
.Npc {
  border: 1px solid gainsboro;
  background-color: ghostwhite;
  padding: 10px;
  margin-bottom: 15px;
}

.Npc.is-active {
  border-color: green;
  background-color: rgb(189, 255, 214);
}

.Npc-status {
  display: inline-block;
  color: blue;
  border: 1px solid blue;
  padding: 5px;
  margin-right: 5px;
}

.Npc-HP {
  display: inline-block;
  border: 1px solid #08199f;
  border-radius: 4px;
  padding: 2px 5px;
  background: #6262fe;
  color: white;
  cursor: pointer;
}
</style>
