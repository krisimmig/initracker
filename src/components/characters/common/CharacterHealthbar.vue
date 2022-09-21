<template>
  <div class="CharacterHealthBar">
    <div @click.stop="showDialog = true">
      <div class="d-flex align-center">
        <v-progress-linear
          :value="hpInPercent"
          color="red darken-2"
          height="8"
          rounded
        >
        </v-progress-linear>
        <p class="ml-4 ma-0 text-no-wrap subtitle-2">{{ hp }} / {{ maxHp }}</p>
      </div>
    </div>

    <v-dialog v-model="showDialog" max-width="450">
      <v-card>
        <v-app-bar flat>
          <v-toolbar-title>Update Healthpoints</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click.stop="showDialog = false; hitPointChangeAmount = 0"><v-icon>mdi-close</v-icon></v-btn>
        </v-app-bar>
        <v-card-text>
          <div class="my-4 d-flex align-baseline">
            <v-text-field
              v-model="hitPointChangeAmount"
              hide-details
              type="number"
              class="mx-3"
              label="Amount"
              min="0"
            />

            <v-btn class="mx-1" :disabled="hitPointChangeAmount < 10" rounded outlined small @click="hitPointChangeAmount = Number(hitPointChangeAmount) - 10">
              <v-icon left>mdi-minus</v-icon>
              10
            </v-btn>
            <v-btn class="mx-1" :disabled="hitPointChangeAmount <= 0" rounded outlined small @click="hitPointChangeAmount = Number(hitPointChangeAmount - 1)">
              <v-icon left>mdi-minus</v-icon>
              1
            </v-btn>

            <v-btn class="mx-1" rounded outlined small @click="hitPointChangeAmount = Number(hitPointChangeAmount) + 1">
              <v-icon left>mdi-plus</v-icon>
              1
            </v-btn>
            <v-btn class="mx-1" rounded outlined small @click="hitPointChangeAmount = Number(hitPointChangeAmount) + 10">
              <v-icon left>mdi-plus</v-icon>
              10
            </v-btn>
          </div>

          <v-row class="mb-2">
            <v-col>
              <v-btn block @click="changeHitPoints()" color="error">
                <v-icon left>mdi-minus</v-icon>
                Damage
              </v-btn>
            </v-col>

            <v-col>
              <v-btn block @click="changeHitPoints({ subtract: false })" color="primary">
                <v-icon left>mdi-plus</v-icon>
                Heal
              </v-btn>
            </v-col>
          </v-row>

          <v-btn block @click="resetHitPoints()"><v-icon left>mdi-repeat</v-icon> Reset to full health</v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
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
      this.hitPointChangeAmount = 0;
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
.CharacterHealthBar {
  border-radius: 3px;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  margin-left: -0.5rem;
  margin-right: -0.5rem;
  transition: background-color 100ms ease-in-out;
}

.CharacterHealthBar:hover {
  background-color: rgba(0,0,0,0.1);
}
</style>
