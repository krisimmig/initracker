<template>
  <div
    class="CharacterListItem card--interactive" v-if="npc"
    :class="{ 'is-active': isActive, 'is-selected': isSelected }"
    @click.stop="showInDetail"
  >
    <div class="flex flex-col items-center">
      <span v-if="removable" @click="$emit('remove')" class="CharacterListItem-removeButton">&times;</span>

      <div class="CharacterListItem-main flex justify-between items-center w-full">
        <CharacterArmorClass :armorClass="npc.armor_class" class="text-xs" />
        <h4 class="font-semibold mb-0" :class="{ 'font-bold' : isActive }">
          {{ npc.name }}
        </h4>
        <CharacterInitiative class="CharacterListItem-initiative ml-auto self-start mr-5" :initiative="npc.initiative" :uuid="npc.uuid" />
      </div>
    </div>

    <CharacterHealthBar
        :uuid="npc.uuid"
        :name="npc.name"
        :hp="npc.hit_points_current"
        :maxHp="npc.hit_points"
        class="pt-2"
    />

    <CharacterConditions :uuid="npc.uuid" :condition="npcConditions" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { commitSetNpcInDetail, readGetNpcUuidInDetail } from '@/store/encountersModule';
import { Character as ICharacter } from '@/classes/Character';
import CharacterHealthBar from '@/components/characters/common/CharacterHealthbar.vue';
import CharacterInitiative from '@/components/characters/common/CharacterInitiative.vue';
import CharacterConditions from '@/components/characters/common/CharacterCondition.vue';
import CharacterArmorClass from '@/components/characters/common/CharacterArmorClass.vue';

@Component({
  components: {
    CharacterHealthBar,
    CharacterInitiative,
    CharacterConditions,
    CharacterArmorClass,
  },
})
export default class CharacterListItem extends Vue {
  @Prop({ type: Boolean, required: true }) public removable!: boolean;
  @Prop({ type: Object, required: true }) public npc!: ICharacter;
  @Prop({ type: Boolean, required: true }) public isActive!: boolean;

  get selectedNpcUuid() {
    return readGetNpcUuidInDetail(this.$store);
  }

  get isSelected() {
    return this.npc.uuid === this.selectedNpcUuid;
  }

  get npcConditions() {
    return this.npc.conditions || [];
  }

  public showInDetail() {
    if (this.npc) {
      commitSetNpcInDetail(this.$store, this.npc);
    }
  }
}
</script>

<style lang="scss">
.CharacterListItem {
  position: relative;
  border-left: 7px solid theme('colors.gray.300');
}

.CharacterListItem-name {
  margin: .4em 0;
}

.CharacterListItem-removeButton {
  @apply
    bg-gray-200
    text-gray-600
    font-bold;
  position: absolute;
  top: 0;
  right: 0;
  border-bottom-left-radius: 6px;
  padding: 0.1em 0.4em;
}

.CharacterListItem-removeButton:hover {
  @apply bg-red-600 text-white;
}

.CharacterListItem.is-active {
  border-left-color: theme('colors.green.600') !important;
}

.CharacterListItem.is-selected {
  border-left-color: theme('colors.green.300');
}

.CharacterListItem-status {
  display: inline-block;
}
</style>
