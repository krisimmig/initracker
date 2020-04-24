<template>
  <div class="CharacterSearchResult" v-if="characterData" @click="selectCharacter">
    <div class="u-flex">
      <h4 class="CharacterSearchResult-name">{{ characterData.name }}</h4>
      <button @click="addToEncounter">+</button>
    </div>

    <div class="u-flex">
      <CharacterArmorClass :armor-class="characterData.armor_class" />
      <CharacterHealth :hp="characterData.hit_points" />
      <p class="CharacterSearchResult-meta">{{ characterData.size }} | {{ characterData.type }}</p>
    </div>

  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';
import CharacterDetails from '@/components/characters/CharacterDetails.vue';
import { Character } from '@/classes/Character';
import { dispatchAddNpcToEncounter, readGetEncountersCurrentId, commitSetNpcInDetail } from '@/store/encountersModule';
import CharacterArmorClass from '@/components/characters/common/CharacterArmorClass.vue';
import CharacterHealth from '@/components/characters/common/CharacterHealth.vue';

@Component({
  components: { CharacterDetails, CharacterArmorClass, CharacterHealth },
})
export default class CharacterSearchResult extends Vue {
  @Prop({ type: Object, required: true }) public characterData!: Character;

  public get encounterId() {
    return readGetEncountersCurrentId(this.$store);
  }

  public addToEncounter() {
    if (!this.encounterId) { return; }
    dispatchAddNpcToEncounter(this.$store, {
      npcData: Object.assign({}, this.characterData),
      encounterId: this.encounterId,
    });
  }

  public selectCharacter() {
    commitSetNpcInDetail(this.$store, this.characterData);
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
