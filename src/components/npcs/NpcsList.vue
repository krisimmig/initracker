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
      <div
        class="NpcsList-results"
        ref="monsterList"
        @scroll="onScroll"
      >
        <ul v-if="npcs.length > 0">
          <li
            v-for="(npc, index) in npcs"
            :key="npc.id"
          >
            <div v-if="index < maxVisible">
              <NpcSearchResult v-if="npc.name.toLowerCase().includes(searchString.toLowerCase())"
                :id="npc.id"
                :encounterId="encounterId"
              />
            </div>
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
import * as npcsModule from '../../store/npcsModule';
import { ICharacter } from './../../types/characters';

@Component({
  components: { NpcSearchResult },
})
export default class NpcsList extends Vue {
  @Prop(String) public encounterId!: string;

  public searchString: string = '';
  public searchResults: ICharacter[] = [];
  public loading: boolean = false;
  public maxVisible: number = 10;

  get npcs() {
    return npcsModule.readGetNpcs(this.$store);
  }

  public onScroll() {
    const htmlElement = this.$refs.monsterList as HTMLElement;
    const scrollPos = htmlElement.scrollHeight - htmlElement.scrollTop;
    const maxScroll = htmlElement.clientHeight;
    const offset = 100;

    if (scrollPos < maxScroll + offset) {
      this.maxVisible += 10;
    }
  }
}
</script>

<style scoped lang="scss">
.NpcsList-results {
  max-height: calc(100vh - 340px);
  overflow-y: scroll;
  border: 1px solid green;
}
</style>
