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

import * as charactersModule from '../store/charactersModule';
import CharacterTeaser from '../components/characters/CharacterTeaser.vue';

@Component({
  components: { CharacterTeaser },
})
export default class Characters extends Vue {

  get characters(): charactersModule.CharacterEntity[] {
    return charactersModule.readGetCharacters(this.$store);
  }

  public mounted() {
    charactersModule.dispatchFetchCharacters(this.$store);
  }
}
</script>

<style>
</style>
