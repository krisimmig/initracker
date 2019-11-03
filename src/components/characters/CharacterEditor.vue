<template>
  <div class="IT-Flex">
    <div>
      <h2>Character Builder</h2>
      <form class="Form" v-if="ready">
        <p>Edting: <b></b></p>
        <hr>
      </form>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';
import { $enum } from 'ts-enum-util';

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
export default class CharacterEditor extends Vue {
  // public get optionsSize() {
  //   return $enum(CharacterSizes).map((value, name) => ({ value, name }));
  // }

  // public get optionsAlignment() {
  //   return $enum(CharacterAlignments).map((value, name) => ({ value, name: value }));
  // }

  // public get attributes() {
  //   return $enum(CharacterAttributes).map((value, name) => ({ value, name }));
  // }
}
</script>

<style>
</style>
