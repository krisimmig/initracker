<template>
  <div class="stat-block" :class="{ wide: isWide }">
    <hr class="orange-border">
    <div class="column-container">
      <div class="creature-heading">
        <h1>{{ npcData.name }}</h1>
        <h2>{{ npcData.size }} {{ npcData.type }}, {{ npcData.alignment }}</h2>
      </div>

      <svg height="5" width="100%" class="tapered-rule">
        <polyline points="0,0 400,2.5 0,5"></polyline>
      </svg>

      <div class="top-stats">
        <div class="property-line first">
          <h4>Armor Class</h4>
          <p>{{ npcData.armor_class }} ({{ npcData.armor_desc }})</p>
        </div>

        <div class="property-line">
          <h4>Hit Points</h4>
          <p>{{ npcData.hit_points }} ({{ npcData.hit_dice }})</p>
        </div>

        <div class="property-line last">
          <h4>Speed</h4>
          <p>
            <span
              v-for="(value, name, index) in npcData.speed"
              :key="index"
            >
              {{ value }}ft ({{ name }})<template v-if="index + 1 < Object.keys(npcData.speed).length">, </template>
            </span>
          </p>
        </div>

        <svg height="5" width="100%" class="tapered-rule">
          <polyline points="0,0 400,2.5 0,5"></polyline>
        </svg>
        <div class="abilities">
          <div class="ability-strength">
            <h4>STR</h4>
            <p>{{ npcData.strength }} ({{ stringModifier(npcData.strength) }})</p>
          </div>

          <div class="ability-dexterity">
            <h4>DEX</h4>
            <p>{{ npcData.dexterity }} ({{ stringModifier(npcData.dexterity) }})</p>
          </div>

          <div class="ability-constitution">
            <h4>CON</h4>
            <p>{{ npcData.constitution }} ({{ stringModifier(npcData.constitution) }})</p>
          </div>

          <div class="ability-intelligence">
            <h4>INT</h4>
            <p>{{ npcData.intelligence }} ({{ stringModifier(npcData.intelligence) }})</p>
          </div>

          <div class="ability-wisdom">
            <h4>WIS</h4>
            <p>{{ npcData.wisdom }} ({{ stringModifier(npcData.wisdom) }})</p>
          </div>

          <div class="ability-charisma">
            <h4>CHA</h4>
            <p>{{ npcData.charisma }} ({{ stringModifier(npcData.charisma) }})</p>
          </div>

        </div>

        <svg height="5" width="100%" class="tapered-rule">
          <polyline points="0,0 400,2.5 0,5"></polyline>
        </svg>

        <div class="property-line first" v-if="npcData.damage_immunities">
          <h4>Damage Immunities</h4>
          <p>{{ npcData.damage_immunities }}</p>
        </div>

        <div class="property-line" v-if="npcData.condition_immunities">
          <h4>Condition Immunities</h4>
          <p>
            {{ npcData.condition_immunities }}
          </p>
        </div>

        <div class="property-line" v-if="npcData.senses">
          <h4>Senses</h4>
          <p>{{ npcData.senses }}</p>
        </div>

        <div class="property-line" v-if="npcData.languages">
          <h4>Languages</h4>
          <p>{{ npcData.languages }}</p>
        </div>

        <div class="property-line last">
          <h4>Challenge</h4>
          <p>{{ npcData.challenge_rating }}</p>
        </div>

      </div>

      <svg height="5" width="100%" class="tapered-rule">
        <polyline points="0,0 400,2.5 0,5"></polyline>
      </svg>

      <div class="property-block" v-if="npcData.special_abilities">
        <div
          class="special-ability"
          v-for="specialAbilty in npcData.special_abilities"
          :key="specialAbilty.name"
        >
          <h4>{{ specialAbilty.name }}.</h4>
          <p v-html="specialAbilty.desc"></p>
        </div>
      </div>

      <div class="actions" v-if="npcData.actions">
        <h3>Actions</h3>
        <div class="property-block">
          <div
            class="special-ability"
            v-for="action in npcData.actions"
            :key="npcData.name + action.name"
          >
            <h4>{{ action.name }}.</h4>
            <p v-html="action.desc"></p><br>
          </div>
        </div>

      </div>

      <div class="actions" v-if="npcData.legendary_actions">
        <h3>Legendary Actions</h3>
        <div class="property-block">
          <div
            class="special-ability"
            v-for="legendaryAction in npcData.legendary_actions"
            :key="legendaryAction.name"
          >
            <h4>{{ legendaryAction.name }}.</h4>
            <p>{{ legendaryAction.desc }}</p>
          </div>
        </div>

      </div>
    </div>

    <hr class="orange-border bottom">

  </div>
  <!-- stat block -->
</template>

<script lang='ts'>
// tslint:disable:variable-name
import { Component, Vue, Prop } from 'vue-property-decorator';

import { Character as ICharacter } from '@/classes/Character';
import { stringModifier as cm } from '@/utils/dnd';

@Component
export default class NpcDetails extends Vue {
  @Prop(Object) public npcData!: ICharacter;
  @Prop(Boolean) public isWide!: boolean;

  public stringModifier(abilityScore: number): number | string {
    return cm(abilityScore);
  }
}
</script>

<style>
.column-container {
  margin: 15px 0;
}

.wide .column-container {
  columns: 2;
  column-gap: 23px;
}

.stat-block {
  text-align: left;
  vertical-align: top;
  background: #FDF1DC;
  padding: 5px 10px 20px;
  box-shadow: 0 0 1.5em #867453;
}

.stat-block.wide {
  width: auto;
  width: 790px;
}

.stat-block.wide .section-left,
.stat-block.wide .section-right {
  display: inline-block;
  vertical-align: top;
  width: 48%;
  text-align: left;
}

.stat-block.wide .section-left {
  margin-right: 1.5%;
}

.stat-block.wide .section-right {
  margin-left: 1.5%;
}

@media screen and (max-width: 675px) {
  .stat-block.wide {
    min-width: 280px;
  }
  .stat-block.wide .section-left,
  .stat-block.wide .section-right {
    display: block;
    width: 100%;
  }
  .stat-block.wide .section-left {
    margin: 0;
  }
  .stat-block.wide .section-right {
    margin: 0;
  }
}

.orange-border {
  display: block;
  background: #E69A28;
  border: 1px solid #000;
  height: 5px;
  padding: 0 10px 0;
  margin: -10px -10px 0;
  box-sizing: initial;
}

.orange-border.bottom {
  margin: 15px -10px -20px;
}

.tapered-rule {
  display: block;
  width: 100%;
  height: 5px;
  border: none;
  color: #922610;
  fill: #922610;
  stroke: #922610;
}

.creature-heading h1 {
  font-family: 'Libre Baskerville', 'Lora', 'Calisto MT', 'Bookman Old Style', Bookman, 'Goudy Old Style', Garamond, 'Hoefler Text', 'Bitstream Charter', Georgia, serif;
  color: #922610;
  font-size: 23px;
  line-height: 1.2em;
  letter-spacing: 1px;
  font-variant: small-caps;
  font-weight: bold;
  margin-top: 0;
}

.creature-heading h2 {
  font-weight: normal;
  font-style: italic;
  font-size: 12px;
  line-height: 1.2em;
  margin: 0 0 10px;
}

.property-line h4,
.property-line p {
  display: inline;
  margin: 0;
  color: #922610;
  font-size: 13.5px;
  line-height: 1.2em;
}

.property-line h4 {
  color: #7A200D;
  margin-right: .4em;
}

.property-line {
  text-indent: -1em;
  padding-left: 1.1em;
  line-height: 1.4em;
}

.property-line.first {
  margin: 8px 0 0
}

.property-line.last {
  margin: 0 0 10px;
}

.abilities {
  text-align: center;
  color: #922610;
}

.abilities>div {
  display: inline-block;
  vertical-align: middle;
  width: 15.5%;
  min-width: 40px;
  font-size: 12px;
  line-height: 1em;
}

.abilities h4 {
  margin: 10px 0 2px;
  font-size: 14px;
  line-height: 1.2em;
  text-transform: uppercase;
  color: #7A200D;
}

.abilities p {
  margin: 0 0 10px;
  line-height: 1.2em;
}

.property-block h4,
.property-block p {
  font-size: 13.5px;
  line-height: 1.2em;
  display: inline;
  margin: 0;
  margin-right: .4em;
}

.property-block p {
  margin-bottom: 1em;
  white-space: pre-line;
}

.property-block h4 {
  font-style: italic;
}

.property-block {
  padding: 10px 2px 0;
}

.actions h3 {
  border-bottom: 1px solid #7A200D;
  color: #7A200D;
  font-size: 21px;
  font-variant: small-caps;
  font-weight: normal;
  letter-spacing: 1px;
  margin: 20px 0 0;
  padding: 0 0 10px;
  text-indent: 5px;
}

.actions {
  margin: 0 0 20px;
}

.actions:last-child {
  margin: 0;
}

@media print {
  .orange-border {
    display: none;
  }

  .stat-block,
  .stat-block.wide,
  .stat-block.wide .section-left,
  .stat-block.wide .section-right,
  .property-line,
  .property-block {
    width: 100%;
    display: block;
  }

  .stat-block.wide .section-left {
    margin: 0;
  }

  .stat-block.wide .section-right {
    margin: 0;
  }

  .stat-block {
    width: 40%;
    display: inline-block;
    vertical-align: top;
  }

  .stat-block.wide {
    page-break-after: always;
  }
}

@media screen and (max-width: 575px) {
  .stat-block {
    margin: 20px 0;
  }
}

.special-ability {
  margin-bottom: 1em;
}
</style>
