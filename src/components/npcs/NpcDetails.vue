<template>
  <div class="NpcDetails u-scrollBoxParent NpcDetails-wrapper">
    <div class="NpcDetails-title">
      <h3 class="NpcDetails-name">{{ npcData.name }}</h3>
      <p class="NpcDetails-subtitle">{{ npcData.size }}, {{ npcData.alignment }}</p>
    </div>

    <div class="NpdDetails-top">
      <div class="NpcDetails-armorAndHealth">
        <div class="NpdDetails-column">
          <NpcArmorClass :armorClass="npcData.armor_class" />
          <p>{{ npcData.armor_desc }}</p>
        </div>
        <div class="NpdDetails-column">
          <NpcHealth :uuid="npcData.uuid" :hp="npcData.hit_points" :maxHp="npcData.hit_points" />
          <p>{{ npcData.hit_dice }}</p>
        </div>
      </div>

      <div class="NpdDetails-stats">
        <div class="NpdDetails-stat" v-for="(stat, index) in npc.stats" :key="index">
          <p class="NpdDetails-statTitle">{{ stat.name }}</p>
          <p class="NpdDetails-statValue">{{ stat.value }} ({{ stringModifier(stat.value) }})</p>
        </div>
      </div>

      <p class="NpdDetails-speed"><span class="u-semiBold">Speed</span> {{ npc.speedString }}</p>
      <p class="NpdDetails-speed"><span class="u-semiBold">Senses</span> {{ npc.senses }}</p>
      <p class="NpdDetails-speed"><span class="u-semiBold">Languages</span> {{ npc.languages }}</p>
      <p class="NpdDetails-speed"><span class="u-semiBold">Challenge Rating</span> {{ npc.challenge_rating }}</p>
    </div>
  </div>
</template>

<script lang='ts'>
// tslint:disable:variable-name
import { Component, Vue, Prop } from 'vue-property-decorator';

import { Character as ICharacter, Character } from '@/classes/Character';
import { stringModifier as cm } from '@/utils/dnd';
import NpcArmorClass from '@/components/npcs/common/NpcArmorClass.vue';
import NpcHealth from '@/components/npcs/common/NpcHealth.vue';

@Component({
  components: {
    NpcArmorClass,
    NpcHealth,
  },
})
export default class NpcDetails extends Vue {
  @Prop({ type: Object, required: true }) public npcData!: ICharacter;
  @Prop({ type: Boolean, default: false }) public isWide!: boolean;

  private npc!: Character;

  public created() {
    this.npc = new Character(this.npcData);
  }

  public stringModifier(abilityScore: number): number | string {
    return cm(abilityScore);
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

.NpdDetails-top {
  background-color: $color-3;
  padding: $padding;
}

.NpdDetails-top .NpcArmorClass-icon{
  color: $color-white;
}

.NpcDetails-armorAndHealth {
  display: flex;
}

.NpdDetails-column {
  flex-basis: 50%;
  display: flex;
  align-items: center;
}

.NpdDetails-stats {
  display: flex;
  justify-content: space-between;
}

.NpdDetails-statTitle {
  text-transform: uppercase;
  font-weight: 700;
  margin: 0;
}

.NpdDetails-statValue {
  color: $color-6;
  margin: 0;
}
</style>
