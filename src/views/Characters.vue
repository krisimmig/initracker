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
import * as encountersModule from '../store/encountersModule';
import CharacterNew from '../components/CharacterNew.vue';
import CharacterTeaser from '../components/CharacterTeaser.vue';

@Component({
  components: { CharacterNew, CharacterTeaser },
})
export default class Encounters extends Vue {
  public characters: any[] = [];
}
</script>

<style>
</style>
