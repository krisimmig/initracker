<template>
  <div class="">
    <PageTitle
      title="Character editor"
      subtitle="Here you can create or edit an existing character."
    />

    <div class="u-container-fluid">
      <div v-if="!isLoading">
        <CharacterBuilder :character="character" />
      </div>
      <div v-else class="u-tip">Loading..</div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';

import CharacterBuilder from '@/components/characters/CharacterBuilder.vue';
import PageTitle from '@/components/common/PageTitle.vue';

import {
  readGetIsLoading,
  dispatchFetchCharacterById,
  readGetCharacter,
  commitSetCharacter,
  dispatchFetchCharacterByUuid,
} from '@/store/characterBuilderModule';
import { Character } from '@/classes/Character';

@Component({
  components: {
    CharacterBuilder,
    PageTitle,
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
    } else if (this.$route.meta.new) {
      commitSetCharacter(this.$store, { character: new Character() });
    } else if (this.characterId) {
      dispatchFetchCharacterById(this.$store, { id: this.characterId });
    }
  }
}
</script>

<style>
</style>
