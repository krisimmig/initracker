<template>
  <div class="NpcHealth">

    <p @click="showHealthDialogue = true">Health: {{ hp }}/{{ maxHp }}</p>

    <DialogueBox
      v-if="showHealthDialogue"
      @close="showHealthDialogue = false"
      @cancel="showHealthDialogue = false"
    >
      <template v-slot:content>
        <input
          type="number"
          v-model.number="hitPointChangeAmount"
          placeholder="Enter HP healed or damaged"
        >
      </template>

      <template v-slot:actions>
        <button @click="changeHitPoints({ subtract: false})">Heal</button>
        <button @click="changeHitPoints()">Damage</button>
      </template>
    </DialogueBox>

  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator';
import DialogueBox from '@/components/common/DialogueBox.vue';
import { readGetEncountersCurrentId } from '@/store/encountersModule';
import { dispatchUpdateHitPointCurrent } from '@/store/npcsModule';

@Component({
  components: {
    DialogueBox,
  },
})
export default class NpcHealth extends Vue {
  public showHealthDialogue: boolean = false;
  public hitPointChangeAmount: number = 0;

  @Prop(String) private uuid!: string;
  @Prop(Number) private hp!: number;
  @Prop(Number) private maxHp!: number;

  public changeHitPoints({ subtract } = { subtract: true }) {
    const encounterId = readGetEncountersCurrentId(this.$store);
    if (!encounterId) { return; }
    let newHitPoints = 0;

    if (subtract) {
      newHitPoints = this.hp - this.hitPointChangeAmount;
    } else {
      newHitPoints = Math.min(this.maxHp, this.hp + this.hitPointChangeAmount);
    }
    dispatchUpdateHitPointCurrent(this.$store, {
      encounterId,
      npcId: this.uuid,
      newHitPoints,
    });

    this.showHealthDialogue = false;
  }
}
</script>

<style scoped>

</style>
