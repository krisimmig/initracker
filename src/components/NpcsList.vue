<template>
  <div class="NpcsList">
    <div v-if="!loading">
      <p>Search index count: <strong>{{ npcs.length }}</strong></p>

      <input
        type="text"
        v-model="searchString"
        placeholder="Search monsters..."
      >

      <h3>Results:</h3>
      <div class="NpcsList-results">
        <ul v-if="npcs.length > 0">
          <li v-for="npc in npcs" :key="npc.id">
            <NpcSearchResult
              v-if="npc.name.toLowerCase().includes(searchString.toLowerCase())"
              :id="npc.id"
              :encounterId="encounterId"
            />
          </li>
        </ul>
      </div>
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

  get npcs() {
    return npcsModule.readGetNpcs(this.$store);
  }

  public async mounted() {
    if (this.npcs.length < 1) {
      this.loading = true;
      await npcsModule.dispatchFetchMonsters(this.$store);
      this.loading = false;
    }
  }
}
</script>

<style scoped lang="scss">
.NpcsList-results {
  max-height: calc(100vh - 265px);
  overflow-y: scroll;
  border: 1px solid green;
}
</style>
