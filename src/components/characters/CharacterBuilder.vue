<template>
  <div>
    <div>
      <v-btn color="success" @click="saveCharacter" :disabled="!hasChanged">Save</v-btn>
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
                  <v-text-field v-model="specialAbility.name" label="Name" />
                  <v-textarea v-model="specialAbility.desc" label="Description" />
                  <v-btn color="error" @click="removeSpecialAbility(index)">- Remove {{ specialAbility.name }}</v-btn>
                </template>
              </Collapsable>
            </div>
            <div>
              <v-btn @click="addSpecialAbility">+ Add ability</v-btn>
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
                  <v-text-field v-model="action.name" label="Name" />
                  <v-textarea v-model="action.desc" label="Description" />
                  <v-btn color="error" @click="removeAction(index)">- Remove {{ action.name }}</v-btn>
                </template>
              </Collapsable>
            </div>
            <div>
              <v-btn @click="addAction">+ Add action</v-btn>
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
                  <v-text-field v-model="legendaryAction.name" label="Name" />
                  <v-textarea v-model="legendaryAction.desc" label="Description" />
                  <v-btn color="error" @click="removeLegendaryAction(index)">- Remove {{ legendaryAction.name }}</v-btn>
                </template>
              </Collapsable>
            </div>
            <v-btn @click="addLegendaryAction">+ Add legendary action</v-btn>
          </form>

          <div>
            <v-btn @click="saveCharacter" :disabled="!hasChanged">Save</v-btn>
            <v-btn v-if="!isNewCharacter" @click="deleteCharacter">Delete</v-btn>
          </div>
        </v-sheet>
      </v-col>

      <v-col>
        <CharacterDetails :characterData="character"/>
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

@Component({
  components: {
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
.CharacterBuilder-wrapper .v-input {
  margin-right: 0.7rem;
}

.CharacterBuilder .Form {
  margin-bottom: 3rem;
}

</style>
