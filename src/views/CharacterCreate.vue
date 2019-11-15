<template>
  <div class="u-maxWidth">
    <h1>Character Create</h1>
    <div v-if="!isLoading">
      <CharacterBuilder :character="character" />
    </div>
    <div v-else>Loading..</div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';

import CharacterBuilder from '../components/characters/CharacterBuilder.vue';
import {
  readGetIsLoading,
  dispatchFetchCharacterById,
  readGetCharacter,
  commitSetCharacter,
  dispatchFetchCharacterByUuid,
} from '@/store/characterBuilderModule';
import { readGetNpcById  } from '@/store/npcsModule';
import { charactersModule } from '../store/charactersModule';
import { Character } from '@/classes/Character';

@Component({
  components: {
    CharacterBuilder,
  },
})
export default class CharacterCreate extends Vue {

  public get isLoading() {
    return readGetIsLoading(this.$store);
  }

  public get characterId() {
    return this.$route.params.characterId || false;
  }

  public get character() {
    return readGetCharacter(this.$store);
  }

  public mounted() {
    if (this.$route.meta.edit) {
      dispatchFetchCharacterByUuid(this.$store, { characterUuid: this.$route.params.uuid });
    } else if (this.characterId) {
      dispatchFetchCharacterById(this.$store, { id: this.characterId });
    } else {
      commitSetCharacter(this.$store, {
        character: new Character(),
      });
    }
  }
}
</script>

<style>
</style>
