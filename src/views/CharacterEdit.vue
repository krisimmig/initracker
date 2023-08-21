<template >
  <div class="">
    <PageTitle
        title="Character editor"
        subtitle="Here you can create or edit an existing character."
    />

    <div v-if="!isLoading">
      <CharacterBuilder
          :character="character"
          :is-new-character="this.type !== 'edit'"
          @change="changeHandler"
      />
    </div >

    <v-alert
        type="info"
        v-else
    >Loading..
    </v-alert >
  </div >
</template >

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator';

import PageTitle from '@/components/common/PageTitle.vue';
import {
  commitSetCharacter,
  dispatchFetchCharacterById,
  dispatchFetchCharacterByUuid, readGetCharacter, readGetIsLoading
} from "@/store/characterBuilderModule";
import { Character } from "@/classes/Character";
import CharacterBuilder from "@/components/characters/character-builder/CharacterBuilder.vue";

@Component({
  components: {
    CharacterBuilder,
    PageTitle,
  },
})
export default class CharacterCreate extends Vue {
  hasUnsavedChanges = false;

  @Prop({default: ''}) uuid!: string;
  @Prop({default: 'edit'}) type!: string;

  get isLoading() {
    return readGetIsLoading(this.$store);
  }

  get character() {
    return readGetCharacter(this.$store);
  }

  mounted() {
    switch (this.type) {
      case 'edit':
      case 'base-character':
        dispatchFetchCharacterByUuid(this.$store, {characterUuid: this.uuid});
        break;
      case 'base-empty':
        commitSetCharacter(this.$store, {character: new Character()});
        break;
      case 'base-monster':
        dispatchFetchCharacterById(this.$store, {id: this.uuid});
        break;
      default:
        break;
    }
  }

  changeHandler(hasChanges) {
    this.hasUnsavedChanges = hasChanges;
  }

  public beforeRouteLeave(to, from, next) {
    if (this.hasUnsavedChanges) {
      this.$root.$confirm({
        title: 'Unsaved changes',
        message: 'You have unsaved changes. Are you sure you want to leave?',
        options: {color: 'error'}
      }).then(resp => next(resp));
    } else {
      next();
    }
  }
}
</script >
