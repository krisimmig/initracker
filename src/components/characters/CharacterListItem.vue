<template>
  <div
    class="CharacterListItem card--interactive" v-if="npc"
    :class="{ 'is-active': isActive, 'is-selected': isSelected }"
    @click.stop="showInDetail"
  >
    <div class="flex flex-col items-center">

      <div class="CharacterListItem-main flex justify-between items-center w-full">
        <NpcArmorClass :armorClass="npc.armor_class" class="text-xs" />
        <h4 class="font-semibold mb-0" :class="{ 'font-bold' : isActive }">
          {{ npc.name }}
          <span v-if="removable" @click="$emit('remove')" class="text-red-600 font-bold">&times;</span>
        </h4>
        <NpcInitiative class="CharacterListItem-initiative ml-auto self-start" :initiative="npc.initiative" :uuid="npc.uuid" />
      </div>
    </div>

    <NpcHealthBar :uuid="npc.uuid" :hp="npc.hit_points_current" :maxHp="npc.hit_points" class="pt-2"/>

    <NpcConditions :uuid="npc.uuid" :condition="npcConditions" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { commitSetNpcInDetail, readGetNpcUuidInDetail } from '@/store/encountersModule';
import { Character as ICharacter } from '@/classes/Character';
import NpcHealthBar from '@/components/characters/common/CharacterHealthbar.vue';
import NpcInitiative from '@/components/characters/common/CharacterInitiative.vue';
import NpcConditions from '@/components/characters/common/CharacterCondition.vue';
import NpcArmorClass from '@/components/characters/common/CharacterArmorClass.vue';

@Component({
  components: {
    NpcHealthBar,
    NpcInitiative,
    NpcConditions,
    NpcArmorClass,
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
  border-left: 7px solid theme('colors.gray.300');
}

.CharacterListItem-name {
  margin: .4em 0;
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
