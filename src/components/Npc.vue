<template>
  <div
    class="Npc" v-if="npcData"
    :class="{ 'is-active': isActive }"
  >
    <p>
      <span @click="showInDetail"><b>{{ npcData.name }}</b></span>&nbsp;
      <span @click="showHitPointChangeInput = true" class="Npc-HP">
         {{ npcData.hit_points_current }}/{{ npcData.hit_points }} HP
      </span> {{ npcData.armor_class }}AC |
      <span @click="showInitiativeInput = true"><b>Ini: {{ npcData.initiative }}</b></span> | 

      <select
        v-model="newStatus"
        @change="addStatus"
        class="Npc-statusSelect"
      >
        <option disabled value="default">Select new state</option>
        <option
          v-for="(state, index) in npcStates"
          v-bind:value="state.id"
          :key="index"
        >{{ state.name }}</option>
      </select> | 
      <span v-if="removable" @click="$emit('remove')" style="color: red;"><b>X</b></span>
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

    <div v-if="showInitiativeInput">
      <input
        placeholde="Enter inititive"
        type="number"
        v-model.number="manuelInititive"
        @keyup.enter="setInititive"
      >
      <button @click="setInititive">
        Set initiative
      </button>
    </div>

    <div>
      <span
        v-for="(status, index) in npcData.status"
        @click="removeStatus(status)"
        :key="index"
        class="Npc-status"
      >{{ statusString(status) }}</span>
    </div>
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

  public addStatus() {
    if (this.newStatus === 'default') { return; }

    const encounterId = encountersModule.readGetEncountersCurrentId(this.$store);
    if (!encounterId) { return; }

    npcsModule.dispatchUpdateStatus(this.$store, {
      encounterId,
      npcId: this.npc.uuid,
      newStatus: this.newStatus,
    });

    this.newStatus = 'default';
  }

  public removeStatus(statusIndex: npcsModule.StatusTypes) {
    const encounterId = encountersModule.readGetEncountersCurrentId(this.$store);
    if (!encounterId) { return; }

    npcsModule.dispatchRemoveStatusFromNpc(this.$store, {
      encounterId,
      npcId: this.npc.uuid,
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

  public setInititive() {
    const encounterId = encountersModule.readGetEncountersCurrentId(this.$store);
    if (!encounterId) { return; }

    npcsModule.dispatchUpdateInitiative(this.$store, {
      encounterId,
      npcId: this.npc.uuid,
      newInitiative: this.manuelInititive,
    });
    this.showInitiativeInput = false;
    this.manuelInititive = 10;
  }

  public increaseHitPoints() {
    if (!this.npcData) { return; }
    const encounterId = encountersModule.readGetEncountersCurrentId(this.$store);
    if (!encounterId) { return; }

    const newHitPoints = Math.min(this.npcData.hit_points, this.npcData.hit_points_current + this.hitPointChangeAmount);
    npcsModule.dispatchUpdateHitPointCurrent(this.$store, {
      encounterId,
      npcId: this.npc.uuid,
      newHitPoints,
    });
    this.showHitPointChangeInput = false;
    this.hitPointChangeAmount = 0;
  }

  public decreaseHitPoints() {
    if (!this.npcData) { return; }

    const encounterId = encountersModule.readGetEncountersCurrentId(this.$store);
    if (!encounterId) { return; }

    const newHitPoints = this.npcData.hit_points_current - this.hitPointChangeAmount;
    npcsModule.dispatchUpdateHitPointCurrent(this.$store, {
      encounterId,
      npcId: this.npc.uuid,
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
  padding: 0px 20px 10px 19px;
  margin-bottom: 15px;
}

.Npc.is-active {
  border-color: green;
  background-color: rgb(189, 255, 214);
}

.Npc-status {
  display: inline-block;
  color: #ffffff;
  border: 1px solid blue;
  padding: 2px 7px;
  margin-right: 5px;
  border-radius: 12px;
  background-color: #6162fe;
}

.Npc-HP {
  display: inline-block;
  border: 1px solid #08199f;
  border-radius: 4px;
  padding: 2px 5px;
  background: #6e0ca3;
  color: white;
  cursor: pointer;
}
</style>
