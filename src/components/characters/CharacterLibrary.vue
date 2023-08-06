<template >
  <v-sheet
      class="CharactersLibrary"
      style="height: 85vh;"
  >
    <v-app-bar flat>
      <v-toolbar-title >
        <v-icon class="mr-2 mb-2">mdi-account-group</v-icon >
        Character library
      </v-toolbar-title >
      <v-spacer ></v-spacer >
      <v-btn
          icon
          @click.stop="$emit('closeClicked')"
      >
        <v-icon >mdi-close</v-icon >
      </v-btn >
    </v-app-bar >

    <div class="d-flex pa-4">
      <v-row >
        <v-col cols="6">
          <div >
            <div class="d-flex align-center">
              <v-icon class="mr-2">mdi-filter</v-icon >
              <v-btn
                  @click="switchTab('all')"
                  class="mr-2"
                  text
                  :color="showType === 'all' ? 'primary' : ''"
              >
                All
              </v-btn >
              <v-btn
                  @click="switchTab('monsters')"
                  class="mr-2"
                  text
                  :color="showType === 'monsters' ? 'primary' : ''"
              >
                Monsters
              </v-btn >
              <v-btn
                  @click="switchTab('characters')"
                  text
                  :color="showType === 'characters' ? 'primary' : ''"
              >
                Custom Characters
              </v-btn >
            </div >
            <v-text-field
                label="Search by name"
                v-model="searchString"
                prepend-icon="mdi-account-search"
                clearable
            />
          </div >

          <v-virtual-scroll
              bench="10"
              :items="filteredNpcs"
              height="calc(85vh - 205px)"
              item-height="130"
          >
            <template v-slot:default="{ item }">
              <div class="mr-4">
                <CharacterTeaser
                    :characterData="item"
                    @click.native="characterPreviewSelected(item)"
                >
                  <v-btn
                      small
                      outlined
                      color="primary"
                      class="mr-4"
                  >
                    Preview
                  </v-btn >
                </CharacterTeaser >
                <v-divider class="mt-2"/>
              </div >
            </template >
          </v-virtual-scroll >
        </v-col >

        <v-col >
          <div
              v-if="previewCharacter"
              class="CharacterPreview"
          >
            <v-btn
                @click="$emit('characterClicked', previewCharacter)"
                color="primary"
                depressed
                class="CharacterPreview-addButton mr-4"
            >
              {{ buttonText }}
            </v-btn >
            <CharacterDetails :characterData="previewCharacter"/>
          </div >
          <v-alert
              type="info"
              v-else
          >Select a character on the left.
          </v-alert >
        </v-col >
      </v-row >
    </div >
  </v-sheet >
</template >

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
  ALL: 'all',
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
  @Prop({type: String, default: ''}) public buttonText!: string;

  public searchString: string = '';
  public maxVisible: number = 15;
  public showType: string = searchTypes.ALL;
  public previewCharacter: Character | null = null;

  get noResultsText() {
    return 'No characters found, you can create your own monsters and player-characters <a href="/characters">here</a>';
  }

  get npcs() {
    if (this.showType === searchTypes.MONSTERS) {
      return readGetNpcs(this.$store);
    } else if (this.showType === searchTypes.CHARACTERS) {
      return readGetCharacters(this.$store);
    }

    return [...readGetNpcs(this.$store), ...readGetCharacters(this.$store)];
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

  get combinedCharacters(): Character[] {
    return [...this.characters, ...readGetNpcs(this.$store)]
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
</script >

<style lang="scss">
.CharactersLibrary .CharacterDetails .ps {
  max-height: calc(85vh - 100px);
}

.CharacterPreview {
  position: relative;
}

.CharacterPreview-addButton {
  position: absolute;
  z-index: 100;
  top: 1rem;
  right: 0;
}
</style >
