<template>
  <div class="IT-Flex">
    <div>
      <h2>Character Builder</h2>
      <p>Editing: <b>{{ character.name }}</b></p>
      <p>HitPoints: <b>{{ character.hit_points }}</b></p>
      <p>Alignment: <b>{{ character.alignment }}</b></p>

      <form class="Form">
        <FormInput v-model="character.name" label="Name" />
        <button @click.prevent="saveCharacter">Save</button>
      </form>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';
import { $enum } from 'ts-enum-util';

import { Character as ICharacter } from '@/classes/Character';
import { dispatchSaveCharacter } from '@/store/characterBuilderModule';
import FormInput from '@/components/form/FormInput.vue';
import FormSelect from '@/components/form/FormSelect.vue';
import FormTextarea from '@/components/form/FormTextarea.vue';

@Component({
  components: {
    FormInput,
    FormSelect,
    FormTextarea,
  },
})
export default class CharacterBuilder extends Vue {
  @Prop() public character!: ICharacter;

  // public get optionsSize() {
  //   return $enum(CharacterSizes).map((value, name) => ({ value, name }));
  // }

  // public get optionsAlignment() {
  //   return $enum(CharacterAlignments).map((value, name) => ({ value, name: value }));
  // }

  // public get attributes() {
  //   return $enum(CharacterAttributes).map((value, name) => ({ value, name }));
  // }

  public saveCharacter(): void {
    dispatchSaveCharacter(this.$store, { character: this.character });
  }
}
</script>

<style>
</style>
