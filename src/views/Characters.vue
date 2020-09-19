<template>
  <div>
    <PageTitle
      title="My monsters and characters."
      subtitle="create or edit your own monsters and characters."
    />

    <div class="Characters u-container-fluid">
      <div class="flex">
        <div class="w-1/2 mt-3 mr-3">
          <div class="card border-b">
            <h4>Create a new monster or character</h4>
            <p>Create a character from scratch starting with a basic <router-link :to="{ name: 'characterBuilder', query: { new: 1 }}">character sheet</router-link>.</p>
            <div class="w-1/2">
              <router-link
                :to="{ name: 'characterBuilder', query: { new: 1 }}"
                class="Button Button--success Button--big"
              >
                start new character
              </router-link>
            </div>
          </div>
          <div class="u-scrollBoxParent">
            <div class="u-scrollBoxChild">
              <ul class="divide-y divide-gray-300 border-b" v-if="characters.length > 0">
            <li
              v-for="character in characters"
              :key="character.uuid"
            >
              <CharacterTeaser
                :character-data="character"
                @click.native ="handleTeaserActioned(character)"
              >
                <button>Edit</button>
              </CharacterTeaser>
            </li>
          </ul>
            </div>
          </div>
        </div>

        <div class="w-1/2 mt-3 mr-4 bg-white">
          <div class="card">
            <h4>Existing characters</h4>
            <p>You can choose an existing character from the list below as your base.</p>
          </div>
          <CharacterLibrary @characterClicked="handleCharacterClicked" buttonText="Use as base" class="Characters-library" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';

import { readGetCharacters, dispatchFetchCharacters } from '@/store/charactersModule';
import CharacterTeaser from '@/components/characters/CharacterTeaser.vue';
import { Character } from '@/classes/Character';
import PageTitle from '@/components/common/PageTitle.vue';
import { readGetNpcs } from '@/store/npcsModule';
import CharacterLibrary from '@/components/characters/CharacterLibrary.vue';

@Component({
  components: {
    CharacterTeaser,
    PageTitle,
    CharacterLibrary,
  },
})
export default class Characters extends Vue {

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
    this.$router.push({ name: 'editCharacter', params: { uuid: characterData.uuid }});
  }

  public handleCharacterClicked(characterData) {
    this.$router.push({ name: 'characterCreate', params: { characterId: characterData.id }});
  }
}
</script>

<style lang="scss">
.CharacterList li {
  @apply   text-gray-600 block;
}

.Characters .u-scrollBoxChild {
  height: calc(100vh - 307px);
}
</style>
