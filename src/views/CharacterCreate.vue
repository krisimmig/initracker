<template>
  <div class="IT-Flex">
    <div v-if="character1">
      <h1>Character Create</h1>
      <CharacterEditor />
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';

import CharacterEditor from '../components/characters/CharacterEditor.vue';
import * as npcsModule from './../store/npcsModule';

@Component({
  components: {
    CharacterEditor,
  },
})
export default class CharacterCreate extends Vue {
}
</script>

<style>
</style>
