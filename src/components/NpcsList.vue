<template>
  <div class="NpcsList">
    <p>Search index count: <strong>{{ npcs.length }}</strong></p>

    <input
      type="text"
      v-model="searchString"
      placeholder="Search monsters..."
      @keyup.enter="submit"
    >

    <h3>Results:</h3>
    <ul v-if="searchResults.length > 0">
      <li v-for="npc in searchResults" :key="npc.id">
        <NpcSearchResult :id="npc.id" />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import axios from 'axios';

import NpcSearchResult from './NpcSearchResult.vue';
import * as npcsModule from '../store/npcsModule';

@Component({
  components: { NpcSearchResult },
})
export default class NpcsList extends Vue {
  public searchString: string = '';
  public searchResults: npcsModule.NpcEntity[] = [];

  public async submit() {
    this.searchResults = npcsModule.readGetSearchResults(this.$store)(this.searchString);
  }

  get npcs() {
    return npcsModule.readGetNpcs(this.$store);
  }
}
</script>

<style scoped lang="scss">
</style>
