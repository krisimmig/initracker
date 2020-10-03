<template>
  <div>
    <div class="CharacterHealthBar w-full cursor-pointer hover:bg-gray-300 px-2 transition duration-200 rounded-md">
      <div @click.stop="showDialog = true">
        <div class="flex items-center w-full">
          <div class="relative flex-grow bg-gray-300 h-2 rounded overflow-hidden">
            <div class="absolute top-0 left-0 h-2 bg-red-600" :style="`width: ${hpInPercent}%;`"></div>
          </div>
          <div class="flex ml-4 w-20 justify-end">
            <div class="flex items-center">
              <span class="text-lg font-bold">{{ hp }}</span>
              <span class="text-sm text-gray-500 ml-1">/ {{ maxHp }}</span>
            </div>
          </div>
        </div>
      </div>

      <DialogueBox
        v-if="showDialog"
        @close="showDialog = false"
        @cancel="showDialog = false"
        :title="`Change ${name}´s health`"
      >
        <template v-slot:content>
          <Button is-big is-success @click="changeHitPoints({ subtract: false })">Heal</Button>
          <input
            type="number"
            v-model.number="hitPointChangeAmount"
            placeholder="Enter HP healed or damaged"
            class="Form-bigInput"
          >

          <Button is-danger is-big @click="changeHitPoints()">Damage</Button>
          <Button  is-big is-secondary @click="resetHitPoints()">Reset to full health</Button>
        </template>
      </DialogueBox>

    </div>
  </div>
</template>

<script lang='ts'>
  import { Component, Prop, Vue } from 'vue-property-decorator';

  import DialogueBox from '@/components/common/DialogueBox.vue';
  import { readGetEncountersCurrentId } from '@/store/encountersModule';
  import { dispatchUpdateHitPointCurrent } from '@/store/npcsModule';
  import Button from '@/components/common/Button.vue';

  @Component({
    components: {
      Button,
      DialogueBox,
    },
  })
  export default class CharacterHealthBar extends Vue {
    public showDialog: boolean = false;
    public hitPointChangeAmount: number = 0;

    @Prop({ type: String }) private uuid!: string;
    @Prop({ type: String }) private name!: string;
    @Prop({ type: Number, required: true }) private hp!: number;
    @Prop({ type: Number, required: false }) private maxHp!: number;

    public get hpInPercent() {
      if (this.hp < 0) { return 0; }
      if (this.hp > this.maxHp) { return 100; }
      return this.hp / (this.maxHp / 100);
    }

    public resetHitPoints() {
      const encounterId = readGetEncountersCurrentId(this.$store);
      if (!encounterId) { return; }

      dispatchUpdateHitPointCurrent(this.$store, {
        encounterId,
        npcId: this.uuid,
        newHitPoints: this.maxHp,
      });
      this.showDialog = false;
    }

    public changeHitPoints({ subtract } = { subtract: true }) {
      const encounterId = readGetEncountersCurrentId(this.$store);
      if (!encounterId) { return; }
      let newHitPoints;

      if (subtract) {
        newHitPoints = this.hp - this.hitPointChangeAmount;
      } else {
        newHitPoints = this.hp + this.hitPointChangeAmount;
      }
      dispatchUpdateHitPointCurrent(this.$store, {
        encounterId,
        npcId: this.uuid,
        newHitPoints,
      });

      this.showDialog = false;
      this.hitPointChangeAmount = 0;
    }
  }
</script>

<style lang="scss">
</style>
