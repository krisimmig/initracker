<template>
  <div class="IT-Flex">
    <div>

      <h1>Character Overview</h1>
      <ul>
        <li
          v-for="character in characters"
          :key="character.id"
        >
          <CharacterTeaser v-bind="character" />
        </li>
      </ul>
    </div>

    <div class="IT-Flex-40">
      <CharacterNew />
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';

import { NpcEntity } from '../store/npcsModule';
import * as charactersModule from '../store/charactersModule';
import CharacterNew from '../components/characters/CharacterNew.vue';
import CharacterTeaser from '../components/characters/CharacterTeaser.vue';

@Component({
  components: { CharacterNew, CharacterTeaser },
})
export default class Encounters extends Vue {

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
