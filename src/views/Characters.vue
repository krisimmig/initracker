<template>
  <div class="IT-Flex">
    <div>

      <h1>Character Overview</h1>
      <ul>
        <li
          v-for="character in characters"
          :key="character.id"
        >
          <CharacterTeaser v-bind="character" :character="character" />
        </li>
      </ul>
    </div>

    <div class="IT-Flex-40">
      <router-link :to="{ name: 'newCharacter' }">Create new character</router-link>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';

import { readGetCharacters, dispatchFetchCharacters } from '../store/charactersModule';
import CharacterTeaser from '../components/characters/CharacterTeaser.vue';
import { Character } from '@/classes/Character';

@Component({
  components: { CharacterTeaser },
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
