<template>
  <div class="">
    <PageTitle
        title="Character editor"
        subtitle="Here you can create or edit an existing character."
    />

    <div v-if="!isLoading">
      <CharacterBuilder :character="character" @change="changeHandler"/>
    </div>
    <v-alert type="info" v-else>Loading..</v-alert>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';

import CharacterBuilder from '@/components/characters/character-builder/CharacterBuilder.vue';
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
  hasUnsavedChanges = false;

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
    if (this.$route.meta!.edit) {
      dispatchFetchCharacterByUuid(this.$store, {characterUuid: this.$route.params.uuid});
    } else if (this.$route.meta!.new) {
      commitSetCharacter(this.$store, {character: new Character()});
    } else if (this.characterId) {
      // This is the route we take when the user is basing the character on a monster (monsters have an ID, not UUID)
      dispatchFetchCharacterById(this.$store, {id: this.characterId});
    }
  }

  changeHandler(hasChanges) {
    this.hasUnsavedChanges = hasChanges;
  }

  public beforeRouteLeave(to, from, next) {
    if (!this.hasUnsavedChanges || this.$route.meta!.new) {
      next();
      return;
    }

    this.$root.$confirm({
      title: 'Unsaved changes',
      message: 'You have unsaved changes. Are you sure you want to leave?',
      options: {color: 'error'}
    }).then(resp => next(resp));

  }
}
</script>

<style>
</style>
