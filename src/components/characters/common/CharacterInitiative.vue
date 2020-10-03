<template>
  <div class="NpcInitiative">

    <span @click="showInitiativeInput = true" class="NpcInitiative-wrapper">
      <span class="NpcInitiative-title">Initiative </span><b>{{ initiative }}</b>
    </span>

    <DialogueBox
      v-if="showInitiativeInput"
      @cancel="showInitiativeInput = false"
      title="Change this characters initiative"
    >
      <template v-slot:content>
        <input
          placeholder="Enter inititive"
          type="number"
          v-model.number="manuelInitiative"
          @keyup.enter="setInititive"
          class="Form-bigInput"
        >
        <Button is-big @click="setInititive">Set initiative</Button>
      </template>
    </DialogueBox>

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

  public setInititive() {
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
.NpcInitiative-wrapper {
  font-size: .8em;
  cursor: pointer;
}

.NpcInitiative-title {
  color: theme('colors.gray.600');
}

.NpcInitiative-wrapper:hover .NpcInitiative-title {
  color: deeppink;
}
</style>
