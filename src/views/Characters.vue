<template>
  <div class="u-maxWidth">
    <PageTitle
      title="Characters list"
      subtitle="Here you see a list of all your characters."
    />

    <div class="u-flex">
      <div>
        <ul>
          <li
            v-for="character in characters"
            :key="character.uuid"
          >
            <CharacterTeaser v-bind="character" :character="character" />
          </li>
        </ul>
      </div>

      <div class="u-flex-40">
        <router-link :to="{ name: 'newCharacter' }">Create new character</router-link>
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
}
</script>

<style>
</style>
