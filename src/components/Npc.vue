<template>
  <div
    class="Npc" v-if="npcData"
    :class="{ 'is-active': isActive }"
  >
    <h4 @click="showInDetail">{{ npcData.name }}</h4>
    <p>
       {{ npcData.hit_points }} HP | {{ npcData.size }} | {{ npcData.type }} | 
    </p>
    <p>Initiative: {{ npcData.initiative }}</p>
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
      placeholder="Select"
      @change="addStatus"
    >
      <option selected disabled>Add status</option>
      <option
        v-for="(state, index) in npcStates"
        v-bind:value="state.id"
        :key="index"
      >{{ state.name }}</option>
    </select>
    <p v-if="removable" @click="$emit('remove')" class="IT-Button">Remove</p>
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

    return npcsModule.dispatchUpdateStatus(this.$store, {
      encounterId,
      npcId: this.npc.id,
      newStatus: this.newStatus,
    });
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
  border-color: red;
}

.Npc-status {
  display: inline-block;
  color: blue;
  border: 1px solid blue;
  padding: 5px;
  margin-right: 5px;
}
</style>
