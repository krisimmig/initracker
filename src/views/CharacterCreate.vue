<template>
  <div class="IT-Flex">
    <div v-if="!isLoading">
      <h1>Character Create</h1>
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
      console.log('editing', this.$route.params.id);
      dispatchFetchCharacterByUuid(this.$store, { uuid: this.$route.params.uuid });
    } else if (this.characterId) {
      dispatchFetchCharacterById(this.$store, { id: this.characterId });
    }
  }
}
</script>

<style>
</style>
