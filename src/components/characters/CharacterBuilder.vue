<template>
  <div class="IT-Flex">
    <div class="IT-Flex-50">
      <h2>Character Builder</h2>
      <form class="Form">

        <FormInput v-model="character.name" label="Name" />
        <FormSelect v-model="character.size" :options="optionsSize" label="Size" :optionSelected="character.size" />
        <FormSelect v-model="character.type" :options="optionsTypes" label="Type" :optionSelected="character.type" />
        <FormSelect v-model="character.alignment" :options="optionsAlignment" label="Alignment" :optionSelected="character.alignment" />

        <hr>

        <FormInput v-model.number="character.armor_class" label="Armor Class" />
        <FormInput v-model="character.armor_desc" label="Armor Description" />

        <hr>

        <FormInput v-model.number="character.strength" label="Strength" />
        <FormInput v-model.number="character.dexterity" label="Dexterity" />
        <FormInput v-model.number="character.constitution" label="Constitution" />
        <FormInput v-model.number="character.intelligence" label="Intelligence" />
        <FormInput v-model.number="character.wisdom" label="Wisdom" />
        <FormInput v-model.number="character.charisma" label="Charisma" />

        <hr>

        <FormInput v-model="character.damage_immunities" label="Damage Immunities" />
        <FormInput v-model="character.senses" label="Senses" />
        <FormInput v-model="character.languages" label="Languages" />
        <FormInput v-model="character.challenge_rating" label="Challenge rating" />

        <hr>

        <div>
          <h3>Legendary Actions</h3>
        </div>
        <div v-for="(legendaryAction, index) in character.legendary_actions" :key="index">
          <FormInput
            v-model="legendaryAction.name"
            label="Name"
          />
          <FormInput
            v-model="legendaryAction.desc"
            label="Description"
          />
        </div>
        <hr>

        <button @click.prevent="saveCharacter" :disabled="!hasChanged">Save</button>
        <button @click.prevent="deleteCharacter">Delete</button>
      </form>
    </div>

    <div class="IT-Flex-50">
      <h2>Preview</h2>
      <NpcDetails :npcData="character" />
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';
import { $enum } from 'ts-enum-util';

import { Character as ICharacter } from '@/classes/Character';
import { CharacterSizes, CreatureTypes, CharacterAlignments } from '@/types/characters';
import { dispatchSaveCharacter, dispatchDeleteCharacter } from '@/store/characterBuilderModule';
import NpcDetails from '@/components/npcs/NpcDetails.vue';
import FormInput from '@/components/form/FormInput.vue';
import FormSelect from '@/components/form/FormSelect.vue';
import FormTextarea from '@/components/form/FormTextarea.vue';

@Component({
  components: {
    NpcDetails,
    FormInput,
    FormSelect,
    FormTextarea,
  },
})
export default class CharacterBuilder extends Vue {
  @Prop() public character!: ICharacter;
  private originalCharacter!: ICharacter;

  public get hasChanged() {
    return JSON.stringify(this.originalCharacter) === JSON.stringify(this.character) ;
  }

  public get optionsSize() {
    return $enum(CharacterSizes).map((value, name) => ({ value, name }));
  }

  public get optionsTypes() {
    return $enum(CreatureTypes).map((value, name) => ({ value, name }));
  }

  public get characterSize() {
    return this.character.size;
  }

  public get optionsAlignment() {
    return $enum(CharacterAlignments).map((value, name) => ({ value, name: value }));
  }

  // public get attributes() {
  //   return $enum(CharacterAttributes).map((value, name) => ({ value, name }));
  // }

  public saveCharacter(): void {
    dispatchSaveCharacter(this.$store, { character: this.character });
  }

  public async deleteCharacter() {
    await dispatchDeleteCharacter(this.$store, { uuid: this.character.uuid });
    this.$router.push({ name: 'characters' });
  }

  public mounted() {
    this.originalCharacter = this.character;
  }
}
</script>

<style>
</style>
