<template>
  <v-card>
    <div class="grey lighten-5">

    <v-card-title class="font-weight-light">{{ characterData.name }}</v-card-title>
    <v-card-subtitle class="caption">{{ getDescription() }}</v-card-subtitle>
    </div>


    <div class="body-2 text--primary pa-4">
      <div class="d-flex justify-space-between text-center">
        <div
          v-for="(statName, statValue, index) in statsArray"
          :key="index"
        >
          <p class="text-uppercase mb-0 font-weight-bold">{{ statValue }}</p>
          <p class="m-0 mt-1">
            {{ characterData[statName.toLowerCase()] }}
            <span class="text-gray-600 text-xs">{{ stringModifier(characterData[statName.toLowerCase()]) }}</span>
          </p>
        </div>
      </div>

      <v-divider class="my-2"></v-divider>
      <div class="d-flex justify-space-between">
        <div class="d-flex align-center">
          <CharacterHealth :uuid="characterData.uuid" :hp="characterData.hit_points" />
          <p class="mb-0 ml-2 font-weight-bold"><v-icon>mdi-dice-multiple</v-icon> {{ characterData.hit_dice }}</p>
        </div>
        <div class="d-flex align-center">
          <CharacterArmorClass :armorClass="characterData.armor_class" />
          <p class="mb-0 ml-2" v-if="characterData.armor_desc">{{ characterData.armor_desc }}</p>
          <p class="mb-0 ml-2 font-weight-bold" v-else>Armor Class</p>
        </div>
      </div>
      <v-divider class="my-2"></v-divider>

      <p class="mb-1">
        <span class="font-weight-bold">Speed</span> {{ getSpeedString() }}
      </p>
      <p v-if="characterData.senses" class="mb-1">
        <span class="font-weight-bold">Senses</span> {{ characterData.senses }}
      </p>
      <p v-if="characterData.languages" class="mb-1">
        <span class="font-weight-bold">Languages</span> {{ characterData.languages }}
      </p>
      <p v-if="characterData.challenge_rating" class="mb-1">
        <span class="font-weight-bold">Challenge Rating</span> {{ characterData.challenge_rating }}
      </p>
      <p v-if="characterData.damage_immunities" class="mb-1">
        <span class="font-weight-bold">Damage Immunities</span> {{ characterData.damage_immunities }}
      </p>
      <p v-if="characterData.damage_resistances" class="mb-1">
        <span class="font-weight-bold">Damage Resistances</span> {{ characterData.damage_resistances }}
      </p>
      <p v-if="characterData.damage_vulnerabilities" class="mb-1">
        <span class="font-weight-bold">Damage Vulnerabilities</span> {{ characterData.damage_vulnerabilities }}
      </p>
    </div>

    <div class="pa-4">
      <template v-if="characterData.special_abilities">
        <p v-for="(specialAbility, index) in characterData.special_abilities" :key="`special-${index}`">
          <span class="font-weight-bold">{{ specialAbility.name }}.</span> {{ specialAbility.desc }}
        </p>
      </template>

      <template v-if="characterData.actions.length > 0">
        <h3>Actions</h3>
        <v-divider class="my-2"></v-divider>
        <p v-for="(action, index) in characterData.actions" :key="index" class="mb-3">
          <span class="font-weight-bold">{{ action.name }}.</span> {{ action.desc }}
        </p>
      </template>

      <template v-if="characterData.legendary_actions.length > 0">
        <h3>Legendary Actions</h3>
        <v-divider class="my-2"></v-divider>
        <p>The {{ characterData.name }} can take 3 legendary actions, choosing from the options below. Only one
          legendary action option can be used at a time and only at the end of another creature's turn. The {{
          characterData.name }} regains spent legendary actions at the start of its turn.</p>
        <p v-for="(action, index) in characterData.legendary_actions" :key="`legendary-${index}`">
          <span class="font-weight-bold">{{ action.name }}.</span> {{ action.desc }}
        </p>
      </template>
    </div>
  </v-card>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

import { Character } from '@/classes/Character';
import { stringModifier } from '@/utils/dnd';
import CharacterArmorClass from '@/components/characters/common/CharacterArmorClass.vue';
import CharacterHealth from '@/components/characters/common/CharacterHealth.vue';
import { CharacterAttributes } from '@/types/characterAttributes';

@Component({
  components: {
    CharacterArmorClass,
    CharacterHealth,
  },
})
export default class CharacterDetails extends Vue {
  @Prop({ type: Object, required: true }) public characterData!: Character;
  @Prop({ type: Boolean, default: false }) public isWide!: boolean;

  private character!: Character;

  public created() {
    this.character = new Character(this.characterData);
  }

  public beforeUpdate() {
    this.character = new Character(this.characterData);
  }

  public stringModifier(abilityScore: number): number | string {
    return stringModifier(abilityScore);
  }

  public get statsArray() {
    return CharacterAttributes;
  }

  public getDescription(): string {
return this.character.getDescription();
  }

  public getSpeedString(): string {
    return this.character.getSpeedString();
  }
}
</script>
