<template>
  <div class="CharacterSearchResult" v-if="npcData" @click="selectCharacter">
    <h4>{{ characterData.name }}</h4>
     <span @click="addToEncounter">+</span>
    {{ characterData.hit_points }} HP | {{ characterData.size }} | {{ characterData.type }}

  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';
import CharacterDetails from '@/components/characters/CharacterDetails.vue';
import { Character } from '@/classes/Character';
import { dispatchAddNpcToEncounter, readGetEncountersCurrentId, commitSetNpcInDetail } from '@/store/encountersModule';

@Component({
  components: { CharacterDetails },
})
export default class CharacterSearchResult extends Vue {
  @Prop({ type: String, required: true }) public id!: string;
  @Prop({ type: String, required: true }) public name!: string;
  @Prop({ type: Number, required: true }) public hit_points!: number;
  @Prop({ type: String, required: true }) public size!: string;
  @Prop({ type: String, required: true }) public type!: string;
  @Prop({ type: Object, required: true }) public characterData!: Character;

  public get encounterId() {
    return readGetEncountersCurrentId(this.$store);
  }

  public addToEncounter() {
    if (!this.encounterId) { return; }
    dispatchAddNpcToEncounter(this.$store, {
      npcData: Object.assign({}, this.npcData),
      encounterId: this.encounterId,
    });
  }

  public selectCharacter() {
    console.log('selectCharacter');
    commitSetNpcInDetail(this.$store, this.npcData);
  }
}
</script>

<style>
.CharacterSearchResult {
  border: 1px solid gainsboro;
  background-color: ghostwhite;
  padding: 10px;
  margin-bottom: 15px;
}
</style>
