<template>
  <div class="CharactersLibrary">
    <div>
      <button @click="switchTab('monsters')">Monsters</button>
      <button @click="switchTab('characters')">Characters</button>

      <div class="Form">
        <FormInput
          label="Search"
          v-model="searchString"
          placeholder="Search monsters & characters"
        />
      </div>

      <h3>Results:</h3>
      <div class="CharactersLibrary-scrollBox u-scrollBoxParent" >
        <div class="u-scrollBoxChild" ref="monsterList" @scroll="onScroll">
          <ul v-if="filteredNpcs.length > 0">
            <li v-for="(npc, index) in filteredNpcs" :key="npc.uuid">
              <div v-if="index < maxVisible">
                <CharacterSearchResult v-bind="npc" :characterData="npc" />
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
import { Character } from '@/classes/Character';
import { readGetCharacters, dispatchFetchCharacters } from '@/store/charactersModule';
import FormInput from '@/components/form/FormInput.vue';

@Component({
  components: { CharacterSearchResult, FormInput },
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

  get filteredNpcs() {
    if (this.searchString === '') {
      return this.npcs;
    }
    return this.npcs.filter((npc) => npc.name.toLowerCase().includes(this.searchString.toLowerCase()));
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
