<template>
  <v-card class="CharacterDetails" variant="outlined">
    <div style="overflow-y: auto; max-height: calc(100vh - 95px);">

      <!-- Header -->
      <v-card-item class="pb-1 pt-3">
        <v-card-title class="text-body-1 font-weight-bold pa-0">{{ characterData.name }}</v-card-title>
        <v-card-subtitle class="text-caption pa-0">{{ getDescription() }} &mdash; {{ characterData.category }}</v-card-subtitle>
      </v-card-item>

      <v-divider />

      <!-- Stat block -->
      <v-table density="compact" class="CharacterDetails-stats text-center">
        <thead>
          <tr>
            <th
              v-for="(statName, statValue) in statsArray"
              :key="statValue"
              class="text-uppercase text-center text-caption font-weight-bold"
            >
              {{ statValue }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td v-for="(statName, statValue) in statsArray" :key="`val-${statValue}`" class="text-center text-body-2">
              {{ characterData[statName.toLowerCase()] }}
              <span class="text-medium-emphasis text-caption"> {{ stringModifier(characterData[statName.toLowerCase()]) }}</span>
            </td>
          </tr>
        </tbody>
      </v-table>

      <v-divider />

      <!-- HP / AC row -->
      <div class="d-flex align-center ga-6 px-3 py-2">
        <div class="d-flex align-center ga-2">
          <CharacterHealth :uuid="characterData.uuid" :hp="characterData.hit_points" />
          <span class="text-body-2 font-weight-medium">
            <v-icon size="small">mdi-dice-multiple</v-icon>
            {{ characterData.hit_dice }}
          </span>
        </div>
        <div class="d-flex align-center ga-2">
          <CharacterArmorClass :armorClass="characterData.armor_class" />
          <span class="text-body-2 font-weight-medium">{{ characterData.armor_desc || 'Armor Class' }}</span>
        </div>
      </div>

      <v-divider />

      <!-- Properties list -->
      <div class="CharacterDetails-props px-3 py-2 text-body-2">
        <template v-if="getSpeedString()">
          <span class="CharacterDetails-label text-caption font-weight-bold text-medium-emphasis">Speed</span>
          <span>{{ getSpeedString() }}</span>
        </template>
        <template v-if="characterData.senses">
          <span class="CharacterDetails-label text-caption font-weight-bold text-medium-emphasis">Senses</span>
          <span>{{ characterData.senses }}</span>
        </template>
        <template v-if="characterData.languages">
          <span class="CharacterDetails-label text-caption font-weight-bold text-medium-emphasis">Languages</span>
          <span>{{ characterData.languages }}</span>
        </template>
        <template v-if="characterData.challenge_rating">
          <span class="CharacterDetails-label text-caption font-weight-bold text-medium-emphasis">CR</span>
          <span>{{ characterData.challenge_rating }}</span>
        </template>
        <template v-if="characterData.damage_immunities">
          <span class="CharacterDetails-label text-caption font-weight-bold text-medium-emphasis">Immunities</span>
          <span>{{ characterData.damage_immunities }}</span>
        </template>
        <template v-if="characterData.damage_resistances">
          <span class="CharacterDetails-label text-caption font-weight-bold text-medium-emphasis">Resistances</span>
          <span>{{ characterData.damage_resistances }}</span>
        </template>
        <template v-if="characterData.damage_vulnerabilities">
          <span class="CharacterDetails-label text-caption font-weight-bold text-medium-emphasis">Vulnerabilities</span>
          <span>{{ characterData.damage_vulnerabilities }}</span>
        </template>
      </div>

      <!-- Special abilities, Actions, Legendary Actions -->
      <template v-if="characterData.special_abilities?.length">
        <v-divider />
        <div class="pa-3 text-body-2">
          <p
            v-for="(ability, index) in characterData.special_abilities"
            :key="`special-${index}`"
            class="mb-2"
          >
            <span class="font-weight-bold">{{ ability.name }}.</span>
            <DiceText :text="ability.desc" />
          </p>
        </div>
      </template>

      <template v-if="characterData.actions?.length > 0">
        <v-divider />
        <div class="pa-3 text-body-2">
          <p class="text-overline font-weight-bold mb-1">Actions</p>
          <p
            v-for="(action, index) in characterData.actions"
            :key="`action-${index}`"
            class="mb-2"
          >
            <span class="font-weight-bold">{{ action.name }}.</span>
            <DiceText :text="action.desc" />
          </p>
        </div>
      </template>

      <template v-if="characterData.legendary_actions?.length > 0">
        <v-divider />
        <div class="pa-3 text-body-2">
          <p class="text-overline font-weight-bold mb-1">Legendary Actions</p>
          <p class="text-medium-emphasis mb-2">
            The {{ characterData.name }} can take 3 legendary actions, choosing from the options below. Only one legendary action option can be used at a time and only at the end of another creature's turn. The {{ characterData.name }} regains spent legendary actions at the start of its turn.
          </p>
          <p
            v-for="(action, index) in characterData.legendary_actions"
            :key="`legendary-${index}`"
            class="mb-2"
          >
            <span class="font-weight-bold">{{ action.name }}.</span>
            <DiceText :text="action.desc" />
          </p>
        </div>
      </template>

    </div>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Character } from '@/classes/Character'
import { stringModifier } from '@/utils/dnd'
import CharacterArmorClass from '@/components/characters/common/CharacterArmorClass.vue'
import CharacterHealth from '@/components/characters/common/CharacterHealth.vue'
import DiceText from '@/components/common/DiceText.vue'
import { CharacterAttributes } from '@/types/characterAttributes'

const props = defineProps<{
  characterData: Character
  isWide?: boolean
}>()

const statsArray = computed(() => CharacterAttributes)

function getDescription(): string {
  return Character.getDescription(props.characterData)
}

function getSpeedString(): string {
  return Character.getSpeedString(props.characterData)
}
</script>

<style>
.CharacterDetails-stats th,
.CharacterDetails-stats td {
  padding: 4px 6px;
}

.CharacterDetails-props {
  display: grid;
  grid-template-columns: 100px 1fr;
  row-gap: 4px;
  align-items: baseline;
}
</style>
