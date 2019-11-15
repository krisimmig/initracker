<template>
  <div class="u-flex">
    <div class="u-flex-50">
      <h2>Character Builder</h2>
      <form class="Form">

        <FormInput v-model="character.name" label="Name" />
        <FormSelect v-model="character.size" :options="optionsSize" label="Size" :optionSelected="character.size" />
        <FormSelect v-model="character.type" :options="optionsTypes" label="Type" :optionSelected="character.type" />
        <FormSelect v-model="character.alignment" :options="optionsAlignment" label="Alignment" :optionSelected="character.alignment" />

        <hr>

        <FormInput v-model.number="character.armor_class" label="Armor Class" />
        <FormInput v-model="character.armor_desc" label="Armor Description" />
        <FormInput v-model.number="character.hit_points" label="Hit points" />
        <FormInput v-model="character.hit_dice" label="Hit dice" />
        <FormInput v-model.number="character.speed.walk" label="Speed (walk)" />
        <FormInput v-model.number="character.speed.swim" label="Speed (swim)" />
        <FormInput v-model.number="character.speed.climb" label="Speed (climb)" />
        <FormInput v-model.number="character.speed.fly" label="Speed (fly)" />
        <FormInput v-model.number="character.speed.burrow" label="Speed (burrow)" />

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

        <h3>Special Abilites</h3>
        <div v-for="(specialAbility, index) in character.special_abilities" :key="`special-${index}`">
          <FormInput v-model="specialAbility.name" label="Name" />
          <FormTextarea v-model="specialAbility.desc" label="Description" />
          <button @click.prevent="removeSpecialAbility(index)">- Remove ability</button>
        </div>
        <button @click.prevent="addSpecialAbility">+ Add ability</button>

        <hr>


        <h3>Actions</h3>
        <div v-for="(action, index) in character.actions" :key="`action${index}`">
          <FormInput v-model="action.name" label="Name" />
          <FormTextarea v-model="action.desc" label="Description" />
          <button @click.prevent="removeAction(index)">- Remove action</button>
        </div>
        <button @click.prevent="addAction">+ Add action</button>

        <hr>

        <h3>Legendary Actions</h3>
        <div
          v-for="(legendaryAction, index) in character.legendary_actions"
          :key="`legendary-${index}`"
          style="margin-bottom: 5px; border-bottom: 1px solid lightgrey;"
        >
          <FormInput v-model="legendaryAction.name" label="Name" />
          <FormTextarea v-model="legendaryAction.desc" label="Description" />
          <button @click.prevent="removeLegendaryAction(index)">- Remove action</button>
        </div>
        <button @click.prevent="addLegendaryAction">+ Add action</button>
        
        <hr>

        <button @click.prevent="saveCharacter" :disabled="!hasChanged">Save</button>
        <button @click.prevent="deleteCharacter">Delete</button>
      </form>
    </div>

    <div class="u-flex-50">
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
  @Prop({ type: Object, required: true }) public character!: ICharacter;
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
    await dispatchDeleteCharacter(this.$store, { characterUuid: this.character.uuid });
    this.$router.push({ name: 'characters' });
  }

  public addLegendaryAction() {
    this.character.legendary_actions.push({
      name: 'Name',
      desc: 'Description',
    });
  }

  public removeLegendaryAction(index) {
    this.character.legendary_actions.splice(index, 1);
  }

  public addSpecialAbility() {
    this.character.special_abilities.push({
      name: 'Name',
      desc: 'Description',
    });
  }

  public removeSpecialAbility(index) {
    this.character.special_abilities.splice(index, 1);
  }

  public addAction() {
    this.character.actions.push({
      name: 'Name',
      desc: 'Description',
    });
  }

  public removeAction(index) {
    this.character.actions.splice(index, 1);
  }

  public mounted() {
    this.originalCharacter = this.character;
  }
}
</script>

<style>
</style>
