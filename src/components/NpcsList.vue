<template>
  <div class="NpcsList">
    <p>Npcs List comp</p>
    <p>{{ npcs.length }}</p>

    <input
      type="text"
      v-model="searchString"
      placeholder="Search monsters..."
      @keyup.enter="submit"
    >

    <h3>Results:</h3>
    <Npc v-for="npc in searchResults" :key="npc.name" v-bind="npc" />

    <h3>My Npcs:</h3>
    <Npc v-for="npc in npcs" :key="npc.id" v-bind="npc" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import axios from 'axios';

import Npc from './Npc.vue';
import * as npcsModule from '../store/npcsModule';
import { db } from '../store/firebase';
import monsters from './monsters';

@Component({
  components: { Npc },
})
export default class NpcsList extends Vue {
  public searchString: string = '';

  public mounted() {
    npcsModule.dispatchOpenNpcsConnection(this.$store);
    npcsModule.dispatchFetchSearchIndex(this.$store);
  }

  public async submit() {
    console.log('submit');
  }

  get npcs() {
    return npcsModule.readGetNpcs(this.$store);
  }

  get searchResults() {
    return [];
  }
}
</script>

<style scoped lang="scss">
</style>
