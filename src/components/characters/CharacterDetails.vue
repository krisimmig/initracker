<template>
  <div class="text-sm overflow-hidden bg-white">
    <div class="p-4 bg-gray-500">
      <h4 class="mb-0 text-base font-semibold">{{ characterData.name }}</h4>
      <p class="mb-0 italic">{{ characterData.size }}, {{ characterData.alignment }} {{ characterData.type }} with a CR of {{ characterData.challenge_rating }}</p>
    </div>

    <div class="bg-gray-400">

      <div class="flex justify-between px-4 py-3">
        <div
            class="w-full"
            v-for="(statName, statValue, index) in statsArray"
            :key="index"
        >
          <p class="uppercase mb-0 font-bold">{{ statValue }}</p>
          <p class="m-0 mt-1">
            {{ characterData[statName.toLowerCase()] }}
            <span class="text-gray-600 text-xs">{{ stringModifier(characterData[statName.toLowerCase()]) }}</span>
          </p>
        </div>
      </div>
    </div>

    <div class="p-4 bg-gray-300">
      <div class="flex">
        <div class="w-1/2 flex items-center">
          <CharacterHealth :uuid="characterData.uuid" :hp="characterData.hit_points" />
          <p class="ml-2 mb-0"><b>Dice:</b> {{ characterData.hit_dice }}</p>
        </div>
        <div class="w-1/2 flex items-center">
          <CharacterArmorClass :armorClass="characterData.armor_class" />
          <p v-if="characterData.armor_desc">{{ characterData.armor_desc }}</p>
          <p class="mb-0" v-else>Armor Class</p>
        </div>
      </div>

      <p class="mt-3">
        <span class="font-bold">Speed</span> {{ speedString }}
      </p>
      <p class="mb-2" v-if="characterData.senses">
        <span class="font-bold">Senses</span> {{ characterData.senses }}
      </p>
      <p v-if="characterData.languages">
        <span class="font-bold">Languages</span> {{ characterData.languages }}
      </p>
      <p v-if="characterData.challenge_rating">
        <span class="font-bold">Challenge Rating</span> {{ characterData.challenge_rating }}
      </p>
      <p v-if="characterData.damage_immunities">
        <span class="font-bold">Damage Immunities</span> {{ characterData.damage_immunities }}
      </p>
      <p v-if="characterData.damage_resistances">
        <span class="font-bold">Damage Resistances</span> {{ characterData.damage_resistances }}
      </p>
      <p v-if="characterData.damage_vulnerabilities">
        <span class="font-bold">Damage Vulnerabilities</span> {{ characterData.damage_vulnerabilities }}
      </p>
    </div>

    <div class="p-4">
      <template v-if="characterData.special_abilities">
        <p v-for="(specialAbility, index) in characterData.special_abilities" :key="`special-${index}`">
          <span class="font-bold">{{ specialAbility.name }}.</span> {{ specialAbility.desc }}
        </p>
      </template>

      <template v-if="characterData.actions">
        <h3 class="CharacterDetails-sectionHeadline">Actions</h3>
        <p v-for="(action, index) in characterData.actions" :key="index">
          <span class="font-bold">{{ action.name }}.</span> {{ action.desc }}
        </p>
      </template>

      <template v-if="characterData.legendary_actions">
        <h3 class="CharacterDetails-sectionHeadline">Legendary Actions</h3>
        <p>The {{ characterData.name }} can take 3 legendary actions, choosing from the options below. Only one
          legendary action option can be used at a time and only at the end of another creature's turn. The {{
          characterData.name }} regains spent legendary actions at the start of its turn.</p>
        <p v-for="(action, index) in characterData.legendary_actions" :key="`legendary-${index}`">
          <span class="font-bold">{{ action.name }}.</span> {{ action.desc }}
        </p>
      </template>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

import { Character } from '@/classes/Character';
import { stringModifier as calculateStringModifier } from '@/utils/dnd';
import CharacterArmorClass from '@/components/characters/common/CharacterArmorClass.vue';
import CharacterHealth from '@/components/characters/common/CharacterHealth.vue';
import { CharacterAttributes } from '@/types/characters';

@Component({
  components: {
    CharacterArmorClass,
    CharacterHealth,
  },
})
export default class CharacterDetails extends Vue {
  @Prop({ type: Object, required: true }) public characterData!: Character;
  @Prop({ type: Boolean, default: false }) public isWide!: boolean;


  public speedString: string = '';

  public stringModifier(abilityScore: number): number | string {
    return calculateStringModifier(abilityScore);
  }

  public get statsArray() {
    return CharacterAttributes;
  }

  @Watch('characterData.speed', { immediate: true, deep: true })
  public updateSpeedString(speedObj: object) {
    const keys = Object.keys(speedObj);
    this.speedString = keys.reduce((acc, current)  => {
      const value = speedObj[current];
      if (value > 0) {
        return acc !== '' ? `${acc}, ${value}ft (${current})` : `${value}ft (${current})`;
      }
      return acc;
    }, '');
  }
}
</script>

<style lang="scss">
  .CharacterDetails-sectionHeadline {
    @apply mt-8 text-gray-500 text-base;
  }
</style>
