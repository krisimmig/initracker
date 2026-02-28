<template>
  <v-card
    v-if="npc"
    :class="[{ 'is-active': isActive, 'is-selected': isSelected, 'has-acted': hasActed }, `Category-${npc.category}`]"
    class="CharacterListItem mb-2"
    variant="outlined"
    @click.stop="showInDetail"
  >
    <v-card-item class="py-2 px-3">
      <template #prepend>
        <CharacterArmorClass :armorClass="npc.armor_class" />
      </template>

      <v-card-title class="text-body-1 font-weight-bold pa-0">
        <span class="text-medium-emphasis text-body-2 pr-2">{{ npc.initiative }}</span>
        <span :class="{ 'text-decoration-line-through text-disabled': npc.hit_points_current <= 0 }">
          {{ npc.name }}
        </span>
      </v-card-title>
      <v-card-subtitle class="text-caption pa-0">{{ description }}</v-card-subtitle>

      <template #append>
        <v-menu location="bottom end" :close-on-content-click="true">
          <template #activator="{ props: activatorProps }">
            <v-btn icon variant="text" size="small" v-bind="activatorProps" @click.stop>
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list density="compact">
            <CharacterInitiative :initiative="npc.initiative" :uuid="npc.uuid" />
            <v-list-item v-if="removable" prepend-icon="mdi-account-remove" @click="emit('remove')">
              <v-list-item-title>Remove</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-card-item>

    <v-card-text class="px-3 pt-0 pb-2">
      <CharacterHealthBar
        :uuid="npc.uuid"
        :name="npc.name"
        :hp="npc.hit_points_current"
        :maxHp="npc.hit_points"
      />
      <CharacterConditions
        :uuid="npc.uuid"
        :name="npc.name"
        :conditions="npcConditions"
      />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useEncountersStore } from '@/store/useEncountersStore'
import { Character, Character as ICharacter } from '@/classes/Character'
import CharacterHealthBar from '@/components/characters/common/CharacterHealthbar.vue'
import CharacterInitiative from '@/components/characters/common/CharacterInitiative.vue'
import CharacterConditions from '@/components/characters/common/CharacterCondition.vue'
import CharacterArmorClass from '@/components/characters/common/CharacterArmorClass.vue'

const props = defineProps<{
  npc: ICharacter
  isActive: boolean
  removable: boolean
  hasActed?: boolean
}>()

const emit = defineEmits<{
  remove: []
}>()

const encountersStore = useEncountersStore()

const selectedNpcUuid = computed(() => encountersStore.npcUuidInDetail())
const isSelected = computed(() => props.npc.uuid === selectedNpcUuid.value)
const npcConditions = computed(() => props.npc.conditions || [])
const description = computed(() => Character.getDescription(props.npc))

function showInDetail() {
  if (props.npc) {
    encountersStore.setNpcInDetail(props.npc)
  }
}
</script>

<style>
.CharacterListItem {
  cursor: pointer;
  transition: border-color 0.15s ease;
}

.CharacterListItem.is-active {
  border-color: rgb(var(--v-theme-primary)) !important;
}

.CharacterListItem.is-selected {
  border-color: rgb(var(--v-theme-secondary)) !important;
}

.CharacterListItem.has-acted {
  opacity: 0.55;
}
</style>


