<template>
  <div class="IT-Flex">
    <div>
      <h1>Character Create</h1>
      <p>Editing: <b>{{ characterId }}</b></p>

      <CharacterBuilder />
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';

import CharacterBuilder from '../components/characters/CharacterBuilder.vue';
import * as npcsModule from './../store/npcsModule';

@Component({
  components: {
    CharacterBuilder,
  },
})
export default class CharacterCreate extends Vue {

  public get characterId() {
    return this.$route.params.characterId || 'New';
  }
}
</script>

<style>
</style>
