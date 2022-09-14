<template>
  <div class="NpcInitiative">

    <span @click="showInitiativeInput = true" class="NpcInitiative-wrapper">
      Set Initiative
    </span>

    <v-dialog v-if="showInitiativeInput">
      <v-card>
        <input
          placeholder="Enter inititive"
          type="number"
          v-model.number="manuelInitiative"
          @keyup.enter="setInitiative"
          class="Form-bigInput"
        >
        <v-btn is-big @click="setInitiative">Set initiative</v-btn>
      </v-card>
    </v-dialog>

  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator';

import DialogueBox from '@/components/common/DialogueBox.vue';
import { readGetEncountersCurrentId } from '@/store/encountersModule';
import { dispatchUpdateInitiative } from '@/store/npcsModule';
import Button from '@/components/common/Button.vue';

@Component({
  components: {
    Button,
    DialogueBox,
  },
})
export default class NpcInitiative extends Vue {
  public showInitiativeInput: boolean = false;
  public manuelInitiative: number = 0;

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

    this.showInitiativeInput = false;
  }
}
</script>

<style lang="scss">
</style>
