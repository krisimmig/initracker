<template>
  <div class="NpcsList">
    <div>
      <button @click="switchTab('monsters')">Monsters</button>
      <button @click="switchTab('characters')">Characters</button>

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
          <li v-for="(npc, index) in npcs" :key="npc.uuid">
            <div v-if="index < maxVisible">
              <NpcSearchResult v-bind="npc" :npcData="npc" />
            </div>
          </li>
        </ul>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import NpcSearchResult from './NpcSearchResult.vue';
import { readGetNpcs } from '@/store/npcsModule';
import { Character as ICharacter } from '@/classes/Character';
import { readGetCharacters } from '@/store/charactersModule';

@Component({
  components: { NpcSearchResult },
})
export default class NpcsList extends Vue {
  public searchString: string = '';
  public searchResults: ICharacter[] = [];
  public maxVisible: number = 10;
  public showType: string = 'monsters';

  get npcs() {
    if (this.showType === 'monsters') {
      return readGetNpcs(this.$store);
    }
    return readGetCharacters(this.$store);
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

  public switchTab(type) {
    this.showType = type;
  }
}
</script>

<style scoped lang="scss">
.NpcsList-results {
  max-height: calc(100vh - 252px);
  overflow-y: scroll;
  border: 1px solid green;
}
</style>
