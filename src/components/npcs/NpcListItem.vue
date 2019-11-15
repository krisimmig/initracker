<template>
  <div
    class="NpcListItem" v-if="npc"
    :class="{ 'is-active': isActive, 'is-selected': isSelected }"
    @click="showInDetail"
  >

    <div class="NpcListItem-main">
      <NpcInitiative class="NpcListItem-initiative" :initiative="npc.initiative" :uuid="npc.uuid" />
      <h4 class="NpcListItem-name">
        {{ npc.name }}
        <span v-if="removable" @click="$emit('remove')" style="color: red;"><b>X</b></span>
      </h4>
      <NpcStatus class="NpcListItem-status" :statuses="npc.status" :uuid="npc.uuid" />
    </div>

    <NpcArmorClass :armorClass="npc.armor_class" />
    <NpcHealth :uuid="npc.uuid" :hp="npc.hit_points_current" :maxHp="npc.hit_points" />

  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator';
import { commitSetNpcInDetail, readGetNpcUuidInDetail } from '@/store/encountersModule';
import { Character as ICharacter } from '@/classes/Character';
import NpcHealth from '@/components/npcs/common/NpcHealth.vue';
import NpcInitiative from '@/components/npcs/common/NpcInitiative.vue';
import NpcStatus from '@/components/npcs/common/NpcStatus.vue';
import NpcArmorClass from '@/components/npcs/common/NpcArmorClass.vue';

@Component({
  components: {
    NpcHealth,
    NpcInitiative,
    NpcStatus,
    NpcArmorClass,
  },
})
export default class NpcListItem extends Vue {
  @Prop({ type: Boolean, required: true }) public removable!: boolean;
  @Prop({ type: Object, required: true }) public npc!: ICharacter;
  @Prop({ type: Boolean, required: true }) public isActive!: boolean;

  get selectedNpcUuis() {
    return readGetNpcUuidInDetail(this.$store);
  }

  get isSelected() {
    return this.npc.uuid === this.selectedNpcUuis;
  }

  public showInDetail() {
    if (this.npc) {
      commitSetNpcInDetail(this.$store, this.npc);
    }
  }
}
</script>

<style lang="scss">
@import '@/scss/variables.scss';

.NpcListItem {
  position: relative;
  border-left: 7px solid $color-7;
  border-bottom: 1px solid $color-5;
  padding: .8em;
  background-color: $color-white;
  display: flex;
  align-items: center;
}

.NpcListItem-main {
  flex-grow: 1;
}

.NpcListItem-name {
  font-weight: 600;
  margin: .4em 0;
}

.NpcListItem.is-active {
  border-left-color: $color-1;
}

.NpcListItem.is-selected {
  border-left-color: $color-2;
}

.NpcListItem-initiative,
.NpcListItem-status {
  display: inline-block;
}
</style>
