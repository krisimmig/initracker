<template>
  <div
    class="NpcListItem" v-if="npc"
    :class="{ 'is-active': isActive }"
  >
    <div>
      <h4 class="NpcListItem-name" @click="showInDetail">
        {{ npc.name }}
        <span v-if="removable" @click="$emit('remove')" style="color: red;"><b>X</b></span>
      </h4>

      AC: {{ npc.armor_class }}
      <NpcHealth :uuid="npc.uuid" :hp="npc.hit_points_current" :maxHp="npc.hit_points" />
    </div>

    <div>
      <NpcInitiative :initiative="npc.initiative" :uuid="npc.uuid" />
      <NpcStatus :statuses="npc.status" :uuid="npc.uuid" />
    </div>
  </div>
</template>

<script lang='ts'>
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import * as npcsModule from '@/store/npcsModule';
  import * as encountersModule from '@/store/encountersModule';
  import {StatusTypes} from '@/types/characters';
  import {Character as ICharacter} from '@/classes/Character';
  import NpcHealth from '@/components/npcs/common/NpcHealth.vue';
  import NpcInitiative from '@/components/npcs/common/NpcInitiative.vue';
  import NpcStatus from '@/components/npcs/common/NpcStatus.vue';

  @Component({
    components: {
      NpcHealth,
      NpcInitiative,
      NpcStatus,
    },
  })
export default class NpcListItem extends Vue {
  @Prop(Boolean) public removable!: boolean;
  @Prop(Object) public npc!: ICharacter;
  @Prop(Boolean) public isActive!: boolean;
  public newStatus: StatusTypes | 'default' = 'default';
  public showStatusSelect: boolean = false;

  public statusString(enumValue: StatusTypes): string {
    return StatusTypes[enumValue];
  }

  public showInDetail() {
    if (this.npc) {
      encountersModule.commitSetNpcInDetail(this.$store, this.npc);
    }
  }
}
</script>

<style>
  .NpcListItem {
    border: 1px solid gainsboro;
    background-color: ghostwhite;
    padding: 0 20px 10px 19px;
    margin-bottom: 15px;
    position: relative;
  }

  .NpcListItem-name {
    font-weight: 500;
  }

  .NpcListItem.is-active {
    border-color: green;
    background-color: rgb(189, 255, 214);
  }

  .NpcListItem-status {
    display: inline-block;
    color: #ffffff;
    border: 1px solid blue;
    padding: 2px 7px;
    margin-right: 5px;
    border-radius: 12px;
    background-color: #6162fe;
  }

  .NpcListItem-statusSelect {
    position: absolute;
    top: 0;
    left: 0;
  }

  .NpcListItem-hpChangerUi {
    position: absolute;
    top: 0;
    left: 0;
  }

  .NpcListItem-HP {
    display: inline-block;
    border: 1px solid #08199f;
    border-radius: 4px;
    padding: 2px 5px;
    background: #6e0ca3;
    color: white;
    cursor: pointer;
  }
</style>
