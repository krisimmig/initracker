<template>
  <div class="NpcDetails NpcDetails-wrapper">
    <div class="NpcDetails-title">
      <h2 class="NpcDetails-name">{{ npcData.name }}</h2>
      <p class="NpcDetails-subtitle">{{ npcData.size }}, {{ npcData.alignment }} {{ npcData.type }} with a CR of {{ npcData.challenge_rating }}</p>
    </div>

    <div class="NpcDetails-top NpcDetails-contentPadding">
      <div class="NpcDetails-armorAndHealth">
        <div class="NpcDetails-column">
          <NpcArmorClass :armorClass="npcData.armor_class" />
          <p v-if="npcData.armor_desc">{{ npcData.armor_desc }}</p>
          <p v-else>Armor Class</p>
        </div>
        <div class="NpcDetails-column">
          <NpcHealth :uuid="npcData.uuid" :hp="npcData.hit_points" :maxHp="npcData.hit_points" />
          <p>{{ npcData.hit_dice }}</p>
        </div>
      </div>

      <div class="NpcDetails-stats">
        <div class="NpcDetails-stat" v-for="(statName, statValue, index) in statsArray" :key="index">
          <p class="NpcDetails-statTitle">{{ statValue }}</p>
          <p class="NpcDetails-statValue">
            {{ npcData[statName.toLowerCase()] }} <span class="NpcDetails-statModifier">{{ stringModifier(npcData[statName.toLowerCase()]) }}</span>
          </p>
        </div>
      </div>

      <p class="NpcDetails-textLine NpcDetails-textLine--speed">
        <span class="u-bold">Speed</span> {{ speedString }}
      </p>
      <p class="NpcDetails-textLine" v-if="npcData.senses">
        <span class="u-bold">Senses</span> {{ npcData.senses }}
      </p>
      <p class="NpcDetails-textLine" v-if="npcData.languages">
        <span class="u-bold">Languages</span> {{ npcData.languages }}
      </p>
      <p class="NpcDetails-textLine" v-if="npcData.challenge_rating">
        <span class="u-bold">Challenge Rating</span> {{ npcData.challenge_rating }}
      </p>
      <p class="NpcDetails-textLine" v-if="npcData.damage_immunities">
        <span class="u-bold">Damage Immunities</span> {{ npcData.damage_immunities }}
      </p>
      <p class="NpcDetails-textLine" v-if="npcData.damage_resistances">
        <span class="u-bold">Damage Resistances</span> {{ npcData.damage_resistances }}
      </p>
      <p class="NpcDetails-textLine" v-if="npcData.damage_vulnerabilities">
        <span class="u-bold">Damage Vulnerabilities</span> {{ npcData.damage_vulnerabilities }}
      </p>
    </div>

    <div class="NpcDetails-bottom NpcDetails-contentPadding">
      <template v-if="npcData.special_abilities">
        <p v-for="(specialAbility, index) in npcData.special_abilities" :key="`special-${index}`">
          <span class="u-bold">{{ specialAbility.name }}.</span> {{ specialAbility.desc }}
        </p>
      </template>

      <template v-if="npcData.actions">
        <h3>Actions</h3>
        <hr>
        <p v-for="(action, index) in npcData.actions" :key="index">
          <span class="u-bold">{{ action.name }}.</span> {{ action.desc }}
        </p>
      </template>

      <template v-if="npcData.legendary_actions">
        <h3>Legendary Actions</h3>
        <hr>
        <p>The {{ npcData.name }} can take 3 legendary actions, choosing from the options below. Only one legendary action option can be used at a time and only at the end of another creature's turn. The {{ npcData.name }} regains spent legendary actions at the start of its turn.</p>
        <p v-for="(action, index) in npcData.legendary_actions" :key="`legendary-${index}`">
          <span class="u-bold">{{ action.name }}.</span> {{ action.desc }}
        </p>
      </template>
    </div>
  </div>
</template>

<script lang='ts'>
// tslint:disable:variable-name
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

import { Character as ICharacter, Character } from '@/classes/Character';
import { stringModifier as calculateStringModifier } from '@/utils/dnd';
import NpcArmorClass from '@/components/npcs/common/NpcArmorClass.vue';
import NpcHealth from '@/components/npcs/common/NpcHealth.vue';
import { CharacterAttributes } from '@/types/characters';

@Component({
  components: {
    NpcArmorClass,
    NpcHealth,
  },
})
export default class NpcDetails extends Vue {
  @Prop({ type: Object, required: true }) public npcData!: ICharacter;
  @Prop({ type: Boolean, default: false }) public isWide!: boolean;

  public speedString: string = '';
  // public npc: Character = new Character();

  // public created() {
  //   this.npc = new Character(this.npcData);
  // }

  public stringModifier(abilityScore: number): number | string {
    return calculateStringModifier(abilityScore);
  }

  public get statsArray() {
    return CharacterAttributes;
  }

  @Watch('npcData.speed', { immediate: true, deep: true })
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
@import '@/scss/variables.scss';

$padding: 1em;

.NpcDetails {
  font-size: 14px;
}

.NpcDetails-title {
  background-color: $color-black;
  color: $color-3;
  padding: $padding;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.NpcDetails-name,
.NpcDetails-subtitle {
  margin: 0;
}

.NpcDetails-subtitle {
  margin-top: 0.5em;
  font-style: italic;
}

.NpcDetails-contentPadding {
  padding: $padding;
  padding-bottom: 1.8em;
}

.NpcDetails-top {
  background-color: $color-3;
}

.NpcDetails-textLine {
  margin-bottom: 0em;
  margin-top: .3em;
}

.NpcDetails-textLine--speed {
  margin-top: 1.5em;
  margin-bottom: 1.5em;
}

.NpcDetails-bottom {
  background-color: $color-8;
}

.NpcDetails-bottom p {
  line-height: 1.5em;
}

.NpcDetails-bottom h3 {
  margin-top: 2em;
  margin-bottom: 0.7em;
}

.NpcDetails-top .NpcArmorClass-icon {
  color: $color-white;
}

.NpcDetails-armorAndHealth {
  display: flex;
}

.NpcDetails-column {
  flex-basis: 50%;
  display: flex;
  align-items: center;
}

.NpcDetails-stats {
  display: flex;
  margin-top: 1em;
  justify-content: space-between;
}

.NpcDetails-statTitle {
  text-transform: uppercase;
  font-weight: 700;
  margin: 0;
}

.NpcDetails-statValue {
  color: $color-6;
  margin: 0;
  margin-top: 0.5em;
}

.NpcDetails-statModifier {
  font-weight: 100;
}
</style>
