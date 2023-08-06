<template >
  <div class="Characters">
    <PageTitle
        title="Characters"
        subtitle="Create or edit your own monsters and characters"
    />

    <v-row >
      <v-col >
        <template v-if="characters.length > 0">
          <v-card
              hover
              v-for="character in characters"
              :key="character.uuid"
              class="pa-4 mb-3"
          >
            <CharacterTeaser
                :character-data="character"
                @click.native="handleTeaserActioned(character)"
            >
              <v-btn
                  plain
                  @click="handleTeaserActioned(character)"
              >
                <v-icon left>mdi-pencil</v-icon >
                Edit
              </v-btn >
            </CharacterTeaser >
          </v-card >
        </template >
        <v-alert
            outlined
            type="info"
            v-else
        >No custom characters found.
        </v-alert >
      </v-col >

      <v-col cols="4">
        <v-card >
          <v-card-text class="text-body-1 text-center">
            <p >Create a new character from scratch:</p >
            <router-link
                :to="{ name: 'characterBuilder', query: { new: true }}"
                style="text-decoration: none; color: inherit;"
            >
              <v-btn color="primary">
                <v-icon left>mdi-account-plus</v-icon >
                New character sheet
              </v-btn >
            </router-link >
            <div class="d-flex my-4 align-center">
              <v-divider />
              <span class="px-4 font-weight-bold">or</span >
              <v-divider />
            </div >
            <p >Base your new character on an existing one from the library:</p >
            <v-btn
                @click="showCharacterLibrary = true"
                color="primary"
            >
              <v-icon left>mdi-account-multiple-plus</v-icon >
              Open library
            </v-btn >
          </v-card-text >
          <v-dialog
              v-model="showCharacterLibrary"
              max-width="80vw"
          >
            <CharacterLibrary
                :encounterId="$route.params.encounterId"
                @characterClicked="handleCharacterClicked"
                @closeClicked="showCharacterLibrary = false"
                buttonText="Use as base"
            />
          </v-dialog >
        </v-card >
      </v-col >
    </v-row >
  </div >
</template >

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';

import { readGetCharacters, dispatchFetchCharacters } from '@/store/charactersModule';
import CharacterTeaser from '@/components/characters/CharacterTeaser.vue';
import { Character } from '@/classes/Character';
import PageTitle from '@/components/common/PageTitle.vue';
import { readGetNpcs } from '@/store/npcsModule';
import CharacterLibrary from '@/components/characters/CharacterLibrary.vue';
import Button from '@/components/common/Button.vue';

@Component({
  components: {
    Button,
    CharacterTeaser,
    PageTitle,
    CharacterLibrary,
  },
})
export default class Characters extends Vue {
  public showCharacterLibrary: boolean = false;

  public get characters(): Character[] {
    return readGetCharacters(this.$store);
  }

  public get npcs(): Character[] {
    return readGetNpcs(this.$store);
  }

  public mounted() {
    dispatchFetchCharacters(this.$store);
  }

  public handleTeaserActioned(characterData) {
    this.$router.push({name: 'editCharacter', params: {uuid: characterData.uuid}});
  }

  public handleCharacterClicked(characterData) {
    this.$router.push({name: 'characterCreate', params: {characterId: characterData.id}});
  }
}
</script >

<style lang="scss">
.CharacterList li {
  @apply text-gray-600 block;
}

.Characters-myCharacters .CharactersLibrary-scrollBox {
  height: calc(100vh - 310px);
}

.Characters-library .CharactersLibrary-scrollBox {
  height: calc(100vh - 412px);
}
</style >
