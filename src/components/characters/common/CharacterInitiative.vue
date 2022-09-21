<template>
  <v-dialog v-model="showInitiativeInput" max-width="350px">
    <template v-slot:activator="{ on, attrs }">
      <v-list-item
        v-bind="attrs"
        v-on="on"
      >
        Set initiative
      </v-list-item>
    </template>

    <v-card>
      <v-app-bar flat>
        <v-toolbar-title>Set initiative</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click.stop="showInitiativeInput = false"><v-icon>mdi-close</v-icon></v-btn>
      </v-app-bar>
      <v-card-text>
        <div class="d-flex align-baseline mt-4">
          <v-text-field
            min="1"
            placeholder="Enter initiative"
            type="number"
            v-model.number="manuelInitiative"
            @keyup.enter="setInitiative"
          />
          <v-btn @click="setInitiative" class="ml-4">Set initiative</v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator';

import { readGetEncountersCurrentId } from '@/store/encountersModule';
import { dispatchUpdateInitiative } from '@/store/npcsModule';

@Component
export default class NpcInitiative extends Vue {
  public showInitiativeInput: boolean = false;
  public manuelInitiative: number = 1;

  @Prop({ required: true, type: String }) private uuid!: string;
  @Prop({ required: true, type: Number }) private initiative!: number;

  public setInitiative() {
    const encounterId = readGetEncountersCurrentId(this.$store);
    if (!encounterId) { return; }

    dispatchUpdateInitiative(this.$store, {
      encounterId,
      npcId: this.uuid,
      newInitiative: this.manuelInitiative,
    });

    this.manuelInitiative = 0;
    this.showInitiativeInput = false;
  }
}
</script>

<style lang="scss">
</style>
