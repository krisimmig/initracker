<template>
  <div class="NpcHealth">
    <div class="NpcHealth-wrapper" @click="showHealthDialogue = true">
      <SvgIcon name="heart" class="NpcHealth-icon" />
      <div class="NpcHealth-hp">{{ hp }}</div>
    </div>

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
import SvgIcon from '@/components/common/SvgIcon.vue';
import { readGetEncountersCurrentId } from '@/store/encountersModule';
import { dispatchUpdateHitPointCurrent } from '@/store/npcsModule';

@Component({
  components: {
    DialogueBox,
    SvgIcon,
  },
})
export default class NpcHealth extends Vue {
  public showHealthDialogue: boolean = false;
  public hitPointChangeAmount: number = 0;

  @Prop({ type: String, required: true }) private uuid!: string;
  @Prop({ type: Number, required: true }) private hp!: number;
  @Prop({ type: Number, required: true }) private maxHp!: number;

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

<style lang="scss">
@import '@/scss/variables.scss';

$width: 2.5em;

.NpcHealth-wrapper {
  position: relative;
  width: $width;
  height: $width;
  cursor: pointer;
}

.NpcHealth-wrapper:hover {
  background-color: #fff;
}

.NpcHealth-hp {
  font-weight: 700;
  position: absolute;
  top: .6em;
  left: 0;
  width: 100%;
  text-align: center;
}

.NpcHealth-icon {
  color: $color-2;
  font-size: $width;
}
</style>
