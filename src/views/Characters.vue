<template>
  <div>
    <PageTitle
      title="Characters list"
      subtitle="Here you see a list of all your characters."
    />

    <router-link :to="{ name: 'newCharacter' }" class="Button">Create new character</router-link>

    <ul>
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
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';

import { readGetCharacters, dispatchFetchCharacters } from '@/store/charactersModule';
import CharacterTeaser from '@/components/characters/CharacterTeaser.vue';
import { Character } from '@/classes/Character';
import PageTitle from '@/components/common/PageTitle.vue';

@Component({
  components: {
    CharacterTeaser,
    PageTitle,
  },
})
export default class Characters extends Vue {

  get characters(): Character[] {
    return readGetCharacters(this.$store);
  }

  public mounted() {
    dispatchFetchCharacters(this.$store);
  }

  public handleTeaserActioned(characterData) {
    this.$router.push({ name: 'editCharacter', params: { uuid: characterData.uuid }});
  }
}
</script>

<style>
</style>
