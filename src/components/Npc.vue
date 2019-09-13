<template>
  <div class="Npc" v-if="npcData">
    <h4 @click="showInDetail">{{ npcData.name }}</h4>
    <p>
       {{ npcData.hit_points }} HP | {{ npcData.size }} | {{ npcData.type }} | 
    </p>
    <p>Initiative: {{ npcData.initiative }}</p>
    <div>
      <span
        v-for="(status, index) in npcData.status"
        :key="index"
        class="Npc-status"
      >{{ statusString(status) }} - </span>
      <span class="Npc-status">+</span>
    </div>
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

  public statusString(enumValue: npcsModule.StatusTypes): string {
    return npcsModule.StatusTypes[enumValue];
  }

  public showInDetail() {
    if (this.npcData) {
      encountersModule.commitSetNpcInDetail(this.$store, this.npcData);
    }
  }

  get npcData(): npcsModule.NpcEntity | undefined {
    if (this.npc) {
      return this.npc;
    }

    return npcsModule.readGetNpcById(this.$store)(this.id);
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

.Npc-status {
  display: inline-block;
  color: blue;
  border: 1px solid blue;
  padding: 5px;
  margin-right: 5px;
}
</style>
