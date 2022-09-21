<template>
  <v-card class="CharacterDetails" outlined>
    <perfect-scrollbar>
      <div class="CharacterDetails-title">
        <v-card-title class="font-weight-medium">{{ characterData.name }}</v-card-title>
        <v-card-subtitle class="caption pb-1">{{ getDescription() }}</v-card-subtitle>
      </div>


      <div class="body-2 text--primary pa-4">
        <div class="d-flex justify-space-between text-center">
          <div
            v-for="(statName, statValue, index) in statsArray"
            :key="index"
          >
            <p class="text-uppercase mb-0 font-weight-bold">{{ statValue }}</p>
            <p class="ma-0 my-2">
              {{ characterData[statName.toLowerCase()] }}
              <span class="text-gray-600 text-xs">{{ stringModifier(characterData[statName.toLowerCase()]) }}</span>
            </p>
          </div>
        </div>

        <v-divider class="my-2" />
        <div class="d-flex">
          <div class="d-flex align-center">
            <CharacterHealth :uuid="characterData.uuid" :hp="characterData.hit_points" />
            <p class="mb-0 ml-2 font-weight-bold"><v-icon>mdi-dice-multiple</v-icon> {{ characterData.hit_dice }}</p>
          </div>
          <div class="d-flex align-center ml-6">
            <CharacterArmorClass :armorClass="characterData.armor_class" />
            <p class="mb-0 ml-2" v-if="characterData.armor_desc">{{ characterData.armor_desc }}</p>
            <p class="mb-0 ml-2 font-weight-bold" v-else>Armor Class</p>
          </div>
        </div>
        <v-divider class="my-2" />

        <p class="mb-1">
          <span class="font-weight-bold">Speed</span> {{ getSpeedString() }}
        </p>
        <p class="mb-1">
          <span class="font-weight-bold">Senses</span> {{ characterData.senses || "&mdash;" }}
        </p>
        <p class="mb-1">
          <span class="font-weight-bold">Languages</span> {{ characterData.languages || "&mdash;" }}
        </p>
        <p class="mb-1">
          <span class="font-weight-bold">Challenge Rating</span> {{ characterData.challenge_rating || "&mdash;" }}
        </p>
        <p class="mb-1">
          <span class="font-weight-bold">Damage Immunities</span> {{ characterData.damage_immunities || "&mdash;" }}
        </p>
        <p class="mb-1">
          <span class="font-weight-bold">Damage Resistances</span> {{ characterData.damage_resistances || "&mdash;" }}
        </p>
        <p class="mb-1">
          <span class="font-weight-bold">Damage Vulnerabilities</span> {{ characterData.damage_vulnerabilities || "&mdash;" }}
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
          <v-divider class="mb-2" />
          <p v-for="(action, index) in characterData.actions" :key="index" class="mb-3">
            <span class="font-weight-bold">{{ action.name }}.</span> {{ action.desc }}
          </p>
        </template>

        <template v-if="characterData.legendary_actions.length > 0">
          <h3>Legendary Actions</h3>
          <v-divider class="mb-2" />
          <p>The {{ characterData.name }} can take 3 legendary actions, choosing from the options below. Only one
            legendary action option can be used at a time and only at the end of another creature's turn. The {{
            characterData.name }} regains spent legendary actions at the start of its turn.</p>
          <p v-for="(action, index) in characterData.legendary_actions" :key="`legendary-${index}`">
            <span class="font-weight-bold">{{ action.name }}.</span> {{ action.desc }}
          </p>
        </template>
      </div>
    </perfect-scrollbar>
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

<style lang="scss">
.CharacterDetails-title {
  border-top: 4px solid #488fef;
}

.CharacterDetails .ps {
  max-height: calc(100vh - 95px);
}
</style>