<template >
  <div >
    <div class="mb-4">
      <v-btn
          color="success"
          @click="saveCharacter"
          :disabled="!hasChanged"
          class="mr-2"
      >Save
      </v-btn >
      <v-btn
          color="error"
          v-if="!isNewCharacter"
          @click="deleteCharacter"
      >Delete
      </v-btn >
    </div >

    <v-row >
      <v-col col="8">
        <v-sheet
            class="CharacterBuilder-wrapper pa-4"
            elevation="1"
        >
          <form class="Form">
            <v-text-field
                class="text-h6"
                v-model="character.name"
                label="Name"
            />
            <div class="d-flex">
              <v-text-field
                  v-model="character.challenge_rating"
                  label="Challenge rating"
              />
              <v-select
                  outlined
                  v-model="character.category"
                  :items="optionsCategory"
                  item-text="name"
                  label="Category"
                  :optionSelected="character.category"
              />
            </div >

            <div class="d-flex">
              <v-select
                  outlined
                  v-model="character.size"
                  :items="optionsSize"
                  item-text="name"
                  label="Size"
                  :optionSelected="character.size"
              />
              <v-select
                  outlined
                  v-model="character.type"
                  :items="optionsTypes"
                  label="Type"
                  item-text="name"
                  :optionSelected="character.type"
              />
              <v-select
                  outlined
                  v-model="character.alignment"
                  :items="optionsAlignment"
                  item-text="name"
                  label="Alignment"
                  :optionSelected="character.alignment"
              />
            </div >

            <div class="d-flex">
              <v-text-field
                  v-model.number="character.armor_class"
                  prepend-icon="mdi-shield"
                  label="Armor Class"
                  type="number"
                  min="0"
              />
              <v-text-field
                  v-model="character.armor_desc"
                  label="Armor Description"
              />
            </div >

            <div class="d-flex">
              <v-text-field
                  v-model.number="character.hit_points"
                  prepend-icon="mdi-heart"
                  label="Hit points"
                  type="number"
                  min="0"
              />
              <v-text-field
                  v-model="character.hit_dice"
                  label="Hit dice"
              />
            </div >

            <div class="d-flex">
              <v-text-field
                  v-model.number="character.strength"
                  label="STR"
                  type="number"
                  min="0"
              />
              <v-text-field
                  v-model.number="character.dexterity"
                  label="DEX"
                  type="number"
                  min="0"
              />
              <v-text-field
                  v-model.number="character.constitution"
                  label="CON"
                  type="number"
                  min="0"
              />
              <v-text-field
                  v-model.number="character.intelligence"
                  label="INT"
                  type="number"
                  min="0"
              />
              <v-text-field
                  v-model.number="character.wisdom"
                  label="WIS"
                  type="number"
                  min="0"
              />
              <v-text-field
                  v-model.number="character.charisma"
                  label="CHR"
                  type="number"
                  min="0"
              />
            </div >

            <p ><b >Speed:</b ></p >
            <div class="d-flex">
              <v-text-field
                  v-model.number="character.speed.walk"
                  label="Walk"
                  type="number"
                  min="0"
              />
              <v-text-field
                  v-model.number="character.speed.swim"
                  label="Swim"
                  type="number"
                  min="0"
              />
              <v-text-field
                  v-model.number="character.speed.climb"
                  label="Climb"
                  type="number"
                  min="0"
              />
              <v-text-field
                  v-model.number="character.speed.fly"
                  label="Fly"
                  type="number"
                  min="0"
              />
              <v-text-field
                  v-model.number="character.speed.burrow"
                  label="Burrow"
                  type="number"
                  min="0"
              />
            </div >

            <v-text-field
                v-model="character.senses"
                hint="e.g. darkvision 60 ft., passive Perception 12"
                label="Senses"
            />
            <v-text-field
                v-model="character.languages"
                hint="e.g. Common, Dwarvish"
                label="Languages"
            />
            <v-text-field
                v-model="character.damage_immunities"
                hint="e.g. lightning, poison"
                label="Damage Immunities"
            />
            <v-text-field
                v-model="character.damage_resistances"
                hint="e.g. cold; bludgeoning, piercing, and slashing from nonmagical weapons"
                label="Damage Resistances"
            />
            <v-text-field
                v-model="character.damage_vulnerabilities"
                hint="e.g. bludgeoning, fire"
                label="Damage Vulnerabilities"
            />
          </form >

          <CharacterAbilitiesEditor
              title="Special abilites"
              type="special_abilities"
              :abilities="character.special_abilities"
              @change="handleAbilityChange"
          />

          <CharacterAbilitiesEditor
              title="Actions"
              type="actions"
              :abilities="character.actions"
              @change="handleAbilityChange"
          />

          <CharacterAbilitiesEditor
              title="Legendary actions"
              type="legendary_actions"
              :abilities="character.legendary_actions"
              @change="handleAbilityChange"
          />

          <v-btn
              color="success"
              @click="saveCharacter"
              :disabled="!hasChanged"
              class="mr-2"
          >Save
          </v-btn >
          <v-btn
              color="error"
              v-if="!isNewCharacter"
              @click="deleteCharacter"
          >Delete
          </v-btn >
        </v-sheet >
      </v-col >

      <v-col >
        <CharacterDetails :characterData="character"/>
      </v-col >
    </v-row >
  </div >
</template >

<script lang='ts'>
import { clone, isEqual } from 'lodash';
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { $enum } from 'ts-enum-util';

import { Character } from '@/classes/Character';
import CreatureTypes from '@/types/creatureTypes';
import { dispatchSaveCharacter, dispatchDeleteCharacter } from '@/store/characterBuilderModule';
import CharacterDetails from '@/components/characters/CharacterDetails.vue';
import Collapsable from '@/components/common/Collapsable.vue';
import { CharacterRaces } from '@/types/characterRaces';
import CharacterAlignments from '@/types/characterAlignments';
import CharacterSizes from '@/types/characterSizes';
import CharacterAbilitiesEditor from "@/components/characters/character-builder/CharacterAbilitiesEditor.vue";
import CharacterCategories from "@/types/characterCategories";

@Component({
  components: {
    CharacterAbilitiesEditor, CharacterDetails, Collapsable,
  },
})
export default class CharacterBuilder extends Vue {
  public originalCharacter: Character | null = null;
  public isNewCharacter: boolean = true;

  @Prop({type: Object, required: true}) public character!: Character;

  @Watch('character', {deep: true})
  public onCharacterChange() {
    this.$emit('change', !isEqual(this.originalCharacter, this.character));
  }

  @Watch('$route', {deep: true})
  public onRouteChange() {
    this.isNewCharacter = this.$router.currentRoute.name !== 'editCharacter';
  }

  @Watch('originalCharacter', {deep: true})
  public onOriginalCharacterChange() {
    this.$emit('change', !isEqual(this.originalCharacter, this.character));
  }

  public get hasChanged() {
    return !isEqual(this.originalCharacter, this.character);
  }

  public get optionsSize() {
    return $enum(CharacterSizes).map((value, name) => ({value, name}));
  }

  public get optionsCategory() {
    return $enum(CharacterCategories).map((value, name) => ({value, name}));
  }

  public get optionsTypes() {
    const types = {...CreatureTypes, ...CharacterRaces};
    return $enum(types).map((name, value) => ({value, name}));
  }

  public get optionsAlignment() {
    return $enum(CharacterAlignments).map((value) => ({value, name: value}));
  }

  public saveCharacter(): void {
    dispatchSaveCharacter(this.$store, {character: this.character})
        .then(() => {
          this.originalCharacter = clone(this.character);
        });
  }

  public async deleteCharacter() {
    const options = {
      message: 'Are you sure you want to delete this character?',
      options: {
        color: 'error',
      },
    };

    this.$root.$confirm(options).then((result) => {
      if (result) {
        dispatchDeleteCharacter(this.$store, {characterUuid: this.character.uuid});
        this.$router.push({name: 'characters'});
      }
    })
  }

  public handleAbilityChange(payload) {
    const abilities = [...this.character[payload.type]];

    if (payload.remove) {
      abilities.splice(payload.index, 1);
      Vue.set(this.character, payload.type, abilities);
      return;
    }

    const newAbility = {name: payload.name, desc: payload.desc};

    if (payload.new) {
      abilities.push(newAbility);
    } else {
      abilities[payload.index] = newAbility;
    }

    Vue.set(this.character, payload.type, abilities);
  }

  public mounted() {
    this.originalCharacter = clone(this.character);
    this.isNewCharacter = this.$router.currentRoute.name !== 'editCharacter';
  }
}
</script >

<style lang="scss">
.CharacterBuilder-wrapper .v-input {
  margin-right: 0.7rem;
}

.CharacterBuilder .Form {
  margin-bottom: 3rem;
}

</style >
