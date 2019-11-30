<template>
  <div class="CharacterHealth">
    <div class="CharacterHealth-wrapper" :class="{ 'has-maxHp' : maxHp }" @click="showHealthDialogue = true">
      <SvgIcon name="heart" class="CharacterHealth-icon" />
      <div class="CharacterHealth-hpWrapper">
        <p class="CharacterHealth-hp">{{ hp }}</p>
        <p class="CharacterHealth-maxHp" v-if="maxHp">of {{ maxHp }}</p>
      </div>
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
export default class CharacterHealth extends Vue {
  public showHealthDialogue: boolean = false;
  public hitPointChangeAmount: number = 0;

  @Prop({ type: String }) private uuid!: string;
  @Prop({ type: Number, required: true }) private hp!: number;
  @Prop({ type: Number, required: false }) private maxHp!: number;

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
@import '../../../scss/variables.scss';

$width: 2.5em;

.CharacterHealth-wrapper {
  position: relative;
  width: $width;
  height: $width;
  cursor: pointer;
}

.CharacterHealth-wrapper.has-maxHp {
  position: relative;
  width: 6em;
  height: $width;
  cursor: pointer;
}

.CharacterHealth-wrapper:hover {
  background-color: #fff;
}

.CharacterHealth-hpWrapper {
  position: absolute;
  align-items: center;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
}

.CharacterHealth-hp {
  font-weight: 700;
  text-align: center;
  width: 2.5em;
}

.CharacterHealth-maxHp {
  opacity: 0.6;
  font-size: 0.8em;
  margin-left: 0.5em;
}

.CharacterHealth-icon {
  color: $color-2;
  font-size: $width;
}
</style>
