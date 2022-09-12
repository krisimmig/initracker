<template>
  <div
    v-if="npc"
    :class="{ 'is-active': isActive, 'is-selected': isSelected }"
    @click.stop="showInDetail"
  >
    <div class="d-flex align-center">
      <CharacterArmorClass :armorClass="npc.armor_class" />
      <div>
        <h2 class="text-h6">
          <span class="grey--text">{{ npc.initiative }}</span>
          {{ npc.name }}</h2>
        <p class="caption mb-0">{{ description }}</p>
      </div>

      <v-spacer></v-spacer>

      <v-menu bottom left>
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            v-on="on"
            class="align-self-start"
          >
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item link>
            <CharacterInitiative :initiative="npc.initiative" :uuid="npc.uuid" />
          </v-list-item>
          <v-list-item link v-if="removable" @click="$emit('remove')">
            Remove
          </v-list-item>
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
      <CharacterConditions :uuid="npc.uuid" :condition="npcConditions" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { commitSetNpcInDetail, readGetNpcUuidInDetail } from '@/store/encountersModule';
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

</style>
