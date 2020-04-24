<template>
  <div
    class="CharacterListItem" v-if="npc"
    :class="{ 'is-active': isActive, 'is-selected': isSelected }"
    @click="showInDetail"
  >

    <div class="CharacterListItem-main">
      <NpcInitiative class="CharacterListItem-initiative" :initiative="npc.initiative" :uuid="npc.uuid" />
      <h4 class="CharacterListItem-name">
        {{ npc.name }}
        <span v-if="removable" @click="$emit('remove')" style="color: red;"><b>X</b></span>
      </h4>
      <NpcStatus class="CharacterListItem-status" :statuses="npc.status" :uuid="npc.uuid" />
    </div>

    <NpcArmorClass :armorClass="npc.armor_class" />
    <NpcHealth :uuid="npc.uuid" :hp="npc.hit_points_current" :maxHp="npc.hit_points" />

  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { commitSetNpcInDetail, readGetNpcUuidInDetail } from '@/store/encountersModule';
import { Character as ICharacter } from '@/classes/Character';
import NpcHealth from '@/components/characters/common/CharacterHealth.vue';
import NpcInitiative from '@/components/characters/common/CharacterInitiative.vue';
import NpcStatus from '@/components/characters/common/CharacterStatus.vue';
import NpcArmorClass from '@/components/characters/common/CharacterArmorClass.vue';

@Component({
  components: {
    NpcHealth,
    NpcInitiative,
    NpcStatus,
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

  public showInDetail() {
    if (this.npc) {
      commitSetNpcInDetail(this.$store, this.npc);
    }
  }
}
</script>

<style lang="scss">
@import '../../scss/variables.scss';

.CharacterListItem {
  position: relative;
  border-left: 7px solid $color-7;
  border-bottom: 1px solid $color-5;
  padding: .8em;
  background-color: $color-white;
  display: flex;
  align-items: center;
}

.CharacterListItem-main {
  flex-grow: 1;
}

.CharacterListItem-name {
  margin: .4em 0;
}

.CharacterListItem.is-active {
  border-left-color: $color-1;
}

.CharacterListItem.is-selected {
  border-left-color: $color-2;
}

.CharacterListItem-initiative,
.CharacterListItem-status {
  display: inline-block;
}
</style>
