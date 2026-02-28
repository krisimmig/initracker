<template>
  <div
    v-if="npc"
    :class="[{ 'is-active': isActive, 'is-selected': isSelected, 'has-acted': hasActed }, `Category-${npc.category}`]"
    class="CharacterListItem"
    @click.stop="showInDetail"
  >
    <div class="d-flex align-center">
      <CharacterArmorClass :armorClass="npc.armor_class"/>
      <div>
        <h2 class="CharacterListItem-name text-h6">
          <span class="text-grey pr-2">{{ npc.initiative }}</span>
          <span :class="{ 'text-decoration-line-through text-grey': npc.hit_points_current <= 0 }">
            {{ npc.name }}
          </span>
        </h2>
        <p class="text-caption mb-0">{{ description }}</p>
      </div>

      <v-spacer />

      <v-menu location="bottom end" :close-on-content-click="true">
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn
            icon
            v-bind="activatorProps"
            class="align-self-start"
          >
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <CharacterInitiative :initiative="npc.initiative" :uuid="npc.uuid" />
          <v-list-item v-if="removable" @click="emit('remove')">Remove</v-list-item>
        </v-list>
      </v-menu>
    </div>

    <div>
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
    </div>
  </div>
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
  border: 1px solid #d5d5d5;
  background-color: white;
  border-radius: 5px;
  margin-bottom: 5px;
  padding: 0.7rem 1rem 1rem 1rem;
}

.Category-Enemy {
  border-color: #e0e0e0;
}

.Category-Player {
  border-color: #5ab3fd;
}

.Category-NPC {
  border-color: #c500cb;
}

.Category-Other {
  border-color: #ffa600;
}

.CharacterListItem.is-active {
  border-color: #3d3df0;
}

.CharacterListItem.has-acted {
  opacity: 0.6;
}

.CharacterListItem.has-acted:hover {
  opacity: 1;
}

.CharacterListItem-name {
  display: inline-block;
  position: relative;
  padding-left: .3rem;
  padding-right: .3rem;
}

.CharacterListItem.is-selected {
  border-color: black;
  box-shadow: 0 0 20px 1px #ececec;
}

.CharacterListItem.is-selected .CharacterListItem-name:after {
  background: #8fb3e1;
}
</style>
