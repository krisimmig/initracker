<template>
  <div class="IT-Flex">
    <div>
      <h1>Character Builder</h1>
      <form class="Form">

        <FormInput v-model="name" label="Name" />
        <FormInput v-model.number="armorClass" :numberType="true" label="AC" />
        <FormInput
          v-for="(attr, index) in attributes"
          :key="index"
          v-model.number="Dexterity"
          :numberType="true"
          :label="`${attr.name} (${attr.value})`"
        />
        <FormSelect v-model="selectedSize" label="Size" :options="optionsSize" />
        <FormSelect v-model="selectedAlignment" label="Alignment" :options="optionsAlignment" />
        <FormTextarea v-model="description" label="Description" />
        <p v-if="Dexterity">dex: {{ Dexterity }}</p>
      </form>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import { CharacterAttributes, ICharacter, CharacterSizes, CharacterAlignments } from '../types/characters';
import { $enum } from 'ts-enum-util';

import FormInput from '../components/form/FormInput.vue';
import FormSelect from '../components/form/FormSelect.vue';
import FormTextarea from '../components/form/FormTextarea.vue';

@Component({
  components: {
    FormInput,
    FormSelect,
    FormTextarea,
  },
})
export default class CharacterBuilder extends Vue {
  public name: string = '';
  public armorClass: number = 10;
  public description: string = '';
  public selectedSize = CharacterSizes.Medium;
  public selectedAlignment = CharacterAlignments.LawfulGood;
  public Dexterity: number = 10;

  public get optionsSize() {
    return $enum(CharacterSizes).map((value, name) => ({ value, name }));
  }

  public get optionsAlignment() {
    return $enum(CharacterAlignments).map((value, name) => ({ value, name: value }));
  }

  public get attributes() {
    return $enum(CharacterAttributes).map((value, name) => ({ value, name }));
  }
}
</script>

<style>
</style>
