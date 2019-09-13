<template>
  <div class="Npc" v-if="npcData">
    <v-popover placement="right-end" :autoHide="true" trigger="click">
      <h4>{{ npcData.name }}</h4>
      <NpcDetails slot="popover" :npcData="npcData" :isWide="true" />
    </v-popover>

     <span
      @click="addToEncounter"
      class="IT-Button"
    >+</span>
    {{ npcData.hit_points }} HP | {{ npcData.size }} | {{ npcData.type }}

  </div>
</template>

<script lang='ts'>
// tslint:disable:variable-name
import { Component, Vue, Prop } from 'vue-property-decorator';
import * as npcsModule from '../store/npcsModule';
import * as encountersModule from '../store/encountersModule';
import NpcDetails from './NpcDetails.vue';

@Component({
  components: { NpcDetails },
})
export default class NpcSearchResult extends Vue {
  @Prop(String) public id!: string;
  @Prop(String) public encounterId!: string;

  public showEncounterList: boolean = false;

  get npcData() {
    return npcsModule.readGetNpcById(this.$store)(this.id);
  }

  get encounters() {
    return encountersModule.readGetEncounters(this.$store);
  }

  public addToEncounter() {
    if (!this.npcData) {
      return;
    }

    encountersModule.dispatchAddNpcToEncounter(this.$store, {
      npcData: this.npcData,
      encounterId: this.encounterId,
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
</style>
