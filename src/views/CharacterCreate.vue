<template>
  <div class="IT-Flex">
    <div>
      <h1>Character Create</h1>
      <p>Editing: <b>{{ character.name }}</b></p>
      <p>HitPoints: <b>{{ character.hit_points }}</b></p>
      <p>Alignment: <b>{{ character.alignment }}</b></p>

      <CharacterBuilder />
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';

import CharacterBuilder from '../components/characters/CharacterBuilder.vue';
import { readGetCharacter, commitSetCharacter } from '@/store/characterBuilderModule';
import { readGetNpcById  } from '@/store/npcsModule';
import { charactersModule } from '../store/charactersModule';

@Component({
  components: {
    CharacterBuilder,
  },
})
export default class CharacterCreate extends Vue {

  public get characterId() {
    return this.$route.params.characterId || false;
  }

  public get character() {
    if (this.characterId) {
      return readGetNpcById(this.$store)(this.characterId);
    }
    return readGetCharacter(this.$store);
  }
}
</script>

<style>
</style>
