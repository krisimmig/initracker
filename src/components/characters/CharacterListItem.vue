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
        <h2 class="text-h6">
          <span class="CharacterListItem-initiative grey--text pr-2" @click.stop="openIniDialogue">{{ npc.initiative }}</span>
          <span :class="{ 'text-decoration-line-through grey--text': npc.hit_points_current <= 0 }">{{ npc.name }}</span>
        </h2>
        <p class="caption mb-0">{{ description }}</p>
      </div>

      <v-spacer />

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
          <v-list-item link @click="openIniDialogue">Set initiative</v-list-item>
          <v-list-item link v-if="removable" @click="$emit('remove')">Remove</v-list-item>
        </v-list>
      </v-menu>
    </div>

    <v-dialog v-model="showIniDiag" max-width="350px">
      <v-card>
        <v-app-bar flat>
          <v-toolbar-title>Set initiative</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click.stop="showIniDiag = false"><v-icon>mdi-close</v-icon></v-btn>
        </v-app-bar>
        <v-card-text>
          <div class="d-flex align-baseline mt-4">
            <v-text-field
              placeholder="Enter initiative"
              type="number"
              v-model.number="manualInitiative"
              @keyup.enter="setInitiative"
            />
            <v-btn @click="setInitiative" class="ml-4">Set initiative</v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <div>
      <v-hover>
        <CharacterHealthBar
          :uuid="npc.uuid"
          :name="npc.name"
          :hp="npc.hit_points_current"
          :maxHp="npc.hit_points"
        />
      </v-hover>
      <CharacterConditions :uuid="npc.uuid" :condition="npcConditions" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import {
  commitSetNpcInDetail,
  readGetEncountersCurrentId,
  readGetNpcUuidInDetail
} from '@/store/encountersModule';
import {Character, Character as ICharacter} from '@/classes/Character';
import CharacterHealthBar from '@/components/characters/common/CharacterHealthbar.vue';
import CharacterInitiative from '@/components/characters/common/CharacterInitiative.vue';
import CharacterConditions from '@/components/characters/common/CharacterCondition.vue';
import CharacterArmorClass from '@/components/characters/common/CharacterArmorClass.vue';
import { dispatchUpdateInitiative } from "@/store/npcsModule";

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

  private showIniDiag:boolean = false;
  public manualInitiative:number = 0;

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

  public openIniDialogue() {
    this.manualInitiative = this.npc.initiative;
    this.showIniDiag = true;
  }

  public setInitiative() {
    const encounterId = readGetEncountersCurrentId(this.$store);
    if (!encounterId || !this.npc.uuid) { return; }

    dispatchUpdateInitiative(this.$store, {
      encounterId,
      npcId: this.npc.uuid,
      newInitiative: this.manualInitiative,
    });

    this.showIniDiag = false;
  }

}
</script>

<style lang="scss">
.CharacterListItem {
  cursor: pointer;
}

.CharacterListItem h2 {
  padding-left: .3rem;
  padding-right: .3rem;
}

.CharacterListItem.is-active h2,
.CharacterListItem.is-active.is-selected h2,
.CharacterListItem.is-selected h2 {
  display: inline-block;
  background: #488fef;
  border-radius: 3px;
  color: #e2ebf1;
}

.CharacterListItem.is-selected h2 {
  background: #d4dff1;
  color: #041833;
}

.CharacterListItem-initiative:hover {
  color: #1a1a1a !important;
  transition: color 150ms ease-in-out;
}
</style>
