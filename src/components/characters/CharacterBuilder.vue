<template>
  <div>
    <div class="mb-4">
      <v-btn color="success" @click="saveCharacter" :disabled="!hasChanged" class="mr-2">Save</v-btn>
      <v-btn color="error" v-if="!isNewCharacter" @click="deleteCharacter">Delete</v-btn>
    </div>

    <v-row>
      <v-col col="8">
        <v-sheet class="CharacterBuilder-wrapper pa-4" elevation="1">
          <form class="Form">
            <div class="d-flex">
              <v-text-field v-model="character.name" label="Name" />
              <v-text-field v-model="character.challenge_rating" label="Challenge rating" type="number" min="0" />
            </div>

            <div class="d-flex">
              <v-select outlined v-model="character.size" :items="optionsSize" item-text="name" label="Size" :optionSelected="character.size" />
              <v-select outlined v-model="character.type" :items="optionsTypes" label="Type" item-text="name" :optionSelected="character.type" />
              <v-select outlined v-model="character.alignment" :items="optionsAlignment" item-text="name" label="Alignment" :optionSelected="character.alignment" />
            </div>

            <div class="d-flex">
              <v-text-field v-model.number="character.armor_class" prepend-icon="mdi-shield" label="Armor Class" type="number" min="0" />
              <v-text-field v-model="character.armor_desc" label="Armor Description" />
            </div>

            <div class="d-flex">
              <v-text-field v-model.number="character.hit_points" prepend-icon="mdi-heart" label="Hit points" type="number" min="0" />
              <v-text-field v-model="character.hit_dice" label="Hit dice" />
            </div>

            <div class="d-flex">
              <v-text-field v-model.number="character.strength" label="STR" type="number" min="0" />
              <v-text-field v-model.number="character.dexterity" label="DEX" type="number" min="0" />
              <v-text-field v-model.number="character.constitution" label="CON" type="number" min="0" />
              <v-text-field v-model.number="character.intelligence" label="INT" type="number" min="0" />
              <v-text-field v-model.number="character.wisdom" label="WIS" type="number" min="0" />
              <v-text-field v-model.number="character.charisma" label="CHR" type="number" min="0" />
            </div>

            <p><b>Speed:</b></p>
            <div class="d-flex">
              <v-text-field v-model.number="character.speed.walk" label="Walk" type="number" min="0" />
              <v-text-field v-model.number="character.speed.swim" label="Swim" type="number" min="0" />
              <v-text-field v-model.number="character.speed.climb" label="Climb" type="number" min="0" />
              <v-text-field v-model.number="character.speed.fly" label="Fly" type="number" min="0" />
              <v-text-field v-model.number="character.speed.burrow" label="Burrow" type="number" min="0" />
            </div>

            <v-text-field v-model="character.senses" hint="e.g. darkvision 60 ft., passive Perception 12" label="Senses" />
            <v-text-field v-model="character.languages" hint="e.g. Common, Dwarvish" label="Languages" />
            <v-text-field v-model="character.damage_immunities" hint="e.g. lightning, poison" label="Damage Immunities" />
            <v-text-field v-model="character.damage_resistances" hint="e.g. cold; bludgeoning, piercing, and slashing from nonmagical weapons" label="Damage Resistances" />
            <v-text-field v-model="character.damage_vulnerabilities" hint="e.g. bludgeoning, fire" label="Damage Vulnerabilities" />
          </form>

          <CharacterBuilderAbilities
              title="Special Abilites"
              type="special_abilities"
              :abilities="character.special_abilities"
              @addAbility="onAddAbility"
              @removeAbility="onRemoveAbility"
          />

          <CharacterBuilderAbilities
              title="Actions"
              type="actions"
              :abilities="character.actions"
              @addAbility="onAddAbility"
              @removeAbility="onRemoveAbility"
          />

          <CharacterBuilderAbilities
              title="Legendary Actions"
              type="legendary_actions"
              :abilities="character.legendary_actions"
              @addAbility="onAddAbility"
              @removeAbility="onRemoveAbility"
          />

          <div>
            <v-btn @click="saveCharacter" :disabled="!hasChanged">Save</v-btn>
            <v-btn v-if="!isNewCharacter" @click="deleteCharacter">Delete</v-btn>
          </div>
        </v-sheet>
      </v-col>

      <v-col>
        <CharacterDetails :characterData="character" />
      </v-col>
    </v-row>
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
import Collapsable from '@/components/common/Collapsable.vue';
import { CharacterRaces } from '@/types/characterRaces';
import CharacterAlignments from '@/types/characterAlignments';
import CharacterSizes from '@/types/characterSizes';
import CharacterBuilderAbilities from "@/components/characters/CharacterBuilderAbilities.vue";

@Component({
  components: {
    CharacterBuilderAbilities,
    CharacterDetails,
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
    return $enum(types).map((name, value) => ({ value, name }));
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

  public onAddAbility({ type }:{ type: string}) {
    this.character[type].push({
      name: `New ${type.replace('_', ' ')}`,
      desc: 'Description',
    });
  }

  public onRemoveAbility({ type, index }: { type: string, index: number }) {
    this.character[type].splice(index, 1);
  }

  public mounted() {
    this.originalCharacter = clone(this.character);
    this.isNewCharacter = !!this.$route.query.new;
  }
}
</script>

<style lang="scss">
.CharacterBuilder-wrapper .v-input {
  margin-right: 0.7rem;
}

.CharacterBuilder .Form {
  margin-bottom: 3rem;
}

</style>
