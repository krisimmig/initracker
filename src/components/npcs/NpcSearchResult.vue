<template>
  <div class="Npc" v-if="npcData">
    <v-popover placement="right-end" :autoHide="true" trigger="click">
      <h4>{{ npcData.name }}</h4>
      <CharacterDetails slot="popover" :npcData="npcData" :isWide="true" />
    </v-popover>

     <span @click="addToEncounter">+</span>
    {{ npcData.hit_points }} HP | {{ npcData.size }} | {{ npcData.type }}

  </div>
</template>

<script lang='ts'>
// tslint:disable:variable-name
import { Component, Vue, Prop } from 'vue-property-decorator';
import * as npcsModule from '@/store/npcsModule';
import * as encountersModule from '@/store/encountersModule';
import CharacterDetails from '@/components/characters/CharacterDetails.vue';
import { Character } from '@/classes/Character';

@Component({
  components: { CharacterDetails },
})
export default class NpcSearchResult extends Vue {
  @Prop({ type: String, required: true }) public id!: string;
  @Prop({ type: String, required: true }) public name!: string;
  @Prop({ type: Number, required: true }) public hit_points!: number;
  @Prop({ type: String, required: true }) public size!: string;
  @Prop({ type: String, required: true }) public type!: string;
  @Prop({ type: Object, required: true }) public npcData!: Character;

  public get encounterId() {
    return encountersModule.readGetEncountersCurrentId(this.$store);
  }

  public addToEncounter() {
    if (!this.encounterId) { return; }
    encountersModule.dispatchAddNpcToEncounter(this.$store, {
      npcData: Object.assign({}, this.npcData),
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
