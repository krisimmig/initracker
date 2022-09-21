<template>
  <div
    v-if="npc"
    class="CharacterListItem"
    :class="{ 'is-active': isActive, 'is-selected': isSelected }"
    @click.stop="showInDetail"
  >
    <div class="d-flex align-center">
      <CharacterArmorClass :armorClass="npc.armor_class" />
      <div>
        <h2 class="CharacterListItem-name text-h6">
          <span class="grey--text pr-2">{{ npc.initiative }}</span>
          <span :class="{ 'text-decoration-line-through grey--text': npc.hit_points_current <= 0 }">{{ npc.name }}</span>
        </h2>
        <p class="caption mb-0">{{ description }}</p>
      </div>

      <v-spacer />

      <v-menu bottom left :close-on-content-click="true">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            v-on="on"
            v-bind="attrs"
            class="align-self-start"
          >
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <CharacterInitiative :initiative="npc.initiative" :uuid="npc.uuid" />
          <v-list-item link v-if="removable" @click="$emit('remove')">Remove</v-list-item>
        </v-list>
      </v-menu>
    </div>

    <div>
      <v-hover>
        <CharacterHealthBar
          :uuid="npc.uuid"
          :name="npc.name"
          :hp="npc.hit_points_current"
          :maxHp="npc.hit_points"
        />
      </v-hover>
      <CharacterConditions :uuid="npc.uuid" :conditions="npcConditions" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import {
  commitSetNpcInDetail,
  readGetNpcUuidInDetail
} from '@/store/encountersModule';
import {Character, Character as ICharacter} from '@/classes/Character';
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

  public get description() {
    const npc = new Character(this.npc);
    return npc.getDescription();
  }
}
</script>

<style lang="scss">
.CharacterListItem {
  cursor: pointer;
}

.CharacterListItem-name {
  display: inline-block;
  position: relative;
  padding-left: .3rem;
  padding-right: .3rem;
}

.CharacterListItem.is-active .CharacterListItem-name:after,
.CharacterListItem.is-active.is-selected .CharacterListItem-name:after,
.CharacterListItem.is-selected .CharacterListItem-name:after {
  content: "";
  position: absolute;
  display: block;
  background: #1f7bf3;
  border-radius: 2rem;
  right: -0.5rem;
  top: 0.7em;
  width: 0.4rem;
  height: 0.4rem;
}

.CharacterListItem.is-selected .CharacterListItem-name:after {
  background: #8fb3e1;
}
</style>
