<template>
  <div class="CharactersLibrary">
    <div>
      <button @click="switchTab('monsters')">Monsters</button>
      <button @click="switchTab('characters')">Characters</button>

      <input
        type="text"
        v-model="searchString"
        placeholder="Search monsters..."
      >

      <h3>Results:</h3>
      <div class="CharactersLibrary-scrollBox u-scrollBoxParent" >
        <div class="u-scrollBoxChild" ref="monsterList" @scroll="onScroll">
          <ul v-if="npcs.length > 0">
            <li v-for="(npc, index) in npcs" :key="npc.uuid">
              <div v-if="index < maxVisible">
                <CharacterSearchResult v-bind="npc" :npcData="npc" />
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import CharacterSearchResult from '@/components/characters/CharacterSearchResult.vue';
import { readGetNpcs } from '@/store/npcsModule';
import { Character as ICharacter, Character } from '@/classes/Character';
import { readGetCharacters, dispatchFetchCharacters } from '@/store/charactersModule';

@Component({
  components: { CharacterSearchResult },
})
export default class CharacterLibrary extends Vue {
  public searchString: string = '';
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

  get characters(): Character[] {
    return readGetCharacters(this.$store);
  }

  public mounted() {
    dispatchFetchCharacters(this.$store);
  }
}
</script>

<style scoped lang="scss">
.CharactersLibrary-scrollBox {
  border: 1px solid grey;
  height: calc(100vh - 310px);
}
</style>
