<template>
  <div class="u-maxWidth">
    <h1>Character Overview</h1>
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

import { readGetCharacters, dispatchFetchCharacters } from '../store/charactersModule';
import CharacterTeaser from '../components/characters/CharacterTeaser.vue';
import { Character } from '@/classes/Character';

@Component({
  components: { CharacterTeaser },
})
export default class Characters extends Vue {

  get characters(): Character[] {
    console.log('characters');
    
    return readGetCharacters(this.$store);
  }

  public mounted() {
    console.log('Characters dispatchFetchCharacters');
    dispatchFetchCharacters(this.$store);
  }
}
</script>

<style>
</style>
