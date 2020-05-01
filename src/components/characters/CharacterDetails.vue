<template>
  <div class="CharacterDetails CharacterDetails-wrapper">
    <div class="CharacterDetails-title">
      <h2 class="CharacterDetails-name">{{ characterData.name }}</h2>
      <p class="CharacterDetails-subtitle">{{ characterData.size }}, {{ characterData.alignment }} {{ characterData.type
        }} with a CR of {{ characterData.challenge_rating }}</p>
    </div>

    <div class="CharacterDetails-top CharacterDetails-contentPadding">
      <div class="CharacterDetails-armorAndHealth">
        <div class="CharacterDetails-column">
          <CharacterArmorClass :armorClass="characterData.armor_class" />
          <p v-if="characterData.armor_desc">{{ characterData.armor_desc }}</p>
          <p v-else>Armor Class</p>
        </div>
        <div class="CharacterDetails-column">
          <CharacterHealth :uuid="characterData.uuid" :hp="characterData.hit_points" />
          <p class="CharacterDetails-hitDicePool"><b>Dice:</b> {{ characterData.hit_dice }}</p>
        </div>
      </div>

      <div class="CharacterDetails-stats">
        <div class="CharacterDetails-stat" v-for="(statName, statValue, index) in statsArray" :key="index">
          <p class="CharacterDetails-statTitle">{{ statValue }}</p>
          <p class="CharacterDetails-statValue">
            {{ characterData[statName.toLowerCase()] }} <span class="CharacterDetails-statModifier">{{ stringModifier(characterData[statName.toLowerCase()]) }}</span>
          </p>
        </div>
      </div>

      <p class="CharacterDetails-textLine CharacterDetails-textLine--speed">
        <span class="font-bold">Speed</span> {{ speedString }}
      </p>
      <p class="CharacterDetails-textLine" v-if="characterData.senses">
        <span class="font-bold">Senses</span> {{ characterData.senses }}
      </p>
      <p class="CharacterDetails-textLine" v-if="characterData.languages">
        <span class="font-bold">Languages</span> {{ characterData.languages }}
      </p>
      <p class="CharacterDetails-textLine" v-if="characterData.challenge_rating">
        <span class="font-bold">Challenge Rating</span> {{ characterData.challenge_rating }}
      </p>
      <p class="CharacterDetails-textLine" v-if="characterData.damage_immunities">
        <span class="font-bold">Damage Immunities</span> {{ characterData.damage_immunities }}
      </p>
      <p class="CharacterDetails-textLine" v-if="characterData.damage_resistances">
        <span class="font-bold">Damage Resistances</span> {{ characterData.damage_resistances }}
      </p>
      <p class="CharacterDetails-textLine" v-if="characterData.damage_vulnerabilities">
        <span class="font-bold">Damage Vulnerabilities</span> {{ characterData.damage_vulnerabilities }}
      </p>
    </div>

    <div class="CharacterDetails-bottom CharacterDetails-contentPadding">
      <template v-if="characterData.special_abilities">
        <p v-for="(specialAbility, index) in characterData.special_abilities" :key="`special-${index}`">
          <span class="font-bold">{{ specialAbility.name }}.</span> {{ specialAbility.desc }}
        </p>
      </template>

      <template v-if="characterData.actions">
        <h3>Actions</h3>
        <hr>
        <p v-for="(action, index) in characterData.actions" :key="index">
          <span class="font-bold">{{ action.name }}.</span> {{ action.desc }}
        </p>
      </template>

      <template v-if="characterData.legendary_actions">
        <h3>Legendary Actions</h3>
        <hr>
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

import { Character as ICharacter} from '@/classes/Character';
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
  @Prop({ type: Object, required: true }) public characterData!: ICharacter;
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
@import '../../scss/variables.scss';

$padding: 1em;

.CharacterDetails {
  font-size: 14px;
}

.CharacterDetails-title {
  background-color: $color-black;
  color: $color-3;
  padding: $padding;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.CharacterDetails-name,
.CharacterDetails-subtitle {
  margin: 0;
}

.CharacterDetails-subtitle {
  margin-top: 0.5em;
  font-style: italic;
}

.CharacterDetails-contentPadding {
  padding: $padding;
  padding-bottom: 1.8em;
}

.CharacterDetails-top {
  background-color: $color-3;
}

.CharacterDetails-textLine {
  margin-bottom: 0em;
  margin-top: .3em;
}

.CharacterDetails-textLine--speed {
  margin-top: 1.5em;
  margin-bottom: 1.5em;
}

.CharacterDetails-bottom {
  background-color: $color-8;
}

.CharacterDetails-bottom p {
  line-height: 1.5em;
}

.CharacterDetails-bottom h3 {
  margin-top: 2em;
}

.CharacterDetails-top .CharacterArmorClass-icon {
  color: $color-white;
}

.CharacterDetails-armorAndHealth {
  display: flex;
}

.CharacterDetails-hitDicePool {
  margin-left: .5em;
}

.CharacterDetails-column {
  flex-basis: 50%;
  display: flex;
  align-items: center;
}

.CharacterDetails-stats {
  display: flex;
  margin-top: 1em;
  justify-content: space-between;
}

.CharacterDetails-statTitle {
  text-transform: uppercase;
  font-weight: 700;
  margin: 0;
}

.CharacterDetails-statValue {
  color: $color-6;
  margin: 0;
  margin-top: 0.5em;
}

.CharacterDetails-statModifier {
  font-weight: 100;
}
</style>
