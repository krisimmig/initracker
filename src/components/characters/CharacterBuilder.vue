<template>
  <div>
    <div>
      <Button is-success @click="saveCharacter" :disabled="!hasChanged">Save</Button>
      <Button is-danger v-if="!isNewCharacter" @click="deleteCharacter">Delete</Button>
    </div>

    <div class="CharacterBuilder flex">
      <div class="w-1/2 mr-3 card card--rounded card--shadow">
        <div class="CharacterBuilder-wrapper u-scrollBoxParent">
          <div class="u-scrollBoxChild">

            <form class="Form">
              <div class="u-columns-2">
                <FormInput v-model="character.name" label="Name" />
                <FormInput v-model="character.challenge_rating" label="Challenge rating" />
              </div>

              <div class="u-columns-3">
                <FormSelect v-model="character.size" :options="optionsSize" label="Size" :optionSelected="character.size" />
                <FormSelect v-model="character.type" :options="optionsTypes" label="Type" :optionSelected="character.type" />
                <FormSelect v-model="character.alignment" :options="optionsAlignment" label="Alignment" :optionSelected="character.alignment" />
              </div>

              <div class="u-columns-2">
                <FormInput v-model.number="character.armor_class" label="Armor Class" />
                <FormInput v-model="character.armor_desc" label="Armor Description" />
              </div>

              <div class="u-columns-2">
                <FormInput v-model.number="character.hit_points" label="Hit points" />
                <FormInput v-model="character.hit_dice" label="Hit dice" />
              </div>

              <div class="u-columns-6">
                <FormInput v-model.number="character.strength" label="STR" />
                <FormInput v-model.number="character.dexterity" label="DEX" />
                <FormInput v-model.number="character.constitution" label="CON" />
                <FormInput v-model.number="character.intelligence" label="INT" />
                <FormInput v-model.number="character.wisdom" label="WIS" />
                <FormInput v-model.number="character.charisma" label="CHR" />
              </div>

              <p><b>Speed:</b></p>
              <div class="u-columns-5">
                <FormInput v-model.number="character.speed.walk" label="Walk" />
                <FormInput v-model.number="character.speed.swim" label="Swim" />
                <FormInput v-model.number="character.speed.climb" label="Climb" />
                <FormInput v-model.number="character.speed.fly" label="Fly" />
                <FormInput v-model.number="character.speed.burrow" label="Burrow" />
              </div>

              <FormInput v-model="character.senses" label="Senses" />
              <FormInput v-model="character.languages" label="Languages" />
              <FormInput v-model="character.damage_immunities" label="Damage Immunities" />
              <FormInput v-model="character.damage_resistances" label="Damage Resistances" />
              <FormInput v-model="character.damage_vulnerabilities" label="Damage Vulnerabilities" />
            </form>

            <form class="Form">
              <h3>Special Abilities</h3>
              <div
                class="CharacterBuilder-removable"
                v-for="(specialAbility, index) in character.special_abilities"
                :key="`special-${index}`"
              >
                <Collapsable>
                  <template v-slot:title>
                    <p class="CharacterBuilder-actionTitle">{{ specialAbility.name }}</p>
                  </template>

                  <template v-slot:content>
                    <FormInput v-model="specialAbility.name" label="Name" />
                    <FormTextarea v-model="specialAbility.desc" label="Description" />
                    <Button is-danger @click="removeSpecialAbility(index)">- Remove {{ specialAbility.name }}</Button>
                  </template>
                </Collapsable>
              </div>
              <div>
                <Button @click="addSpecialAbility">+ Add ability</Button>
              </div>
            </form>

            <form class="Form">
              <h3>Actions</h3>
              <div
                class="CharacterBuilder-removable"
                v-for="(action, index) in character.actions"
                :key="`action${index}`"
              >
                <Collapsable>
                  <template v-slot:title>
                    <p class="CharacterBuilder-actionTitle">{{ action.name }}</p>
                  </template>

                  <template v-slot:content>
                    <FormInput v-model="action.name" label="Name" />
                    <FormTextarea v-model="action.desc" label="Description" />
                    <Button is-danger @click="removeAction(index)">- Remove {{ action.name }}</Button>
                  </template>
                </Collapsable>
              </div>
              <div>
                <Button @click="addAction">+ Add action</Button>
              </div>
            </form>

            <form class="Form">
              <h3>Legendary Actions</h3>
              <div
                class="CharacterBuilder-removable"
                v-for="(legendaryAction, index) in character.legendary_actions"
                :key="`legendary-${index}`"
              >
                <Collapsable>
                  <template v-slot:title>
                    <p class="CharacterBuilder-actionTitle">{{ legendaryAction.name }}</p>
                  </template>

                  <template v-slot:content>
                    <FormInput v-model="legendaryAction.name" label="Name" />
                    <FormTextarea v-model="legendaryAction.desc" label="Description" />
                    <Button is-danger @click="removeLegendaryAction(index)">- Remove {{ legendaryAction.name }}</Button>
                  </template>
                </Collapsable>
              </div>
              <Button @click="addLegendaryAction">+ Add legendary action</Button>
            </form>

            <div>
              <Button is-success @click="saveCharacter" :disabled="!hasChanged">Save</Button>
              <Button is-danger v-if="!isNewCharacter" @click="deleteCharacter">Delete</Button>
            </div>
          </div>
        </div>
      </div>

      <div class="w-1/2">
        <div class="CharacterBuild-preview u-scrollBoxParent">
          <div class="u-scrollBoxChild">
            <CharacterDetails :characterData="character"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { isEqual, clone } from 'lodash';
import { Component, Vue, Prop } from 'vue-property-decorator';
import { $enum } from 'ts-enum-util';

import { Character } from '@/classes/Character';
import CreatureTypes from '@/types/creatureTypes';
import { dispatchSaveCharacter, dispatchDeleteCharacter } from '@/store/characterBuilderModule';
import CharacterDetails from '@/components/characters/CharacterDetails.vue';
import FormInput from '@/components/form/FormInput.vue';
import FormSelect from '@/components/form/FormSelect.vue';
import FormTextarea from '@/components/form/FormTextarea.vue';
import Collapsable from '@/components/common/Collapsable.vue';
import { CharacterRaces } from '@/types/characterRaces';
import CharacterAlignments from '@/types/characterAlignments';
import CharacterSizes from '@/types/characterSizes';
import Button from '@/components/common/Button.vue';

@Component({
  components: {
    Button,
    CharacterDetails,
    FormInput,
    FormSelect,
    FormTextarea,
    Collapsable,
  },
})
export default class CharacterBuilder extends Vue {
  @Prop({ type: Object, required: true }) public character!: Character;

  public originalCharacter: Character | null = null;
  public isNewCharacter = false;

  public get hasChanged() {
    return !isEqual(this.originalCharacter, this.character);
  }

  public get optionsSize() {
    return $enum(CharacterSizes).map((value, name) => ({ value, name }));
  }

  public get optionsTypes() {
    const types = { ...CreatureTypes, ...CharacterRaces };
    return $enum(types).map((value, name) => ({ name: value, value: name }));
  }

  public get optionsAlignment() {
    return $enum(CharacterAlignments).map((value) => ({ value, name: value }));
  }

  public saveCharacter(): void {
    dispatchSaveCharacter(this.$store, { character: this.character }).then(() => {
      this.originalCharacter = { ...this.character };
    });
  }

  public async deleteCharacter() {
    await dispatchDeleteCharacter(this.$store, { characterUuid: this.character.uuid });
    await this.$router.push({name: 'characters'});
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
    this.originalCharacter = clone(this.character);
    this.isNewCharacter = !!this.$route.query.new;
  }
}
</script>

<style lang="scss">
.CharacterBuilder-wrapper.u-scrollBoxParent {
  height: calc(100vh - 212px);
}

.CharacterBuild-preview.u-scrollBoxParent {
  height: calc(100vh - 180px);
}

.CharacterBuilder .Form {
  @apply mb-8;
}

.CharacterBuilder-actionTitle {
  @apply
    transition
    duration-200
    ease-in-out
    text-gray-600
    bg-gray-400
    px-4
    py-2
    rounded
    mb-2
    text-lg
    cursor-pointer;
}

.CharacterBuilder-actionTitle:hover {
  @apply bg-gray-300;
}
</style>
