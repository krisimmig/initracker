<template>
  <v-card class="CharactersLibrary d-flex">
    <v-card-text>
      <v-row>
        <v-col cols="4">
          <div class="bg-white p-4 border-b">
            <label class="Form-label block mb-1">Search category</label>
            <Button
              @click="switchTab('monsters')"
              :is-secondary="showType !== 'monsters'"
            >
              Monsters
            </Button>
            <Button
              :is-secondary="showType !== 'characters'"
              @click="switchTab('characters')"
            >
              Characters
            </Button>

            <div class="Form mt-2">
              <FormInput
                label="Name"
                v-model="searchString"
                placeholder="Search monsters & characters by name"
              />
            </div>
          </div>

          <div ref="monsterList" @scroll="onScroll">
            <ul v-if="filteredNpcs.length > 0" class="u-listReset">
              <li v-for="(npc, index) in filteredNpcs" :key="npc.uuid" class="CharactersLibrary-listItem">
                <div v-if="index < maxVisible">
                  <CharacterTeaser :characterData="npc" @click.native="characterPreviewSelected(npc)">
                    <v-btn @click="$emit('characterClicked', npc)">{{ buttonText }}</v-btn>
                  </CharacterTeaser>
                </div>
              </li>
            </ul>

            <p v-else class="u-tip" v-html="noResultsText"></p>

          </div>
        </v-col>

        <v-col>
          <CharacterDetails v-if="previewCharacter" :characterData="previewCharacter" />
          <p class="u-tip" v-else>Click on a character name to see details here.</p>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import CharacterTeaser from '@/components/characters/CharacterTeaser.vue';
import { readGetNpcs } from '@/store/npcsModule';
import { Character } from '@/classes/Character';
import { readGetCharacters, dispatchFetchCharacters } from '@/store/charactersModule';
import FormInput from '@/components/form/FormInput.vue';
import { commitSetNpcInDetail, dispatchAddNpcToEncounter, readGetEncountersCurrentId } from '@/store/encountersModule';
import Button from '@/components/common/Button.vue';
import CharacterDetails from "@/components/characters/CharacterDetails.vue";

const searchTypes = {
  MONSTERS: 'monsters',
  CHARACTERS: 'characters',
};

@Component({
  components: {
    Button,
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
    if (this.searchString === '') {
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
