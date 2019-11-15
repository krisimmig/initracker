<template>
  <div class="CharacterTeaser">
    <h3>CharacterTeaser</h3>
    <p @click="showDetails = !showDetails">{{ name }}</p>
    <router-link :to="{ name: 'editCharacter', params: { uuid: character.uuid }}">Edit</router-link>
    <button @click="deleteCharacter">Delete</button>
    <NpcDetails v-if="showDetails" :npcData="character" />
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';

import { Character as ICharacter } from '@/classes/Character';
import NpcDetails from '@/components/npcs/NpcDetails.vue';
import { dispatchDeleteCharacter } from '@/store/characterBuilderModule';

@Component({
  components: {
    NpcDetails,
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
