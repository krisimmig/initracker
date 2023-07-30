<template>
  <div class="my-8">
    <div class="d-flex justify-space-between align-center">
      <h3>{{ title }}</h3>
      <v-spacer></v-spacer>
      <CharacterAbilityDialogue @change="handleChangeEvent($event)">
        <template #button>
          <v-btn color="primary" text>
            <v-icon left>mdi-plus</v-icon> Add
          </v-btn>
        </template>
      </CharacterAbilityDialogue>
    </div>

    <v-divider class="mb-4"></v-divider>

    <p v-if="abilities.length === 0" class="grey--text">Nothing here, yet.</p>

    <ul style="list-style: none" class="ma-0 pa-0">
      <li
        v-for="(ability, index) in abilities"
        :key="`ability-${type}-${getUuid()}`"
      >
          <div class="d-flex">
            <p><strong>{{ ability.name}}.</strong> {{ ability.desc }}</p>
            <v-spacer />
            <CharacterAbilityDialogue :ability="ability" @change="handleChangeEvent($event, index)" class="mr-2">
              <template #button>
                <v-btn small color="primary" depressed text>
                  <v-icon left>mdi-pencil-outline</v-icon> Edit
                </v-btn>
              </template>
            </CharacterAbilityDialogue>
          </div>
      </li>
    </ul>
  </div>
</template>

<script lang='ts'>
import uuid from 'uuid/v1';

import { Component, Prop, Vue } from 'vue-property-decorator';
import Collapsable from "@/components/common/Collapsable.vue";
import CharacterAbilityDialogue from "@/components/characters/character-builder/CharacterAbilityDialogue.vue";

@Component({
  components: {CharacterAbilityDialogue, Collapsable}
})
export default class CharacterAbilitiesEditor extends Vue {
  @Prop({ required: true, type: String }) private type!: string;
  @Prop({ required: true, type: String }) private title!: string;
  @Prop({ required: true, type: Array }) private abilities!: [{ name: string, desc: string }];

  public getUuid() {
    return uuid();
  }

  public handleChangeEvent(payload, index: null | number = null): void {
    this.$emit('change', {...payload, index, type: this.type });
  }
}
</script>

<style lang="scss">
</style>
