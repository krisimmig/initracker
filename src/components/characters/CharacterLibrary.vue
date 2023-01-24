<template>
  <v-sheet class="CharactersLibrary" style="height: 85vh;">
    <v-app-bar flat>
      <v-toolbar-title><v-icon>mdi-account-group</v-icon> Character library</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click.stop="$emit('closeClicked')"><v-icon>mdi-close</v-icon></v-btn>
    </v-app-bar>

    <div class="d-flex pa-4">
      <v-row>
        <v-col cols="6">
          <div>
            <p class="">Search category</p>
            <v-btn @click="switchTab('monsters')">Monsters</v-btn>
            <v-btn @click="switchTab('characters')">Characters</v-btn>
            <v-text-field
              label="Search"
              v-model="searchString"
              clearable
              placeholder="Search monsters & characters by name"
            />
          </div>

          <v-virtual-scroll
            bench="10"
            :items="filteredNpcs"
            height="calc(85vh - 242px)"
            item-height="95"
          >
            <template v-slot:default="{ item }">
              <CharacterTeaser :characterData="item" @click.native="characterPreviewSelected(item)">
                <v-btn @click="$emit('characterClicked', item)" outlined class="mr-4">
                  {{ buttonText }}
                </v-btn>
              </CharacterTeaser>
              <v-divider class="mt-2" />
            </template>
          </v-virtual-scroll>
        </v-col>

        <v-col>
          <div style="height: calc(85vh - 96px); overflow-y: scroll;">
            <CharacterDetails v-if="previewCharacter" :characterData="previewCharacter" />
            <v-alert type="info" v-else>Select a character from the list on the lieft to see its info card here.</v-alert>
          </div>
        </v-col>
      </v-row>
    </div>
  </v-sheet>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import CharacterTeaser from '@/components/characters/CharacterTeaser.vue';
import { readGetNpcs } from '@/store/npcsModule';
import { Character } from '@/classes/Character';
import { readGetCharacters, dispatchFetchCharacters } from '@/store/charactersModule';
import FormInput from '@/components/form/FormInput.vue';
import { readGetEncountersCurrentId } from '@/store/encountersModule';
import CharacterDetails from "@/components/characters/CharacterDetails.vue";

const searchTypes = {
  MONSTERS: 'monsters',
  CHARACTERS: 'characters',
};

@Component({
  components: {
    CharacterDetails,
    CharacterTeaser,
    FormInput,
  },
})
export default class CharacterLibrary extends Vue {
  @Prop({ type: String, default: 'Add' }) public buttonText!: string;

  public searchString: string = '';
  public maxVisible: number = 15;
  public showType: string = searchTypes.MONSTERS;
  public previewCharacter: Character|null = null;

  get npcs() {
    if (this.showType === searchTypes.MONSTERS) {
      return readGetNpcs(this.$store);
    }

    return readGetCharacters(this.$store);
  }

  get noResultsText() {
    if (this.showType === searchTypes.MONSTERS) {
      return 'No monsters found, please add some here <a href="/characters">here</a>';
    } else if (this.showType === searchTypes.CHARACTERS) {
      return 'No characters found, you can create your own monsters and player-characters <a href="/characters">here</a>';
    }
  }

  get filteredNpcs() {
    if (!this.searchString) {
      return this.npcs;
    }

    return this.npcs.filter((npc) => npc.name.toLowerCase().includes(this.searchString.toLowerCase()));
  }

  get characters(): Character[] {
    return readGetCharacters(this.$store);
  }

  public get encounterId() {
    return readGetEncountersCurrentId(this.$store);
  }

  // TODO: Check if this is still needed.
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

  public characterPreviewSelected(npc) {
    this.previewCharacter = npc;
  }

  public mounted() {
    dispatchFetchCharacters(this.$store);
  }
}
</script>

<style scoped lang="scss">
.CharactersLibrary-listScrollBox {
  height: calc(100vh - 500px); // Adjust this value in the parent component
}

.CharacterDetails-previewScrollBox {
  height: calc(100vh - 303px); // Adjust this value in the parent component
}

.CharactersLibrary-listItem:last-child {
  border-bottom: 1px solid theme('colors.gray.300');
}
</style>
