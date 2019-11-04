<template>
  <div class="CharacterTeaser">
    <h3>CharacterTeaser</h3>
    <p @click="showDetails = !showDetails">{{ name }}</p>
    <router-link :to="{ name: 'editCharacter', params: { uuid: character.uuid }}">Edit</router-link>
    <NpcDetails v-if="showDetails" :npcData="character" />
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';

import { Character as ICharcter } from '@/classes/Character';
import NpcDetails from '@/components/npcs/NpcDetails.vue';

@Component({
  components: {
    NpcDetails,
  },
})
export default class CharacterTeaser extends Vue {
  @Prop(String) public name!: string;
  @Prop() public character!: ICharcter;
  public showDetails: boolean = false;
}
</script>

<style>
</style>
