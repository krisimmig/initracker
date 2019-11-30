<template>
  <div class="CharacterTeaser">
    <h3>CharacterTeaser</h3>
    <p @click="showDetails = !showDetails">{{ name }}</p>
      <router-link tag="button" :to="{ name: 'editCharacter', params: { uuid: character.uuid }}">Edit</router-link>
    <button @click="deleteCharacter">Delete</button>
    <CharacterDetails v-if="showDetails" characterData="character"/>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';

import { Character as ICharacter } from '@/classes/Character';
import CharacterDetails from '@/components/characters/CharacterDetails.vue';
import { dispatchDeleteCharacter } from '@/store/characterBuilderModule';

@Component({
  components: {
    CharacterDetails,
  },
})
export default class CharacterTeaser extends Vue {
  @Prop({ type: String, required: true }) public name!: string;
  @Prop({ type: Object, required: true }) public character!: ICharacter;

  public showDetails: boolean = false;

  public deleteCharacter() {
    dispatchDeleteCharacter(this.$store, { characterUuid: this.character.uuid });
  }
}
</script>

<style>
</style>
