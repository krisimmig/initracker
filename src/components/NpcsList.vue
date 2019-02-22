<template>
  <div class="NpcsList">
    <div v-if="!loading">
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
          <NpcSearchResult :id="npc.id" :encounterId="encounterId" />
        </li>
      </ul>
    </div>
    <div v-else><p>Loading...</p></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import NpcSearchResult from './NpcSearchResult.vue';
import * as npcsModule from '../store/npcsModule';

@Component({
  components: { NpcSearchResult },
})
export default class NpcsList extends Vue {
  @Prop(String) public encounterId!: string;

  public searchString: string = '';
  public searchResults: npcsModule.NpcEntity[] = [];
  public loading: boolean = false;

  public submit() {
    this.searchResults = npcsModule.readGetSearchResults(this.$store)(this.searchString);
  }

  get npcs() {
    return npcsModule.readGetNpcs(this.$store);
  }

  public async mounted() {
    this.loading = true;
    await npcsModule.dispatchFetchMonsters(this.$store);
    this.loading = false;
  }
}
</script>

<style scoped lang="scss">
</style>
